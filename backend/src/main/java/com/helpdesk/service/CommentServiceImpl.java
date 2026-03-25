package com.helpdesk.service;

import com.helpdesk.model.entities.Comment;
import com.helpdesk.model.interfaces.CommentService;
import com.helpdesk.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    @Override
    public Comment addComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }

    @Override
    public List<Comment> getPublicCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicketIdAndIsInternal(ticketId, false);
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}