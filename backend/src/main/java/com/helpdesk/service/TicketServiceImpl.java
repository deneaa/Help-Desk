package com.helpdesk.service;

import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.exceptions.ticket.TicketAlreadyAssignedException;
import com.helpdesk.exceptions.ticket.TicketAlreadyClosedException;
import com.helpdesk.exceptions.ticket.TicketAlreadyUnassignedException;
import com.helpdesk.exceptions.ticket.TicketNotFoundException;
import com.helpdesk.exceptions.user.NotAnAgentException;
import com.helpdesk.mapper.TicketMapper;
import com.helpdesk.model.dto.ticket.CreateTicketDTO;
import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import com.helpdesk.model.dto.ticket.UpdateTicketDTO;
import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Priority;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.enums.TicketType;
import com.helpdesk.model.interfaces.TicketService;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.UserPrincipal;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

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
    public TicketResponseDTO createTicket(CreateTicketDTO dto) {

        User user = getAuthenticatedUser();
        Ticket ticket = TicketMapper.toEntity(dto);

        ticket.setCreatedBy(user);
        ticket.setStatus(Status.OPEN);
        Ticket saved = ticketRepository.save(ticket);

        return TicketMapper.toDTO(saved);
    }

    @Override
    public TicketResponseDTO updateTicket(Long id, UpdateTicketDTO dto) {

        User authenticatedUser = getAuthenticatedUser();

        Ticket ticket = getTicketByIdEntity(id);

        boolean isOwner = ticket.getCreatedBy().getId().equals(authenticatedUser.getId());

        if (!isOwner){
            throw new UnauthorizedActionException("You cannot update this ticket");
        }

        if (ticket.getStatus() == Status.CLOSED){
            throw new TicketAlreadyClosedException();
        }

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            ticket.setTitle(dto.getTitle().trim());
        }

        if (dto.getDescription() != null &&
                !dto.getDescription().isBlank()) {

            ticket.setDescription(dto.getDescription().trim());
        }

        Ticket saved = ticketRepository.save(ticket);

        return TicketMapper.toDTO(saved);
    }


    @Override
    public TicketResponseDTO assignTicket(Long ticketId, Long agentId) {

        User authenticatedUser = getAuthenticatedUser();

        Ticket ticket = getTicketByIdEntity(ticketId);

        if (authenticatedUser.getRole() != Role.AGENT
                && authenticatedUser.getRole() != Role.ADMIN){
            throw new UnauthorizedActionException("Only Admins and Agents can assign tickets");
        }

        User agent = getUserByIdEntity(agentId);

        if (agent.getRole() != Role.AGENT){
            throw new NotAnAgentException(agentId);
        }

        if (ticket.getAssignedTo() != null && ticket.getAssignedTo().getId().equals(agentId)){
            throw new TicketAlreadyAssignedException();
        }

        if (ticket.getStatus() == Status.CLOSED){
            throw new TicketAlreadyClosedException();
        }

        ticket.setAssignedTo(agent);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO changeStatus(Long ticketId, Status status) {

        User authenticatedUser = getAuthenticatedUser();

        Ticket ticket = getTicketByIdEntity(ticketId);

        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;

        boolean isAssignedAgent = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(authenticatedUser.getId());

        if (!isAssignedAgent && !isAdmin){
            throw new UnauthorizedActionException("You cannot change the ticket status");
        }

        if (ticket.getStatus() == Status.CLOSED){
            throw new TicketAlreadyClosedException();
        }

        ticket.setStatus(status);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO changeTicketType(Long ticketId, TicketType type) {

        User authenticatedUser = getAuthenticatedUser();

        Ticket ticket = getTicketByIdEntity(ticketId);

        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;

        boolean isAssignedAgent = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(authenticatedUser.getId());

        if (!isAssignedAgent && !isAdmin){
            throw new UnauthorizedActionException("You cannot change the ticket type");
        }

        if (ticket.getStatus() == Status.CLOSED){
            throw new TicketAlreadyClosedException();
        }

        ticket.setTicketType(type);

        return TicketMapper.toDTO(ticketRepository.save(ticket));

    }

    @Override
    public TicketResponseDTO unassignTicket(Long ticketId) {

        User authenticatedUser = getAuthenticatedUser();

        Ticket ticket = getTicketByIdEntity(ticketId);

        boolean isAdmin =
                authenticatedUser.getRole() == Role.ADMIN;

        boolean isAssignedAgent =
                ticket.getAssignedTo() != null &&
                        ticket.getAssignedTo().getId()
                                .equals(authenticatedUser.getId());

        if (!isAssignedAgent && !isAdmin) {
            throw new UnauthorizedActionException(
                    "You cannot unassign this ticket"
            );
        }

        if (ticket.getAssignedTo() == null) {
            throw new TicketAlreadyUnassignedException();
        }

        if (ticket.getStatus() == Status.CLOSED) {
            throw new TicketAlreadyClosedException();
        }

        ticket.setAssignedTo(null);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO changePriority(Long ticketId, Priority priority) {

        User authenticatedUser = getAuthenticatedUser();

        Ticket ticket = getTicketByIdEntity(ticketId);

        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;

        boolean isAssignedAgent = ticket.getAssignedTo() != null &&
                ticket.getAssignedTo().getId().equals(authenticatedUser.getId());

        if (!isAssignedAgent && !isAdmin){
            throw new UnauthorizedActionException("You cannot change the ticket priority");
        }

        if (ticket.getStatus() == Status.CLOSED){
            throw new TicketAlreadyClosedException();
        }

        ticket.setPriority(priority);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public void deleteTicket(Long id) {
        User authenticatedUser = getAuthenticatedUser();

        if (authenticatedUser.getRole() != Role.ADMIN){
            throw new UnauthorizedActionException("Only Admins can delete tickets");
        }
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

        if (!isAdmin && !isOwner) {
            throw new UnauthorizedActionException(
                    "You cannot view these tickets"
            );
        }
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