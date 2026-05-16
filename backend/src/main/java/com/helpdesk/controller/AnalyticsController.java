package com.helpdesk.controller;

import com.helpdesk.model.dto.analytics.RecentTicketsDTO;
import com.helpdesk.model.dto.analytics.WeeklyTicketsDTO;
import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.interfaces.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/tickets/weekly")
    public List<WeeklyTicketsDTO> getWeeklyTickets(
            @RequestParam(defaultValue = "5") int weeks
    ) {
        return analyticsService.getLastTicketsWeek(weeks);
    }

    @GetMapping("/tickets/recent")
    public List<TicketResponseDTO> getRecentXTickets(
            @RequestParam Status status,
            @RequestParam(defaultValue = "5") int limit
    ) {
        return analyticsService.getLastXTicketsByStatus(limit, status);
    }

    @GetMapping("tickets/recent/grouped")
    public RecentTicketsDTO getRecentTickets(){
        return analyticsService.getRecentTicketsGroupedByStatus();
    }
}