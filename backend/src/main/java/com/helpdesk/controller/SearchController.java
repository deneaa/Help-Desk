package com.helpdesk.controller;

import com.helpdesk.model.dto.user.UserPublicDTO;
import com.helpdesk.model.dto.user.UserResponseDTO;
import com.helpdesk.model.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final UserService userService;

    @GetMapping("/users")
    public List<UserPublicDTO> searchUsers(
            @RequestParam String query) {

        if (query == null || query.isBlank()) {
            return List.of();
        }
        return userService.searchUsers(query);
    }
}