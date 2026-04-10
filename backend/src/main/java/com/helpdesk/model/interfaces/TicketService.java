package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.ticket.CreateTicketDTO;
import com.helpdesk.model.dto.ticket.TicketDTO;
import com.helpdesk.model.enums.Priority;
import com.helpdesk.model.enums.Status;

import java.util.List;

public interface TicketService {

    TicketDTO createTicket(CreateTicketDTO createTicketDTO);

    TicketDTO getTicketById(Long id);

    List<TicketDTO> getAllTickets(int limit);

    List<TicketDTO> getTicketsByUser(Long userId);

    TicketDTO updateTicket(Long id, TicketDTO ticketDTO);

    TicketDTO assignTicket(Long ticketId, Long agentId);

    TicketDTO changeStatus(Long ticketId, Status status);

    TicketDTO changePriority(Long ticketId, Priority priority);

    void deleteTicket(Long id);

    List<TicketDTO> getLastTickets(int limit);
}