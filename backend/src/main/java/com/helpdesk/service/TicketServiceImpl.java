package com.helpdesk.service;

import com.helpdesk.mapper.TicketMapper;
import com.helpdesk.model.dto.TicketDTO;
import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.interfaces.TicketService;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Override
    public TicketDTO createTicket(TicketDTO dto) {
        Ticket ticket = TicketMapper.toEntity(dto);

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
    public List<TicketDTO> getAllTickets() {
        return ticketRepository.findAll()
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

        ticket.setAssignedTo(agent);
        ticket.setUpdatedAt(LocalDateTime.now());

        return TicketMapper.toDTO(ticketRepository.save(ticket));
    }

    @Override
    public TicketDTO changeStatus(Long ticketId, String status) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(Status.valueOf(status));
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