package com.helpdesk.controller;

import com.helpdesk.model.dto.comment.CommentResponseDTO;
import com.helpdesk.model.dto.comment.CreateCommentRequestDTO;
import com.helpdesk.model.dto.comment.EditCommentRequestDTO;
import com.helpdesk.model.interfaces.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public List<CommentResponseDTO> getAll() {
        return commentService.getAllComments();
    }

    @GetMapping("/ticket/{ticketId}")
    public List<CommentResponseDTO> getByTicket(@PathVariable Long ticketId) {
        return commentService.getCommentsByTicket(ticketId);
    }

    @GetMapping("/ticket/{ticketId}/public")
    public List<CommentResponseDTO> getPublicByTicket(@PathVariable Long ticketId) {
        return commentService.getPublicCommentsByTicket(ticketId);
    }

    @PostMapping
    public CommentResponseDTO add(
            @RequestBody CreateCommentRequestDTO dto
    ) {
        return commentService.addComment(dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commentService.deleteComment(id);
        return;
    }

    @PatchMapping("/{commentId}")
    public CommentResponseDTO update(
            @PathVariable Long commentId,
            @RequestBody @Valid EditCommentRequestDTO dto
    ) {
        return  commentService.updateComment(commentId, dto);
    }
}