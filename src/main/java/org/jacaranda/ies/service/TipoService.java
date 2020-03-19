package org.jacaranda.ies.service;

import org.jacaranda.ies.domain.Tipo;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Tipo}.
 */
public interface TipoService {

    /**
     * Save a tipo.
     *
     * @param tipo the entity to save.
     * @return the persisted entity.
     */
    Tipo save(Tipo tipo);

    /**
     * Get all the tipos.
     *
     * @return the list of entities.
     */
    List<Tipo> findAll();

    /**
     * Get the "id" tipo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Tipo> findOne(Long id);

    /**
     * Delete the "id" tipo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
