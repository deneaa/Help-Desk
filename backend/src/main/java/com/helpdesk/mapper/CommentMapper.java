package com.helpdesk.mapper;

import com.helpdesk.model.dto.comment.CommentResponseDTO;
import com.helpdesk.model.dto.comment.CreateCommentRequestDTO;
import com.helpdesk.model.entities.Comment;

public class CommentMapper {

    public static CommentResponseDTO toDTO(Comment comment){
        if (comment == null) return null;

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .internal(comment.isInternal())
                .createdAt(comment.getCreatedAt())

                .authorId(comment.getAuthor() != null ? comment.getAuthor().getId() : null)
                .authorName(comment.getAuthor() != null ? comment.getAuthor().getName() : null)

                .ticketId(comment.getTicket() != null ? comment.getTicket().getId() : null)
                .build();
    }

    public static Comment toEntity(CreateCommentRequestDTO dto) {
        if (dto == null) return null;

        Comment comment = new Comment();

        comment.setContent(dto.getContent());
        comment.setInternal(dto.isInternal());
        return comment;
    }
}