package com.helpdesk.model.dto.ticket;

import com.helpdesk.model.enums.Status;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeStatusRequestDTO {

    @NotNull(message = "Status is required")
    private Status status;
}