package com.helpdesk.service;

import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.exceptions.notification.NotificationNotFoundException;
import com.helpdesk.exceptions.user.UserNotFoundException;
import com.helpdesk.mapper.NotificationMapper;
import com.helpdesk.model.dto.notification.CreateBroadcastNotificationDTO;
import com.helpdesk.model.dto.notification.CreateNotificationDTO;
import com.helpdesk.model.dto.notification.NotificationResponseDTO;
import com.helpdesk.model.entities.Notification;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.NotificationType;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.interfaces.NotificationService;
import com.helpdesk.repository.NotificationRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private User getUserByIdEntity(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("userId", id.toString()));
    }

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof UserPrincipal userPrincipal)) {
            throw new UnauthorizedActionException("Unauthorized");
        }

        return userPrincipal.getUser();
    }

    private Notification getNotification(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));
    }

    @Override
    public NotificationResponseDTO createNotification(CreateNotificationDTO dto) {
        User recipient = getUserByIdEntity(dto.getRecipientId());
        User issuer = getAuthenticatedUser();


        Notification notification = Notification.builder()
                .message(dto.getMessage())
                .type(dto.getType())
                .referenceType(dto.getReferenceType())
                .referenceId(dto.getReferenceId())
                .redirectUrl(dto.getRedirectUrl())
                .recipient(recipient)
                .issuedBy(issuer)
                .build();

        return NotificationMapper.toDTO(notificationRepository.save(notification));
    }

    @Override
    public List<NotificationResponseDTO> getMyNotifications() {
        User authenticatedUser = getAuthenticatedUser();
        return notificationRepository
                .findByRecipient_IdOrderByCreatedAtDesc(authenticatedUser.getId())
                .stream()
                .map(NotificationMapper::toDTO)
                .toList();
    }

    @Override
    public List<NotificationResponseDTO> getAllNotifications() {
        User user = getAuthenticatedUser();

        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("Only admins can view all notifications");
        }
        return notificationRepository.findAll()
                .stream()
                .map(NotificationMapper::toDTO)
                .toList();
    }

    @Override
    public List<NotificationResponseDTO> getNotificationsByUser(Long userId) {
        User auth = getAuthenticatedUser();

        if (!auth.getId().equals(userId) && auth.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("You cannot view these notifications");
        }
        return notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationMapper::toDTO)
                .toList();
    }

    @Override
    public NotificationResponseDTO markAsRead(Long notificationId) {
        User auth = getAuthenticatedUser();
        Notification notification = getNotification(notificationId);

        if (!notification.getRecipient().getId().equals(auth.getId())
                && auth.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("Not your notification");
        }
        notification.setRead(true);
        return NotificationMapper.toDTO(notificationRepository.save(notification));
    }

    @Override
    public void deleteNotification(Long id) {
        User user = getAuthenticatedUser();
        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("Only admins can delete notifications");
        }
        notificationRepository.deleteById(id);
    }

    @Override
    public void markAllAsRead() {
        User authenticatedUser = getAuthenticatedUser();

        List<Notification> notifications =
                notificationRepository.findByRecipient_IdOrderByCreatedAtDesc(authenticatedUser.getId())
                        .stream()
                        .peek(n -> n.setRead(true))
                        .toList();
        notificationRepository.saveAll(notifications);
    }

    @Override
    public void broadcastToAllUsers(CreateBroadcastNotificationDTO dto) {
        User issuer = getAuthenticatedUser();

        if (issuer.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("Only admins can send global announcements");
        }

        List<User> allUsers = userRepository.findAll();

        List<Notification> notifications = allUsers.stream()
                .filter(user -> !user.getId().equals(issuer.getId()))
                .map(recipient -> Notification.builder()
                        .message(dto.getMessage())
                        .type(NotificationType.GLOBAL_ANNOUNCEMENT)
                        .recipient(recipient)
                        .issuedBy(issuer)
                        .isRead(false)
                        .build())
                .toList();

        notificationRepository.saveAll(notifications);
    }

}