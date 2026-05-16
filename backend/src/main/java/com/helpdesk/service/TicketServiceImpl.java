package com.helpdesk.service;

import com.helpdesk.audit.Auditable;
import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.exceptions.ticket.*;
import com.helpdesk.exceptions.user.NotAnAgentException;
import com.helpdesk.mapper.TicketMapper;
import com.helpdesk.model.dto.notification.CreateNotificationDTO;
import com.helpdesk.model.dto.ticket.CreateTicketDTO;
import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import com.helpdesk.model.dto.ticket.UpdateTicketDTO;
import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.*;
import com.helpdesk.model.interfaces.NotificationService;
import com.helpdesk.model.interfaces.TicketService;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof UserPrincipal userPrincipal)) {
            throw new UnauthorizedActionException("Unauthorized");
        }

        return userPrincipal.getUser();
    }

    private Ticket getTicketByIdEntity(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    private User getUserByIdEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    @Override
    @Auditable(action = "CREATED_TICKET", entityType = "Ticket", auditType = AuditType.INSERT)
    public TicketResponseDTO createTicket(CreateTicketDTO dto) {
        User user = getAuthenticatedUser();
        Ticket ticket = TicketMapper.toEntity(dto);
        ticket.setCreatedBy(user);
        ticket.setStatus(Status.OPEN);
        ticket.setTicketType(dto.getTicketType());
        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    @Auditable(action = "UPDATED_TICKET", entityType = "Ticket", auditType = AuditType.UPDATE)
    public TicketResponseDTO updateTicket(Long id, UpdateTicketDTO dto) {
        User authenticatedUser = getAuthenticatedUser();
        Ticket ticket = getTicketByIdEntity(id);

        boolean isOwner = ticket.getCreatedBy().getId().equals(authenticatedUser.getId());

        if (!isOwner)
            throw new UnauthorizedActionException("You cannot update this ticket");
        if (ticket.getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();

        if (dto.getTitle() != null && !dto.getTitle().isBlank())
            ticket.setTitle(dto.getTitle().trim());
        if (dto.getDescription() != null && !dto.getDescription().isBlank())
            ticket.setDescription(dto.getDescription().trim());

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    @Auditable(action = "ASSIGNED_TICKET", entityType = "Ticket", auditType = AuditType.UPDATE)
    public TicketResponseDTO assignTicket(Long ticketId, Long agentId) {
        User authenticatedUser = getAuthenticatedUser();
        Ticket ticket = getTicketByIdEntity(ticketId);

        if (authenticatedUser.getRole() != Role.AGENT && authenticatedUser.getRole() != Role.ADMIN)
            throw new UnauthorizedActionException("Only Admins and Agents can assign tickets");

        User agent = getUserByIdEntity(agentId);

        if (agent.getRole() != Role.AGENT)
            throw new NotAnAgentException(agentId);
        if (ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(agentId))
            throw new TicketAlreadyAssignedException();
        if (ticket.getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();

        ticket.setAssignedTo(agent);
        TicketResponseDTO saved = TicketMapper.toDTO(ticketRepository.save(ticket));

        notificationService.createNotification(CreateNotificationDTO.builder()
                .recipientId(agent.getId())
                .message("Ti-a fost asignat un ticket nou: \"" + ticket.getTitle() + "\"")
                .type(NotificationType.TICKET_ASSIGNED)
                .referenceType(NotificationReferenceType.TICKET)
                .referenceId(ticket.getId())
                .redirectUrl("/tickets/" + ticket.getId())
                .build());

        return saved;
    }

    @Override
    @Auditable(action = "CHANGED_STATUS", entityType = "Ticket", auditType = AuditType.UPDATE)
    public TicketResponseDTO changeStatus(Long ticketId, Status status) {
        User authenticatedUser = getAuthenticatedUser();
        Ticket ticket = getTicketByIdEntity(ticketId);

        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;
        boolean isAssignedAgent = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(authenticatedUser.getId());

        if (!isAssignedAgent && !isAdmin)
            throw new UnauthorizedActionException("You cannot change the ticket status");
        if (ticket.getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();

        ticket.setStatus(status);
        TicketResponseDTO saved = TicketMapper.toDTO(ticketRepository.save(ticket));

        notificationService.createNotification(CreateNotificationDTO.builder()
                .recipientId(ticket.getCreatedBy().getId())
                .message("Statusul ticketului \"" + ticket.getTitle() + "\" a fost schimbat in " + status.name())
                .type(NotificationType.TICKET_STATUS_CHANGED)
                .referenceType(NotificationReferenceType.TICKET)
                .referenceId(ticket.getId())
                .redirectUrl("/tickets/" + ticket.getId())
                .build());

        return saved;
    }

    @Override
    @Auditable(action = "CHANGED_TICKET_TYPE", entityType = "Ticket", auditType = AuditType.UPDATE)
    public TicketResponseDTO changeTicketType(Long ticketId, TicketType type) {
        User authenticatedUser = getAuthenticatedUser();
        Ticket ticket = getTicketByIdEntity(ticketId);

        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;
        boolean isAssignedAgent = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(authenticatedUser.getId());

        if (!isAssignedAgent && !isAdmin)
            throw new UnauthorizedActionException("You cannot change the ticket type");
        if (ticket.getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();

        ticket.setTicketType(type);
        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    @Auditable(action = "UNASSIGNED_TICKET", entityType = "Ticket", auditType = AuditType.UPDATE)
    public TicketResponseDTO unassignTicket(Long ticketId) {
        User authenticatedUser = getAuthenticatedUser();
        Ticket ticket = getTicketByIdEntity(ticketId);

        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;
        boolean isAssignedAgent = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(authenticatedUser.getId());

        if (!isAssignedAgent && !isAdmin)
            throw new UnauthorizedActionException("You cannot unassign this ticket");
        if (ticket.getAssignedTo() == null)
            throw new TicketAlreadyUnassignedException();
        if (ticket.getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();

        Long oldAgentId = ticket.getAssignedTo().getId();
        String ticketTitle = ticket.getTitle();

        ticket.setAssignedTo(null);
        TicketResponseDTO saved = TicketMapper.toDTO(ticketRepository.save(ticket));

        notificationService.createNotification(CreateNotificationDTO.builder()
                .recipientId(oldAgentId)
                .message("Ai fost scos de pe ticketul \"" + ticketTitle + "\"")
                .type(NotificationType.TICKET_UNASSIGNED)
                .referenceType(NotificationReferenceType.TICKET)
                .referenceId(ticketId)
                .redirectUrl("/tickets/" + ticketId)
                .build());

        return saved;
    }

    @Override
    @Auditable(action = "CHANGE_TICKET_PRIORITY", entityType = "Ticket", auditType = AuditType.UPDATE)
    public TicketResponseDTO changePriority(Long ticketId, Priority priority) {
        User authenticatedUser = getAuthenticatedUser();
        Ticket ticket = getTicketByIdEntity(ticketId);

        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;
        boolean isAssignedAgent = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(authenticatedUser.getId());

        if (!isAssignedAgent && !isAdmin)
            throw new UnauthorizedActionException("You cannot change the ticket priority");
        if (ticket.getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();

        ticket.setPriority(priority);
        TicketResponseDTO saved = TicketMapper.toDTO(ticketRepository.save(ticket));

        notificationService.createNotification(CreateNotificationDTO.builder()
                .recipientId(ticket.getCreatedBy().getId())
                .message("Prioritatea ticketului \"" + ticket.getTitle() + "\" a fost schimbata in " + priority.name())
                .type(NotificationType.TICKET_PRIORITY_CHANGED)
                .referenceType(NotificationReferenceType.TICKET)
                .referenceId(ticket.getId())
                .redirectUrl("/tickets/" + ticket.getId())
                .build());

        return saved;
    }

    @Override
    @Auditable(action = "CHANGE_TICKET_CATEGORY", entityType = "Ticket", auditType = AuditType.UPDATE)
    public TicketResponseDTO changeCategory(Long ticketId, Category category){
        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser.getRole() != Role.ADMIN &&
                authenticatedUser.getRole() != Role.AGENT){
            throw new UnauthorizedActionException("Only Admins and Agents can change the category");
        }
        Ticket ticket = getTicketByIdEntity(ticketId);
        ticket.setCategory(category);

        TicketResponseDTO saved = TicketMapper.toDTO(ticketRepository.save(ticket));

        notificationService.createNotification(CreateNotificationDTO.builder()
                .message("Categoria ticketului \"" + ticket.getCategory() + "\" a fost schimbata in " + category.name())
                .type(NotificationType.TICKET_CATEGORY_CHANGED)
                .recipientId(ticket.getCreatedBy().getId())
                .referenceType(NotificationReferenceType.TICKET)
                .referenceId(ticket.getId())
                .redirectUrl("/tickets/" + ticket.getId())
                .build());

        return saved;
    }

    @Override
    @Auditable(action = "DELETED_TICKET", entityType = "Ticket", auditType = AuditType.DELETE)
    public void deleteTicket(Long id) {
        User authenticatedUser = getAuthenticatedUser();

        if (authenticatedUser.getRole() != Role.ADMIN)
            throw new UnauthorizedActionException("Only Admins can delete tickets");

        Ticket ticket = getTicketByIdEntity(id);
        ticketRepository.delete(ticket);
    }

    @Override
    public TicketResponseDTO getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(TicketMapper::toDTO)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    @Override
    public List<TicketResponseDTO> getAllTickets(int limit) {
        return ticketRepository
                .findAll(PageRequest.of(0, limit))
                .stream()
                .map(TicketMapper::toDTO)
                .toList();
    }

    @Override
    public List<TicketResponseDTO> getTicketsByUser(Long userId) {
        User authenticatedUser = getAuthenticatedUser();

        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;
        boolean isOwner = authenticatedUser.getId().equals(userId);

        if (!isAdmin && !isOwner)
            throw new UnauthorizedActionException("You cannot view these tickets");

        return ticketRepository.findByCreatedBy_Id(userId)
                .stream()
                .map(TicketMapper::toDTO)
                .toList();
    }

    @Override
    public List<TicketResponseDTO> getLastTickets(int limit) {
        return ticketRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(TicketMapper::toDTO)
                .toList();
    }

}