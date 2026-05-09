package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.ticket.CreateTicketDTO;
import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import com.helpdesk.model.dto.ticket.UpdateTicketDTO;
import com.helpdesk.model.enums.Priority;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.enums.TicketType;

import java.util.List;

public interface TicketService {

    TicketResponseDTO createTicket(CreateTicketDTO dto);

    TicketResponseDTO getTicketById(Long id);

    List<TicketResponseDTO> getAllTickets(int limit);

    List<TicketResponseDTO> getTicketsByUser(Long userId);

    TicketResponseDTO updateTicket(Long id, UpdateTicketDTO dto);

    TicketResponseDTO assignTicket(Long ticketId, Long agentId);

    TicketResponseDTO unassignTicket (Long ticketId);

    TicketResponseDTO changeStatus(Long ticketId, Status status);

    TicketResponseDTO changePriority(Long ticketId, Priority priority);

    TicketResponseDTO changeTicketType(Long ticketId, TicketType type);

    void deleteTicket(Long id);

    List<TicketResponseDTO> getLastTickets(int limit);
}