package com.helpdesk.model.dto.analytics;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class WeeklyTicketsDTO {
    private String week;
    private Long tickets;
}
