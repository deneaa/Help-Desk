package com.helpdesk.service;

import com.helpdesk.model.dto.dashboard.DashboardStatsDTO;
import com.helpdesk.model.dto.dashboard.DashboardPrivateStatsDTO;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.interfaces.AnalyticsService;
import com.helpdesk.model.interfaces.AuditLogService;
import com.helpdesk.model.interfaces.DashboardService;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;
    private final AuditLogService auditLogService;

    @Override
    public DashboardStatsDTO getPublicStats() {

        return DashboardStatsDTO.builder()
                .totalTickets(ticketRepository.count())
                .openTickets(ticketRepository.countByStatus(Status.OPEN))
                .inProgressTickets(ticketRepository.countByStatus(Status.IN_PROGRESS))
                .closedTickets(ticketRepository.countByStatus(Status.CLOSED))
                .reopenedTickets(ticketRepository.countByStatus(Status.REOPENED))

                .users(userRepository.countByRole(Role.USER))
                .agents(userRepository.countByRole(Role.AGENT))
                .admins(userRepository.countByRole(Role.ADMIN))

                .weeklyTickets(analyticsService.getLastTicketsWeek(5))
                .build();
    }

    public DashboardPrivateStatsDTO getPrivateStats(){
        return DashboardPrivateStatsDTO.builder()
                .totalTickets(ticketRepository.count())
                .openTickets(ticketRepository.countByStatus(Status.OPEN))
                .inProgressTickets(ticketRepository.countByStatus(Status.IN_PROGRESS))
                .closedTickets(ticketRepository.countByStatus(Status.CLOSED))
                .reopenedTickets(ticketRepository.countByStatus(Status.REOPENED))

                .users(userRepository.countByRole(Role.USER))
                .agents(userRepository.countByRole(Role.AGENT))
                .admins(userRepository.countByRole(Role.ADMIN))

                .weeklyTickets(analyticsService.getLastTicketsWeek(5))
                .auditLogs(auditLogService.getLastLogs(5))
                .build();
    }
}