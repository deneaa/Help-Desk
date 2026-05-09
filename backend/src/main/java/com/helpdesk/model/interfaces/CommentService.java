package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.comment.CommentResponseDTO;
import com.helpdesk.model.dto.comment.CreateCommentRequestDTO;
import com.helpdesk.model.dto.comment.EditCommentRequestDTO;

import java.util.List;

public interface CommentService {
    CommentResponseDTO addComment(CreateCommentRequestDTO dto);
    List<CommentResponseDTO> getCommentsByTicket(Long ticketId);
    List<CommentResponseDTO> getPublicCommentsByTicket(Long ticketId);
    void deleteComment(Long id);
    List<CommentResponseDTO> getAllComments();
    CommentResponseDTO updateComment(Long commentId, EditCommentRequestDTO dto);
}