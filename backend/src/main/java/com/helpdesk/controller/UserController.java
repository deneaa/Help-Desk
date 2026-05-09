package com.helpdesk.controller;

import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.dto.ticket.TicketResponseDTO;
import com.helpdesk.model.dto.user.UserResponseDTO;
import com.helpdesk.model.interfaces.TicketService;
import com.helpdesk.model.interfaces.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    public List<UserResponseDTO> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("{userId}/tickets")
    public List<TicketResponseDTO> getTicketsByUser(@PathVariable Long userId){
        return ticketService.getTicketsByUser(userId);
    }
 }