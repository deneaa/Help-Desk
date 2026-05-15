package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.dashboard.DashboardPrivateStatsDTO;
import com.helpdesk.model.dto.dashboard.DashboardStatsDTO;

public interface DashboardService {
    DashboardStatsDTO getPublicStats();
    DashboardPrivateStatsDTO getPrivateStats();
}