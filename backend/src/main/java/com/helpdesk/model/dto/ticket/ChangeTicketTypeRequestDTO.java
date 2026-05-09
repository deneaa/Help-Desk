package com.helpdesk.model.dto.ticket;

import com.helpdesk.model.enums.TicketType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeTicketTypeRequestDTO {
    @NotNull(message = "Ticket Type is required")
    private TicketType type;
}