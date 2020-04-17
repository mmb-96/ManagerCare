package org.jacaranda.ies.service;

import org.jacaranda.ies.domain.Objetivo;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Objetivo}.
 */
public interface ObjetivoService {

    /**
     * Save a objetivo.
     *
     * @param objetivo the entity to save.
     * @return the persisted entity.
     */
    Objetivo save(Objetivo objetivo);

    /**
     * Get all the objetivos.
     *
     * @return the list of entities.
     */
    List<Objetivo> findAll();

    /**
     * Get the "id" objetivo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Objetivo> findOne(Long id);

    /**
     * Delete the "id" objetivo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Get all the objetivos the user.
     *
     * @return the list of entities.
     */
	List<Objetivo> findObjetivoUser();

    /**
     * Get all the objetivos the categoria.
     *
     * @return the list of entities.
     */
	List<Objetivo> findObjetivoCat();
}
