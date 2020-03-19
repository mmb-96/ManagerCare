package org.jacaranda.ies.service.impl;

import org.jacaranda.ies.service.TipoService;
import org.jacaranda.ies.domain.Tipo;
import org.jacaranda.ies.repository.TipoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Tipo}.
 */
@Service
@Transactional
public class TipoServiceImpl implements TipoService {

    private final Logger log = LoggerFactory.getLogger(TipoServiceImpl.class);

    private final TipoRepository tipoRepository;

    public TipoServiceImpl(TipoRepository tipoRepository) {
        this.tipoRepository = tipoRepository;
    }

    /**
     * Save a tipo.
     *
     * @param tipo the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Tipo save(Tipo tipo) {
        log.debug("Request to save Tipo : {}", tipo);
        return tipoRepository.save(tipo);
    }

    /**
     * Get all the tipos.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Tipo> findAll() {
        log.debug("Request to get all Tipos");
        return tipoRepository.findAll();
    }

    /**
     * Get one tipo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Tipo> findOne(Long id) {
        log.debug("Request to get Tipo : {}", id);
        return tipoRepository.findById(id);
    }

    /**
     * Delete the tipo by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tipo : {}", id);
        tipoRepository.deleteById(id);
    }
}
