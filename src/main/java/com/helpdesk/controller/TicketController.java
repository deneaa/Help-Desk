package com.helpdesk.controller;

import com.helpdesk.model.entities.Ticket;
import com.helpdesk.service.TicketServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketServiceImpl ticketService;

    // USER creează ticket
    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    // USER vede doar ticketurile lui
    @GetMapping("/user/{userId}")
    public List<Ticket> getUserTickets(@PathVariable Long userId) {
        return ticketService.getTicketsByUser(userId);
    }

    // AGENT vede toate ticketurile
    @GetMapping
    public List<Ticket> getAll() {
        return ticketService.getAllTickets();
    }

    // AGENT asignare
    @PutMapping("/{ticketId}/assign/{agentId}")
    public Ticket assign(@PathVariable Long ticketId, @PathVariable Long agentId) {
        return ticketService.assignTicket(ticketId, agentId);
    }

    // AGENT schimbă status
    @PutMapping("/{ticketId}/status")
    public Ticket changeStatus(@PathVariable Long ticketId,
                               @RequestParam String status) {
        return ticketService.changeStatus(ticketId, status);
    }
}