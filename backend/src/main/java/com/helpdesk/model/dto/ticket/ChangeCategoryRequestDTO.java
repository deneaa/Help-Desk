package com.helpdesk.model.dto.ticket;

import com.helpdesk.model.enums.Category;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChangeCategoryRequestDTO {

    @NotNull(message = "Category is required")
    private Category category;
}
