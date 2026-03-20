package com.helpdesk.controller;

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
    public Object stats() {
        return new Object() {
            public long open = ticketRepository.findAll().stream()
                    .filter(t -> t.getStatus() == Status.OPEN).count();

            public long inProgress = ticketRepository.findAll().stream()
                    .filter(t -> t.getStatus() == Status.IN_PROGRESS).count();

            public long closed = ticketRepository.findAll().stream()
                    .filter(t -> t.getStatus() == Status.CLOSED).count();
        };
    }
}