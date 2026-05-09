package com.helpdesk.model.dto.comment;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreateCommentRequestDTO {

    @NotNull
    private Long ticketId;

    @NotBlank
    private String content;

    private boolean internal;
}
