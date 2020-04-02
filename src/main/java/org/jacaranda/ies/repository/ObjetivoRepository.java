package org.jacaranda.ies.repository;

import java.util.List;

import org.jacaranda.ies.domain.Objetivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Objetivo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ObjetivoRepository extends JpaRepository<Objetivo, Long> {
	
    @Query("select o from Objetivo o join fetch o.categorias cat where cat.id = (Select eu.categoria from UserExtra eu where eu.user.login = ?#{principal.username})")
    List<Objetivo> findObjetivoUser();
}
