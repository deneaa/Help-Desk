package com.helpdesk.controller;

import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import com.helpdesk.model.dto.user.*;
import com.helpdesk.model.interfaces.TicketService;
import com.helpdesk.model.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final TicketService ticketService;

    @PostMapping
    public UserResponseDTO create(@RequestBody @Valid UserRequestDTO dto) {
        return userService.createUser(dto);
    }

    @GetMapping
    public List<UserPublicDTO> getAllUsers() {
        return userService.getAllPublicUsers();
    }

    @GetMapping("/{id}")
    public UserProfileResponse getUser(@PathVariable Long id) {
        return userService.getProfileView(id);
    }

    @GetMapping("/{id}/tickets")
    public List<TicketResponseDTO> getTicketsByUser(@PathVariable Long id) {
        return ticketService.getTicketsByUser(id);
    }

    @PatchMapping("/{id}")
    public UserResponseDTO updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserDTO dto) {
        return userService.updateUser(id, dto);
    }

    @PatchMapping("/{id}/role/promote")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponseDTO promote(@PathVariable Long id) {
        return userService.setAgent(id);
    }

    @PatchMapping("/{id}/role/demote")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponseDTO demote(@PathVariable Long id) {
        return userService.removeAgent(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}