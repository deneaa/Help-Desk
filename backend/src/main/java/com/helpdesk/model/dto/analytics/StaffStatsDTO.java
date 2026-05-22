package com.helpdesk.model.dto.analytics;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StaffStatsDTO {

    private Long userId;
    private String name;

    private Long weekTickets;
    private Long monthTickets;
    private Long allTimeTickets;
}
