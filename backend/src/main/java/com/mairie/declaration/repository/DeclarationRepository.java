package com.mairie.declaration.repository;

import com.mairie.declaration.entity.Declaration;
import com.mairie.declaration.entity.User;
import com.mairie.declaration.entity.enums.DeclarationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeclarationRepository extends JpaRepository<Declaration, Long> {

    List<Declaration> findByCreatedByOrderByCreatedAtDesc(User user);

    List<Declaration> findByStatusInOrderByCreatedAtAsc(List<DeclarationStatus> statuses);

    List<Declaration> findAllByOrderByCreatedAtDesc();

    long countByStatus(DeclarationStatus status);
}
