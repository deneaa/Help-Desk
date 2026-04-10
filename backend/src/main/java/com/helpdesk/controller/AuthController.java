package com.helpdesk.controller;

import com.helpdesk.security.JwtUtil;
import com.helpdesk.exceptions.auth.InvalidCredentialsException;
import com.helpdesk.exceptions.user.UserAlreadyExistsException;
import com.helpdesk.mapper.UserMapper;
import com.helpdesk.model.dto.auth.LoginRequestDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.dto.auth.UserResponseDTO;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
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
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDTO> signup(@RequestBody @Valid UserRequestDTO request) {
        if (userService.getUserByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("email", request.getEmail());
        }
        if (userService.getUserByName(request.getName()).isPresent()){
            throw new UserAlreadyExistsException("name", request.getName());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.USER)
                .build();

        user = userService.createUser(user);
        String token = jwtUtil.generateToken(user);

        UserResponseDTO response = UserMapper.toDTO(user, token);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody @Valid LoginRequestDTO request){
        User user = userService.getUserByEmail(request.getEmail())
                .orElseThrow(() -> InvalidCredentialsException.emailNotFound(request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw InvalidCredentialsException.wrongPassword();
        }

        String token = jwtUtil.generateToken(user);
        UserResponseDTO response = UserMapper.toDTO(user, token);
        return ResponseEntity.ok(response);
    }
}