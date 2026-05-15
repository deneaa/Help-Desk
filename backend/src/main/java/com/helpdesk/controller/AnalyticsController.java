package com.helpdesk.controller;

import com.helpdesk.model.dto.analytics.WeeklyTicketsDTO;
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
}