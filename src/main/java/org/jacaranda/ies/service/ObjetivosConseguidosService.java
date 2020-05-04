package org.jacaranda.ies.service;

import org.jacaranda.ies.domain.ObjetivosConseguidos;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link ObjetivosConseguidos}.
 */
public interface ObjetivosConseguidosService {

    /**
     * Save a objetivosConseguidos.
     *
     * @param objetivosConseguidos the entity to save.
     * @return the persisted entity.
     */
    ObjetivosConseguidos save(ObjetivosConseguidos objetivosConseguidos);

    /**
     * Get all the objetivosConseguidos.
     *
     * @return the list of entities.
     */
    List<ObjetivosConseguidos> findAll();

    /**
     * Get the "id" objetivosConseguidos.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ObjetivosConseguidos> findOne(Long id);

    /**
     * Delete the "id" objetivosConseguidos.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

	List<ObjetivosConseguidos> findByUserObjetivo(String login);
}
