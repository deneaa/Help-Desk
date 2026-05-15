package com.helpdesk.model.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long total;
    private long open;
    private long inProgress;
    private long closed;
    private long reopened;
}