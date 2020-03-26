package org.jacaranda.ies.service;

import org.jacaranda.ies.domain.PuntosConseguidos;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link PuntosConseguidos}.
 */
public interface PuntosConseguidosService {

    /**
     * Save a puntosConseguidos.
     *
     * @param puntosConseguidos the entity to save.
     * @return the persisted entity.
     */
    PuntosConseguidos save(PuntosConseguidos puntosConseguidos);

    /**
     * Get all the puntosConseguidos.
     *
     * @return the list of entities.
     */
    List<PuntosConseguidos> findAll();

    /**
     * Get the "id" puntosConseguidos.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<PuntosConseguidos> findOne(Long id);

    /**
     * Delete the "id" puntosConseguidos.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
