package com.helpdesk.service;

import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.mapper.TicketMapper;
import com.helpdesk.model.dto.analytics.RecentTicketsDTO;
import com.helpdesk.model.dto.analytics.StaffStatsDTO;
import com.helpdesk.model.dto.analytics.WeeklyTicketsDTO;
import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.interfaces.AnalyticsService;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof UserPrincipal userPrincipal)) {
            throw new UnauthorizedActionException("Unauthorized");
        }

        return userPrincipal.getUser();
    }

    @Override
    public List<WeeklyTicketsDTO> getLastTicketsWeek(int weeks) {

        List<WeeklyTicketsDTO> result = new ArrayList<>();

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM");

        for (int i = weeks - 1; i >= 0; i--) {

            LocalDate startOfWeek = today.minusWeeks(i)
                    .with(DayOfWeek.MONDAY);

            LocalDate endOfWeek = startOfWeek.plusDays(6);

            long tickets = ticketRepository.countByCreatedAtBetween(
                    startOfWeek.atStartOfDay(),
                    endOfWeek.atTime(23, 59, 59)
            );

            String label = startOfWeek.format(formatter)
                    + " - " +
                    endOfWeek.format(formatter);

            result.add(new WeeklyTicketsDTO(
                    label,
                    tickets
            ));
        }

        return result;
    }

    @Override
    public List<TicketResponseDTO> getLastXTicketsByStatus(int limit, Status status){
        return ticketRepository
                .findByStatusOrderByCreatedAtDesc(status, PageRequest.of(0, limit))
                .stream()
                .map(TicketMapper::toDTO)
                .toList();
    }

    @Override
    public RecentTicketsDTO getRecentTicketsGroupedByStatus(){
        Pageable pageable = PageRequest.of(0, 5);

        return RecentTicketsDTO.builder()
                .openTickets(
                        ticketRepository
                                .findByStatusOrderByCreatedAtDesc(Status.OPEN, pageable)
                                .stream()
                                .map(TicketMapper::toDTO)
                                .toList()
                )
                .inProgressTickets(
                        ticketRepository
                                .findByStatusOrderByCreatedAtDesc(Status.IN_PROGRESS, pageable)
                                .stream()
                                .map(TicketMapper::toDTO)
                                .toList()
                )
                .closedTickets(
                        ticketRepository
                                .findByStatusOrderByCreatedAtDesc(Status.CLOSED, pageable)
                                .stream()
                                .map(TicketMapper::toDTO)
                                .toList()
                )
                .reopenedTickets(
                        ticketRepository
                                .findByStatusOrderByCreatedAtDesc(Status.REOPENED, pageable)
                                .stream()
                                .map(TicketMapper::toDTO)
                                .toList()
                )
                .build();
    }

    @Override
    public List<StaffStatsDTO> getStaffStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekAgo = now.minusWeeks(1);
        LocalDateTime monthAgo = now.minusMonths(1);

        List<User> staff = userRepository.findByRole(Role.AGENT);

        return staff.stream().map(user -> {
            long week = ticketRepository.countByAssignedToIdAndStatusAndUpdatedAtAfter(user.getId(), Status.CLOSED, weekAgo);
            long month = ticketRepository.countByAssignedToIdAndStatusAndUpdatedAtAfter(user.getId(), Status.CLOSED, monthAgo);
            long all = ticketRepository.countByAssignedToIdAndStatus(user.getId(), Status.CLOSED);

            return StaffStatsDTO.builder()
                    .userId(user.getId())
                    .name(user.getName())
                    .weekTickets(week)
                    .monthTickets(month)
                    .allTimeTickets(all)
                    .build();
        }).toList();
    }

    @Override
    public StaffStatsDTO getMyStaffStats(){
        User user = getAuthenticatedUser();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekAgo = now.minusWeeks(1);
        LocalDateTime monthAgo = now.minusMonths(1);

        return StaffStatsDTO.builder()
                .userId(user.getId())
                .name(user.getName())
                .weekTickets(ticketRepository.countByAssignedToIdAndStatusAndUpdatedAtAfter(user.getId(), Status.CLOSED, weekAgo))
                .monthTickets(ticketRepository.countByAssignedToIdAndStatusAndUpdatedAtAfter(user.getId(), Status.CLOSED, monthAgo))
                .allTimeTickets(ticketRepository.countByAssignedToIdAndStatus(user.getId(), Status.CLOSED))
                .build();
    }
}