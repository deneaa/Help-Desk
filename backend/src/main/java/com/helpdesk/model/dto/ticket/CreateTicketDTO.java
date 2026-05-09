package com.helpdesk.model.dto.ticket;

import com.helpdesk.model.enums.Category;
import com.helpdesk.model.enums.Priority;
import com.helpdesk.model.enums.TicketType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketDTO {

    @NotBlank(message = "Title cannot be empty")
    private String title;

    @NotBlank(message = "Description cannot be empty")
    private String description;

    @NotNull(message = "Ticket Type is required")
    private TicketType ticketType;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Priority is required")
    private Priority priority;
}
