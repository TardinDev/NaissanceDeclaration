package com.mairie.declaration.service;

import com.mairie.declaration.dto.response.StatsResponse;
import com.mairie.declaration.dto.response.UserResponse;
import com.mairie.declaration.entity.User;
import com.mairie.declaration.entity.enums.DeclarationStatus;
import com.mairie.declaration.entity.enums.Role;
import com.mairie.declaration.exception.ResourceNotFoundException;
import com.mairie.declaration.repository.DeclarationRepository;
import com.mairie.declaration.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DeclarationRepository declarationRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    @Transactional
    public UserResponse updateRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'id : " + userId));

        Role role;
        try {
            role = Role.valueOf(roleName.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rôle invalide : " + roleName);
        }

        user.setRole(role);
        User saved = userRepository.save(user);
        return UserResponse.fromEntity(saved);
    }

    public StatsResponse getStats() {
        return StatsResponse.builder()
                .totalDeclarations(declarationRepository.count())
                .pendingDeclarations(
                        declarationRepository.countByStatus(DeclarationStatus.SUBMITTED)
                                + declarationRepository.countByStatus(DeclarationStatus.IN_REVIEW))
                .approvedDeclarations(declarationRepository.countByStatus(DeclarationStatus.APPROVED))
                .rejectedDeclarations(declarationRepository.countByStatus(DeclarationStatus.REJECTED))
                .totalUsers(userRepository.count())
                .totalCitizens(userRepository.countByRole(Role.CITIZEN))
                .totalAgents(userRepository.countByRole(Role.AGENT))
                .build();
    }
}
