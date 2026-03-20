package com.helpdesk.controller;

import com.helpdesk.model.entities.Comment;
import com.helpdesk.service.CommentServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentServiceImpl commentService;

    @PostMapping
    public Comment add(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }

    // AGENT vede toate
    @GetMapping("/ticket/{ticketId}")
    public List<Comment> getAll(@PathVariable Long ticketId) {
        return commentService.getCommentsByTicket(ticketId);
    }

    // USER vede doar publice
    @GetMapping("/ticket/{ticketId}/public")
    public List<Comment> getPublic(@PathVariable Long ticketId) {
        return commentService.getPublicCommentsByTicket(ticketId);
    }
}