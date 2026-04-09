package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.TicketDTO;
import java.util.List;

public interface TicketService {

    TicketDTO createTicket(TicketDTO ticketDTO);

    TicketDTO getTicketById(Long id);

    List<TicketDTO> getAllTickets();

    List<TicketDTO> getTicketsByUser(Long userId);

    TicketDTO updateTicket(Long id, TicketDTO ticketDTO);

    TicketDTO assignTicket(Long ticketId, Long agentId);

    TicketDTO changeStatus(Long ticketId, String status);

    void deleteTicket(Long id);

    List<TicketDTO> getLastTickets(int limit);
}