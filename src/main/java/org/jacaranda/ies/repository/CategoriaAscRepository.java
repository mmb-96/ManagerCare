package org.jacaranda.ies.repository;

import org.jacaranda.ies.domain.CategoriaAsc;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the CategoriaAsc entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoriaAscRepository extends JpaRepository<CategoriaAsc, Long> {
}
