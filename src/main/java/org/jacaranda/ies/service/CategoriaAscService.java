package org.jacaranda.ies.service;

import org.jacaranda.ies.domain.CategoriaAsc;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link CategoriaAsc}.
 */
public interface CategoriaAscService {

    /**
     * Save a categoriaAsc.
     *
     * @param categoriaAsc the entity to save.
     * @return the persisted entity.
     */
    CategoriaAsc save(CategoriaAsc categoriaAsc);

    /**
     * Get all the categoriaAscs.
     *
     * @return the list of entities.
     */
    List<CategoriaAsc> findAll();

    /**
     * Get the "id" categoriaAsc.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CategoriaAsc> findOne(Long id);

    /**
     * Delete the "id" categoriaAsc.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
