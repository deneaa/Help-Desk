package com.helpdesk.model.dto;

import com.helpdesk.model.enums.Category;
import com.helpdesk.model.enums.Status;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
public class TicketDTO {

    private Long id;
    private String title;
    private String description;
    private Status status;
    private Category category;

    private String createdByName;
    private String assignedToName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
