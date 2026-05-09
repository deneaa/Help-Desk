package com.helpdesk.controller;

import com.helpdesk.model.dto.auth.AuthResponseDTO;
import com.helpdesk.model.interfaces.AuthService;
import com.helpdesk.model.dto.auth.LoginRequestDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDTO> signup(@RequestBody @Valid UserRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }
}