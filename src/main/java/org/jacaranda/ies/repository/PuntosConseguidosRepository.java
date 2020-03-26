package org.jacaranda.ies.repository;

import org.jacaranda.ies.domain.PuntosConseguidos;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the PuntosConseguidos entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PuntosConseguidosRepository extends JpaRepository<PuntosConseguidos, Long> {

    @Query("select puntosConseguidos from PuntosConseguidos puntosConseguidos where puntosConseguidos.user.login = ?#{principal.username}")
    List<PuntosConseguidos> findByUserIsCurrentUser();
}
