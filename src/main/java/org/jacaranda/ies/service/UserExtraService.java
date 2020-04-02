package org.jacaranda.ies.service;

import org.jacaranda.ies.domain.UserExtra;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link UserExtra}.
 */
public interface UserExtraService {

    /**
     * Save a userExtra.
     *
     * @param userExtra the entity to save.
     * @return the persisted entity.
     */
    UserExtra save(UserExtra userExtra);

    /**
     * Get all the userExtras.
     *
     * @return the list of entities.
     */
    List<UserExtra> findAll();

    /**
     * Get the "id" userExtra.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserExtra> findOne(Long id);

    /**
     * Delete the "id" userExtra.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
