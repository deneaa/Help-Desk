package com.helpdesk.model.dto.notification;

import com.helpdesk.model.enums.NotificationReferenceType;
import com.helpdesk.model.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CreateNotificationDTO {

    @NotBlank
    private String message;

    @NotNull
    private NotificationType type;

    private Long recipientId;

    private NotificationReferenceType referenceType;

    private Long referenceId;

    private String redirectUrl;
}