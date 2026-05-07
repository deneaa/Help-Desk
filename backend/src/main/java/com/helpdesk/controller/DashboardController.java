package com.helpdesk.controller;

import com.helpdesk.model.dto.dashboard.DashboardStatsDTO;
import com.helpdesk.model.enums.Status;
import com.helpdesk.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TicketRepository ticketRepository;

    @GetMapping
    public DashboardStatsDTO stats() {

        long total = ticketRepository.count();

        long open = ticketRepository.findAll().stream()
                .filter(t -> t.getStatus() == Status.OPEN)
                .count();

        long inProgress = ticketRepository.findAll().stream()
                .filter(t -> t.getStatus() == Status.IN_PROGRESS)
                .count();

        long closed = ticketRepository.findAll().stream()
                .filter(t -> t.getStatus() == Status.CLOSED)
                .count();

        return new DashboardStatsDTO(
                total,
                open,
                inProgress,
                closed
        );
    }
}