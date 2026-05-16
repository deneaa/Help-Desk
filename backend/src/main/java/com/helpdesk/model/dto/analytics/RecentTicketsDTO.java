package com.helpdesk.model.dto.analytics;

import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecentTicketsDTO {
    private List<TicketResponseDTO> openTickets;
    private List<TicketResponseDTO> inProgressTickets;
    private List<TicketResponseDTO> closedTickets;
    private List<TicketResponseDTO> reopenedTickets;
}
