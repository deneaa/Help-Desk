package com.helpdesk.repository;

import com.helpdesk.model.dto.notification.NotificationResponseDTO;
import com.helpdesk.model.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient_IdOrderByCreatedAtDesc(Long recipientId);

    List<Notification> findByIssuedBy_IdOrderByCreatedAtDesc(Long userId);

    Long countByRecipient_IdAndIsReadFalse(Long recipientId);
}