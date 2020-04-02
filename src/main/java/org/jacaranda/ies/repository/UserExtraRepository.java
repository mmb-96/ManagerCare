package org.jacaranda.ies.repository;

import org.jacaranda.ies.domain.UserExtra;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the UserExtra entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserExtraRepository extends JpaRepository<UserExtra, Long> {

    @Query("select userExtra from UserExtra userExtra where userExtra.idResponsable.login = ?#{principal.username}")
    List<UserExtra> findByIdResponsableIsCurrentUser();
}
