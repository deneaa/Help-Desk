package com.helpdesk.controller;

import com.helpdesk.config.JwtUtil;
import com.helpdesk.mapper.UserMapper;
import com.helpdesk.model.dto.LoginRequestDTO;
import com.helpdesk.model.dto.UserRequestDTO;
import com.helpdesk.model.dto.UserResponseDTO;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
import com.helpdesk.service.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
@Builder
public class AuthController {

    private final UserServiceImpl userService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public UserResponseDTO signup(@RequestBody @Valid UserRequestDTO request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.USER)
                .build();

        user = userService.createUser(user);
        String token = jwtUtil.generateToken(user);

        return UserMapper.toDTO(user, token);
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody @Valid LoginRequestDTO request){
        User user = userService.getUserByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user);

        return UserMapper.toDTO(user, token);
    }

}
