package com.helpdesk.model.dto.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EditCommentRequestDTO {

    @NotBlank
    private String content;
}

