package com.helpdesk.model.dto.ticket;

import com.helpdesk.model.enums.Category;
import com.helpdesk.model.enums.Priority;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.enums.TicketType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class TicketResponseDTO {

    private Long id;

    private String title;
    private String description;

    private Status status;
    private Category category;
    private Priority priority;
    private TicketType ticketType;

    private Long createdById;
    private String createdByName;

    private Long assignedToId;
    private String assignedToName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}