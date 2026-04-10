package com.helpdesk.controller;

import com.helpdesk.model.dto.ticket.*;
import com.helpdesk.model.interfaces.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TicketDTO create(@Valid @RequestBody CreateTicketDTO dto) {
        return ticketService.createTicket(dto);
    }

    // GET ALL (cu limit optional)
    @GetMapping
    public List<TicketDTO> getAll(@RequestParam(defaultValue = "10") int limit) {
        return ticketService.getAllTickets(limit);
    }

    // LATEST
    @GetMapping("/latest")
    public List<TicketDTO> getLatest(@RequestParam(defaultValue = "10") int limit) {
        return ticketService.getLastTickets(limit);
    }

    @GetMapping("/{id}")
    public TicketDTO getTicket(@Valid @PathVariable Long id){
        return ticketService.getTicketById(id);
    }

    // ASSIGN
    @PatchMapping("/{ticketId}/assign")
    public TicketDTO assign(
            @PathVariable Long ticketId,
            @Valid @RequestBody AssignRequestDTO request
    ) {
        return ticketService.assignTicket(ticketId, request.getAgentId());
    }

    @PatchMapping("{ticketId}/unassign")
    public TicketDTO unassign(@PathVariable Long ticketId){
        return ticketService.unassignTicket(ticketId);
    }

    // STATUS
    @PatchMapping("/{ticketId}/status")
    public TicketDTO changeStatus(
            @PathVariable Long ticketId,
            @Valid @RequestBody ChangeStatusRequestDTO request
    ) {
        return ticketService.changeStatus(ticketId, request.getStatus());
    }

    @PatchMapping("/{ticketId}/priority")
    public TicketDTO changePriority(
            @PathVariable Long ticketId,
            @Valid @RequestBody ChangePriorityRequestDTO request){
        return ticketService.changePriority(ticketId, request.getPriority());
    }
}