package com.helpdesk.controller;

import com.helpdesk.model.dto.comment.CommentResponseDTO;
import com.helpdesk.model.dto.comment.CreateCommentRequestDTO;
import com.helpdesk.model.entities.Comment;
import com.helpdesk.model.interfaces.CommentService;
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
    public ResponseEntity<List<CommentResponseDTO>> getAll() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<CommentResponseDTO>> getByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @GetMapping("/ticket/{ticketId}/public")
    public ResponseEntity<List<CommentResponseDTO>> getPublicByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getPublicCommentsByTicket(ticketId));
    }

    @PostMapping
    public ResponseEntity<CommentResponseDTO> add(
            @RequestBody CreateCommentRequestDTO dto
    ) {
        return ResponseEntity.ok(commentService.addComment(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}