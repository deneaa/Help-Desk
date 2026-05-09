package com.helpdesk.controller;

import com.helpdesk.model.dto.auth.AuthResponseDTO;
import com.helpdesk.security.JwtUtil;
import com.helpdesk.mapper.UserMapper;
import com.helpdesk.model.dto.auth.LoginRequestDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponseDTO> signup(@RequestBody @Valid UserRequestDTO request) {

        User user = userService.register(request);

        String token = jwtUtil.generateToken(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(UserMapper.toAuthDTO(user, token));
    }
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {

        User user = userService.login(request);

        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(UserMapper.toAuthDTO(user, token));
    }


}