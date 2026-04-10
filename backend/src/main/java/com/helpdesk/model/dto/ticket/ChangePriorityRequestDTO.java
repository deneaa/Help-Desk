package com.helpdesk.model.dto.ticket;

import com.helpdesk.model.enums.Priority;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangePriorityRequestDTO {

    @NotNull(message = "Priority is required")
    private Priority priority;
}
