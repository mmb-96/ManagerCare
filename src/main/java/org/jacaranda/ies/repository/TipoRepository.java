package org.jacaranda.ies.repository;

import org.jacaranda.ies.domain.Tipo;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Tipo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TipoRepository extends JpaRepository<Tipo, Long> {
}
