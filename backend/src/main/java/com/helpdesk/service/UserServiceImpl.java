package com.helpdesk.service;

import com.helpdesk.exceptions.auth.InvalidCredentialsException;
import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.exceptions.user.NotAnAgentException;
import com.helpdesk.exceptions.user.UserAlreadyAgentException;
import com.helpdesk.exceptions.user.UserAlreadyExistsException;
import com.helpdesk.mapper.UserMapper;
import com.helpdesk.model.dto.analytics.StaffDTO;
import com.helpdesk.model.dto.auth.LoginRequestDTO;
import com.helpdesk.model.dto.auth.UserRequestDTO;
import com.helpdesk.model.dto.user.UpdateUserDTO;
import com.helpdesk.model.dto.user.UserProfileResponse;
import com.helpdesk.model.dto.user.UserPublicDTO;
import com.helpdesk.model.dto.user.UserResponseDTO;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.interfaces.UserService;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.ErrorResponseException;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TicketRepository ticketRepository;

    private User getUserByIdEntity(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private User getAuthenticatedUser() {

        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof UserPrincipal userPrincipal)) {
            throw new UnauthorizedActionException("Unauthorized");
        }

        return userPrincipal.getUser();
    }

    @Override
    public UserResponseDTO createUser(UserRequestDTO dto) {
        User user = UserMapper.toEntity(dto);

        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.USER);

        User saved = userRepository.save(user);

        return UserMapper.toUserDTO(saved);

    }

    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = getUserByIdEntity(id);

        return UserMapper.toUserDTO(user);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserMapper::toUserDTO)
                .toList();
    }

    @Override
    public List<UserPublicDTO> getAllPublicUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toPublicDTO)
                .toList();
    }

    @Override
    public UserResponseDTO updateUser(Long id, UpdateUserDTO dto) {

        User authenticatedUser = getAuthenticatedUser();
        User existing = getUserByIdEntity(id);

        if (!authenticatedUser.getId().equals(id) &&
            authenticatedUser.getRole() != Role.ADMIN){
            throw new UnauthorizedActionException("You cannot update this user!");
        }

        if (dto.getName() != null && !dto.getName().isBlank()){
            boolean nameExists = userRepository.existsByNameIgnoreCase(dto.getName());

            if (nameExists && !existing.getName().equalsIgnoreCase(dto.getName())) {
                throw new UserAlreadyExistsException("username", dto.getName());
            }
            existing.setName(dto.getName().trim());
        }

        if (dto.getEmail() != null && !dto.getEmail().isBlank()){
            boolean emailExists = userRepository.existsByEmailIgnoreCase(dto.getEmail());

            if (emailExists && !existing.getEmail().equalsIgnoreCase(dto.getEmail())){
                throw new UserAlreadyExistsException("email", dto.getEmail());
            }
            existing.setEmail(dto.getEmail());
        }

        User saved = userRepository.save(existing);

        return UserMapper.toUserDTO(saved);
    }

    @Override
    public void deleteUser(Long id) {
        User authenticatedUser = getAuthenticatedUser();

        if (authenticatedUser.getRole() != Role.ADMIN){
            throw new UnauthorizedActionException("Only admins can delete users");
        }

        User userToDelete = getUserByIdEntity(id);

        if (authenticatedUser.getId().equals(userToDelete.getId())){
            throw new UnauthorizedActionException("Admins cannot delete themselves");
        }
        userRepository.deleteById(id);
    }

    public Optional<UserResponseDTO> getUserByEmail(String email) {

        return userRepository.findByEmailIgnoreCase(email)
                .map(UserMapper::toUserDTO);
    }

    public Optional<UserResponseDTO> getUserByName(String name) {

        return userRepository.findByNameIgnoreCase(name)
                .map(UserMapper::toUserDTO);
    }

    @Override
    public UserResponseDTO setAgent(Long id) {

        User authenticatedUser = getAuthenticatedUser();
        if (authenticatedUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("Only admins can change roles");
        }

        User user = getUserByIdEntity(id);

        if (user.getRole() == Role.ADMIN) {
            throw new UnauthorizedActionException("Admin role cannot be modified");
        }

        if (user.getRole() == Role.AGENT) {
            throw new UserAlreadyAgentException("User is already an agent");
        }

        user.setRole(Role.AGENT);

        User saved = userRepository.save(user);

        return UserMapper.toUserDTO(userRepository.save(user));
    }

    @Override
    public UserResponseDTO removeAgent(Long id){
        User authenticatedUser = getAuthenticatedUser();

        if (authenticatedUser.getRole() != Role.ADMIN){
            throw new UnauthorizedActionException("Only admins can remove agents");
        }

        User user = getUserByIdEntity(id);
        if (user.getRole() == Role.ADMIN){
            throw new UnauthorizedActionException("User is already an Admin");
        }

        if (user.getRole() != Role.AGENT){
            throw new NotAnAgentException(id);
        }

        user.setRole(Role.USER);
        User saved = userRepository.save(user);

        return UserMapper.toUserDTO(saved);
    }


    @Override
    public UserProfileResponse getProfileView(Long targetId) {
        User caller = getAuthenticatedUser();
        User target = getUserByIdEntity(targetId);

        boolean isAdmin  = caller.getRole() == Role.ADMIN;
        boolean isAgent  = caller.getRole() == Role.AGENT;
        boolean isOwn    = caller.getId().equals(targetId);
        boolean targetIsAdmin = target.getRole() == Role.ADMIN;

        int created  = (int) ticketRepository.countByCreatedById(targetId);
        int resolved = (int) ticketRepository.countByAssignedToIdAndStatus(targetId, Status.CLOSED);

        // ADMIN → vede tot despre oricine
        if (isAdmin) {
            boolean canEdit = true; // adminul poate edita oricine
            return UserProfileResponse.builder()
                    .accessLevel("FULL")
                    .data(UserMapper.toFullDTO(target, created, resolved, canEdit))
                    .build();
        }

        // AGENT → vede tot despre user/agent, simplu despre admin
        if (isAgent) {
            if (targetIsAdmin) {
                return UserProfileResponse.builder()
                        .accessLevel("PUBLIC")
                        .data(UserMapper.toPublicDTO(target))
                        .build();
            }
            boolean canEdit = isOwn;
            return UserProfileResponse.builder()
                    .accessLevel("FULL")
                    .data(UserMapper.toFullDTO(target, created, resolved, canEdit))
                    .build();
        }

        // USER → vede simplu despre toți, full despre propriul profil
        if (isOwn) {
            return UserProfileResponse.builder()
                    .accessLevel("FULL")
                    .data(UserMapper.toFullDTO(target, created, resolved, true))
                    .build();
        }

        return UserProfileResponse.builder()
                .accessLevel("PUBLIC")
                .data(UserMapper.toPublicDTO(target))
                .build();
    }

    @Override
    public StaffDTO getStaff(){
        return StaffDTO.builder()
                .admins(userRepository.findByRole(Role.ADMIN).stream().map(UserMapper::toPublicDTO).toList())
                .agents(userRepository.findByRole(Role.AGENT).stream().map(UserMapper::toPublicDTO).toList())
                .build();
    }

}