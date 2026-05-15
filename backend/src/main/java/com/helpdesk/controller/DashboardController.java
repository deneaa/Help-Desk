package com.helpdesk.controller;

import com.helpdesk.model.dto.dashboard.DashboardPrivateStatsDTO;
import com.helpdesk.model.dto.dashboard.DashboardStatsDTO;
import com.helpdesk.model.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping()
    public DashboardStatsDTO getStats() {
        return dashboardService.getPublicStats();
    }

    @GetMapping("/private")
    public DashboardPrivateStatsDTO getPrivateStats(){
        return dashboardService.getPrivateStats();
    }
}