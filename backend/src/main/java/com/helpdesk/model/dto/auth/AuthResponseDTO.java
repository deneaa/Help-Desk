package com.helpdesk.model.dto.auth;

import com.helpdesk.model.enums.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthResponseDTO {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String token;
}
