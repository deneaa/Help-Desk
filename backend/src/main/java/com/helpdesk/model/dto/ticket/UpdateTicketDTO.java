package com.helpdesk.model.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class UpdateTicketDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

}
