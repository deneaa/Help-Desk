package com.helpdesk.model.entities;

import com.helpdesk.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    // daca nu folosim Enumerated, in baza de date se va salva numarul enum-ului, (0 -> admin, 1 -> user)
    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime createdAt;
}