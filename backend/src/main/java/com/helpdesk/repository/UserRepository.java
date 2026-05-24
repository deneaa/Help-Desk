package com.helpdesk.repository;

import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByNameIgnoreCase(String name);
    List<User> findByRoleOrderByCreatedAtDesc(Role role);
    Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByNameIgnoreCase(String name);
    Long countByRole(Role role);
    List<User> findByRole(Role role);
    List<User> findByNameContainingIgnoreCase(String name);
}