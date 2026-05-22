package com.helpdesk.model.dto.notification;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateBroadcastNotificationDTO {
    private String message;
}
