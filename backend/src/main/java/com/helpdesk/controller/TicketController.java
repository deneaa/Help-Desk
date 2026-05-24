package com.helpdesk.controller;

import com.helpdesk.model.dto.ticket.*;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.interfaces.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TicketResponseDTO create(@Valid @RequestBody CreateTicketDTO dto) {
        return ticketService.createTicket(dto);
    }

    @GetMapping
    public List<TicketResponseDTO> getAll(@RequestParam(defaultValue = "10") int limit) {
        return ticketService.getAllTickets(limit);
    }

    @PatchMapping("/{ticketId}")
    public TicketResponseDTO updateTicket(
            @PathVariable Long ticketId,
            @Valid @RequestBody UpdateTicketDTO dto) {
        return ticketService.updateTicket(ticketId, dto);
    }


    @GetMapping("/latest")
    public List<TicketResponseDTO> getLatest(@RequestParam(defaultValue = "10") int limit) {
        return ticketService.getLastTickets(limit);
    }

    @GetMapping("/{ticketId}")
    public TicketResponseDTO getTicket(@PathVariable Long ticketId){
        return ticketService.getTicketById(ticketId);
    }

    @PatchMapping("/{ticketId}/assign")
    public TicketResponseDTO assign(
            @PathVariable Long ticketId,
            @Valid @RequestBody AssignRequestDTO request
    ) {
        return ticketService.assignTicket(ticketId, request.getAgentId());
    }

    @PatchMapping("/{ticketId}/unassign")
    public TicketResponseDTO unassign(@PathVariable Long ticketId){
        return ticketService.unassignTicket(ticketId);
    }

    @PatchMapping("/{ticketId}/status")
    public TicketResponseDTO changeStatus(
            @PathVariable Long ticketId,
            @Valid @RequestBody ChangeStatusRequestDTO request
    ) {
        return ticketService.changeStatus(ticketId, request.getStatus());
    }

    @PatchMapping("/{ticketId}/priority")
    public TicketResponseDTO changePriority(
            @PathVariable Long ticketId,
            @Valid @RequestBody ChangePriorityRequestDTO request){
        return ticketService.changePriority(ticketId, request.getPriority());
    }

    @PatchMapping("/{ticketId}/ticketType")
    public TicketResponseDTO changeTicketType(
            @PathVariable Long ticketId,
            @Valid @RequestBody ChangeTicketTypeRequestDTO request){
        return ticketService.changeTicketType(ticketId, request.getType());
    }

    @PatchMapping("{ticketId}/category")
    public TicketResponseDTO changeCategory(
            @PathVariable Long ticketId,
            @Valid @RequestBody ChangeCategoryRequestDTO request){
        return ticketService.changeCategory(ticketId, request.getCategory());
    }

    @GetMapping("/category/{status}")
    public Page<TicketResponseDTO> getTicketsByStatus(
            @PathVariable Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ticketService.getTicketsByStatus(status, page, size);
    }

    @GetMapping("/my")
    public Page<TicketResponseDTO> getMyTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ticketService.getMyTickets(page, size);
    }
}