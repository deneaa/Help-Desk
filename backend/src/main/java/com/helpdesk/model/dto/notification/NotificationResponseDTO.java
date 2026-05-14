package com.helpdesk.model.dto.notification;

import com.helpdesk.model.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Builder
@Data
public class NotificationResponseDTO {

    private Long id;

    private String message;

    private NotificationType type;

    private boolean read;

    private String redirectUrl;

    private String issuedBy;

    private LocalDateTime createdAt;

}
