package com.helpdesk.model.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserDTO {
    @Size(max = 100)
    private String name;

    @Email
    private String email;
}
