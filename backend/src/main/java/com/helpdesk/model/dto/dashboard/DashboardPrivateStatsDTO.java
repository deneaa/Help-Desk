package com.helpdesk.model.dto.dashboard;

import com.helpdesk.model.dto.analytics.WeeklyTicketsDTO;
import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class DashboardPrivateStatsDTO {
    private long totalTickets;
    private long openTickets;
    private long inProgressTickets;
    private long closedTickets;
    private long reopenedTickets;

    List<WeeklyTicketsDTO> weeklyTickets;

    private long users;
    private long agents;
    private long admins;

    List<AuditLogResponseDTO> auditLogs;
}