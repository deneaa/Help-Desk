package com.helpdesk.service;

import com.helpdesk.exceptions.auth.InvalidCredentialsException;
import com.helpdesk.exceptions.user.UserAlreadyExistsException;
import com.helpdesk.mapper.UserMapper;
import com.helpdesk.model.dto.auth.LoginRequestDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.dto.user.UpdateUserDTO;
import com.helpdesk.model.dto.user.UserResponseDTO;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.interfaces.UserService;
import com.helpdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO createUser( UserRequestDTO dto) {
        User user = UserMapper.toEntity(dto);

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.USER);

        User saved = userRepository.save(user);

        return UserMapper.toUserDTO(saved);

    }

    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserMapper.toUserDTO(user);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserMapper::toUserDTO)
                .toList();
    }

    private User getUserByIdEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserResponseDTO updateUser(Long id, UpdateUserDTO dto) {

        User existing = getUserByIdEntity(id);

        if (dto.getName() != null) {
            existing.setName(dto.getName());
        }

        if (dto.getEmail() != null) {
            existing.setEmail(dto.getEmail());
        }

        User saved = userRepository.save(existing);

        return UserMapper.toUserDTO(saved);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<UserResponseDTO> getUserByEmail(String email) {

        return userRepository.findByEmailIgnoreCase(email)
                .map(UserMapper::toUserDTO);
    }

    public Optional<UserResponseDTO> getUserByName(String name) {

        return userRepository.findByNameIgnoreCase(name)
                .map(UserMapper::toUserDTO);
    }

    @Override
    public UserResponseDTO setAgent(Long id) {

        User user = getUserByIdEntity(id);

        if (user.getRole() == Role.ADMIN) {
            return UserMapper.toUserDTO(user);
        }

        user.setRole(Role.AGENT);

        return UserMapper.toUserDTO(userRepository.save(user));
    }

}