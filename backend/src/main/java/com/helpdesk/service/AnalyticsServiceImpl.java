package com.helpdesk.service;

import com.helpdesk.model.dto.analytics.WeeklyTicketsDTO;
import com.helpdesk.model.interfaces.AnalyticsService;
import com.helpdesk.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TicketRepository ticketRepository;

    @Override
    public List<WeeklyTicketsDTO> getLastTicketsWeek(int weeks) {

        List<WeeklyTicketsDTO> result = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (int i = weeks - 1; i >= 0; i--) {

            LocalDate startOfWeek = today.minusWeeks(i)
                    .with(DayOfWeek.MONDAY);

            LocalDate endOfWeek = startOfWeek.plusDays(6);

            long tickets = ticketRepository.countByCreatedAtBetween(
                    startOfWeek.atStartOfDay(),
                    endOfWeek.atTime(23, 59, 59)
            );

            result.add(new WeeklyTicketsDTO(
                    startOfWeek + " - " + endOfWeek,
                    tickets
            ));
        }

        return result;
    }
}