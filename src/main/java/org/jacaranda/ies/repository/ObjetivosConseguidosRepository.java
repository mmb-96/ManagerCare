package org.jacaranda.ies.repository;

import org.jacaranda.ies.domain.ObjetivosConseguidos;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ObjetivosConseguidos entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ObjetivosConseguidosRepository extends JpaRepository<ObjetivosConseguidos, Long> {

    @Query("select objetivosConseguidos from ObjetivosConseguidos objetivosConseguidos where objetivosConseguidos.user.login = ?#{principal.username}")
    List<ObjetivosConseguidos> findByUserIsCurrentUser();
    
    @Query("select objetivosConseguidos from ObjetivosConseguidos objetivosConseguidos where objetivosConseguidos.user.login =:login")
    List<ObjetivosConseguidos> findByUserObjetivo(@Param("login") String login);
}
