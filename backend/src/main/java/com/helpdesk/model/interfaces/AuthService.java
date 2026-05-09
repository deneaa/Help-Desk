package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.auth.AuthResponseDTO;
import com.helpdesk.model.dto.auth.LoginRequestDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;

public interface AuthService {
    AuthResponseDTO register(UserRequestDTO dto);
    AuthResponseDTO login(LoginRequestDTO dto);
}