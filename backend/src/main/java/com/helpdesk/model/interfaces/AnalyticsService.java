package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.analytics.RecentTicketsDTO;
import com.helpdesk.model.dto.analytics.WeeklyTicketsDTO;
import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import com.helpdesk.model.enums.Status;

import java.util.List;

public interface AnalyticsService {

    List<WeeklyTicketsDTO> getLastTicketsWeek(int weeks);

    List<TicketResponseDTO> getLastXTicketsByStatus(int limit, Status status);

    RecentTicketsDTO getRecentTicketsGroupedByStatus();

}