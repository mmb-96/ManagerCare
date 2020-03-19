package org.jacaranda.ies.repository;

import org.jacaranda.ies.domain.Objetivo;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Objetivo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ObjetivoRepository extends JpaRepository<Objetivo, Long> {
}
