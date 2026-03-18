package com.helpdesk.model.interfaces;

import com.helpdesk.model.entities.Ticket;
import java.util.List;

public interface TicketService {
    Ticket createTicket(Ticket ticket);
    Ticket getTicketById(Long id);
    List<Ticket> getAllTickets();
    List<Ticket> getTicketsByUser(Long userId);
    Ticket updateTicket(Long id, Ticket ticket);
    Ticket assignTicket(Long ticketId, Long agentId);
    Ticket changeStatus(Long ticketId, String status);
    void deleteTicket(Long id);
}