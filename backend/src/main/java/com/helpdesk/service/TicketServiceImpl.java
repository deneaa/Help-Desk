package com.helpdesk.service;

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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Override
    public TicketResponseDTO createTicket(CreateTicketDTO dto) {

        UserPrincipal userPrincipal =
                (UserPrincipal) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user = userPrincipal.getUser();

        Ticket ticket = TicketMapper.toEntity(dto);

        ticket.setCreatedBy(user);
        ticket.setStatus(Status.OPEN);
        Ticket saved = ticketRepository.save(ticket);

        return TicketMapper.toDTO(saved);
    }

    @Override
    public TicketResponseDTO updateTicket(Long id, UpdateTicketDTO dto) {

        Ticket existing = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());

        return TicketMapper.toDTO(ticketRepository.save(existing));
    }


    @Override
    public TicketResponseDTO assignTicket(Long ticketId, Long agentId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != Role.AGENT) {
            throw new NotAnAgentException(agentId);
        }

        ticket.setAssignedTo(agent);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO changeStatus(Long ticketId, Status status) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setStatus(status);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO changeTicketType(Long ticketId, TicketType type) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setTicketType(type);

        return TicketMapper.toDTO(ticketRepository.save(ticket));

    }

    @Override
    public TicketResponseDTO unassignTicket(Long ticketId) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setAssignedTo(null);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponseDTO changePriority(Long ticketId, Priority priority) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setPriority(priority);

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    @Override
    public TicketResponseDTO getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(TicketMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
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