package com.helpdesk.service;

import com.helpdesk.exceptions.auth.InvalidCredentialsException;
import com.helpdesk.exceptions.user.UserAlreadyExistsException;
import com.helpdesk.mapper.UserMapper;
import com.helpdesk.model.dto.auth.AuthResponseDTO;
import com.helpdesk.model.dto.auth.LoginRequestDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.interfaces.AuthService;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponseDTO register(UserRequestDTO dto) {

        if (userRepository.findByEmailIgnoreCase(dto.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("email", dto.getEmail());
        }

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.USER)
                .build();

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved);

        return UserMapper.toAuthDTO(saved, token);
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByEmailIgnoreCase(dto.getEmail())
                .orElseThrow(() -> InvalidCredentialsException.emailNotFound(dto.getEmail()));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw InvalidCredentialsException.wrongPassword();
        }

        String token = jwtUtil.generateToken(user);

        return UserMapper.toAuthDTO(user, token);
    }
}
