package com.helpdesk.model.dto.comment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class CommentResponseDTO {

    private Long id;

    private String content;

    private boolean internal;

    private LocalDateTime createdAt;

    private Long authorId;
    private String authorName;

    private Long ticketId;
}