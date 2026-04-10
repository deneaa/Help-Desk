package com.helpdesk.service;

import com.helpdesk.exceptions.ticket.TicketNotFoundException;
import com.helpdesk.exceptions.user.NotAnAgentException;
import com.helpdesk.mapper.TicketMapper;
import com.helpdesk.model.dto.ticket.CreateTicketDTO;
import com.helpdesk.model.dto.ticket.TicketDTO;
import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.interfaces.TicketService;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Override
    public TicketDTO createTicket(CreateTicketDTO dto) {
        UserPrincipal userPrincipal =
                (UserPrincipal) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user = userPrincipal.getUser();

        Ticket ticket = TicketMapper.toEntity(dto);

        ticket.setCreatedBy(user);
        ticket.setStatus(Status.OPEN);

        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketDTO getTicketById(Long id) {
        return ticketRepository.findById(id)
                .map(TicketMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }

    @Override
    public List<TicketDTO> getAllTickets(int limit) {
        return ticketRepository
                .findAll(PageRequest.of(0, limit))
                .stream()
                .map(TicketMapper::toDTO)
                .toList();
    }

    @Override
    public List<TicketDTO> getTicketsByUser(Long userId) {
        return ticketRepository.findByCreatedById(userId)
                .stream()
                .map(TicketMapper::toDTO)
                .toList();
    }

    @Override
    public TicketDTO updateTicket(Long id, TicketDTO dto) {
        Ticket existing = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setCategory(dto.getCategory());
        existing.setUpdatedAt(LocalDateTime.now());

        return TicketMapper.toDTO(ticketRepository.save(existing));
    }

    @Override
    public TicketDTO assignTicket(Long ticketId, Long agentId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        if (agent.getRole() != Role.AGENT){
            throw new NotAnAgentException(agentId);
        }

        ticket.setAssignedTo(agent);
        ticket.setUpdatedAt(LocalDateTime.now());

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketDTO changeStatus(Long ticketId, Status status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setStatus(status);
        ticket.setUpdatedAt(LocalDateTime.now());

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }

    @Override
    public List<TicketDTO> getLastTickets(int limit) {
        return ticketRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .getContent()
                .stream()
                .map(TicketMapper::toDTO)
                .toList();
    }
}