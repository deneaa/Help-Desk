package com.helpdesk.controller;

import com.helpdesk.model.dto.ticket.TicketDTO;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.interfaces.TicketService;
import com.helpdesk.model.interfaces.UserService;
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
    public User create(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("{userId}/tickets")
    public List<TicketDTO> getTicketsByUser(@PathVariable Long userId){
        return ticketService.getTicketsByUser(userId);
    }
 }