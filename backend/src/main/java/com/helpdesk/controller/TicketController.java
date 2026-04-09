package com.helpdesk.controller;

import com.helpdesk.model.dto.TicketDTO;
import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.interfaces.TicketService;
import com.helpdesk.service.TicketServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // CREATE
    @PostMapping
    public TicketDTO create(@RequestBody TicketDTO dto) {
        return ticketService.createTicket(dto);
    }

    // USER tickets
    @GetMapping("/user/{userId}")
    public List<TicketDTO> getUserTickets(@PathVariable Long userId) {
        return ticketService.getTicketsByUser(userId);
    }

    // LATEST
    @GetMapping("/latest")
    public List<TicketDTO> getLatest(@RequestParam(defaultValue = "10") int limit) {
        return ticketService.getLastTickets(limit);
    }

    // ALL
    @GetMapping
    public List<TicketDTO> getAll() {
        return ticketService.getAllTickets();
    }

    // ASSIGN
    @PutMapping("/{ticketId}/assign/{agentId}")
    public TicketDTO assign(@PathVariable Long ticketId, @PathVariable Long agentId) {
        return ticketService.assignTicket(ticketId, agentId);
    }

    // STATUS
    @PutMapping("/{ticketId}/status")
    public TicketDTO changeStatus(@PathVariable Long ticketId,
                                  @RequestParam String status) {
        return ticketService.changeStatus(ticketId, status);
    }
}
