package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.auth.LoginRequestDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.dto.user.UpdateUserDTO;
import com.helpdesk.model.dto.user.UserResponseDTO;
import com.helpdesk.model.entities.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    UserResponseDTO createUser(UserRequestDTO user);
    UserResponseDTO getUserById(Long id);
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO updateUser(Long id, UpdateUserDTO dto);
    void deleteUser(Long id);
    Optional<UserResponseDTO> getUserByEmail(String email);
    Optional<UserResponseDTO> getUserByName(String name);
    UserResponseDTO setAgent(Long id);
    User register(UserRequestDTO dto);
    User login(LoginRequestDTO dto);
}