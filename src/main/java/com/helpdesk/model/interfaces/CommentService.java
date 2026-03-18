package com.helpdesk.model.interfaces;

import com.helpdesk.model.entities.Comment;
import java.util.List;

public interface CommentService {
    Comment addComment(Comment comment);
    List<Comment> getCommentsByTicket(Long ticketId);
    List<Comment> getPublicCommentsByTicket(Long ticketId);
    void deleteComment(Long id);
}