package com.helpdesk.model.dto.ticket;

import com.helpdesk.model.enums.Category;
import com.helpdesk.model.enums.Status;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class TicketDTO {

    private Long id;

    private String title;
    private String description;

    private Status status;
    private Category category;

    private Long createdById;
    private String createdByName;

    private Long assignedToId;
    private String assignedToName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}