package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.analytics.WeeklyTicketsDTO;
import java.util.List;

public interface AnalyticsService {

    List<WeeklyTicketsDTO> getLastTicketsWeek(int weeks);
}