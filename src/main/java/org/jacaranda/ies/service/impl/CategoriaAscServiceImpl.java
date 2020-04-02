package org.jacaranda.ies.service.impl;

import org.jacaranda.ies.service.CategoriaAscService;
import org.jacaranda.ies.domain.CategoriaAsc;
import org.jacaranda.ies.repository.CategoriaAscRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link CategoriaAsc}.
 */
@Service
@Transactional
public class CategoriaAscServiceImpl implements CategoriaAscService {

    private final Logger log = LoggerFactory.getLogger(CategoriaAscServiceImpl.class);

    private final CategoriaAscRepository categoriaAscRepository;

    public CategoriaAscServiceImpl(CategoriaAscRepository categoriaAscRepository) {
        this.categoriaAscRepository = categoriaAscRepository;
    }

    /**
     * Save a categoriaAsc.
     *
     * @param categoriaAsc the entity to save.
     * @return the persisted entity.
     */
    @Override
    public CategoriaAsc save(CategoriaAsc categoriaAsc) {
        log.debug("Request to save CategoriaAsc : {}", categoriaAsc);
        return categoriaAscRepository.save(categoriaAsc);
    }

    /**
     * Get all the categoriaAscs.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<CategoriaAsc> findAll() {
        log.debug("Request to get all CategoriaAscs");
        return categoriaAscRepository.findAll();
    }

    /**
     * Get one categoriaAsc by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<CategoriaAsc> findOne(Long id) {
        log.debug("Request to get CategoriaAsc : {}", id);
        return categoriaAscRepository.findById(id);
    }

    /**
     * Delete the categoriaAsc by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete CategoriaAsc : {}", id);
        categoriaAscRepository.deleteById(id);
    }
}
