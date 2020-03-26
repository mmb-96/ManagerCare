package org.jacaranda.ies.service.impl;

import org.jacaranda.ies.service.PuntosConseguidosService;
import org.jacaranda.ies.domain.PuntosConseguidos;
import org.jacaranda.ies.repository.PuntosConseguidosRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link PuntosConseguidos}.
 */
@Service
@Transactional
public class PuntosConseguidosServiceImpl implements PuntosConseguidosService {

    private final Logger log = LoggerFactory.getLogger(PuntosConseguidosServiceImpl.class);

    private final PuntosConseguidosRepository puntosConseguidosRepository;

    public PuntosConseguidosServiceImpl(PuntosConseguidosRepository puntosConseguidosRepository) {
        this.puntosConseguidosRepository = puntosConseguidosRepository;
    }

    /**
     * Save a puntosConseguidos.
     *
     * @param puntosConseguidos the entity to save.
     * @return the persisted entity.
     */
    @Override
    public PuntosConseguidos save(PuntosConseguidos puntosConseguidos) {
        log.debug("Request to save PuntosConseguidos : {}", puntosConseguidos);
        return puntosConseguidosRepository.save(puntosConseguidos);
    }

    /**
     * Get all the puntosConseguidos.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<PuntosConseguidos> findAll() {
        log.debug("Request to get all PuntosConseguidos");
        return puntosConseguidosRepository.findAll();
    }

    /**
     * Get one puntosConseguidos by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<PuntosConseguidos> findOne(Long id) {
        log.debug("Request to get PuntosConseguidos : {}", id);
        return puntosConseguidosRepository.findById(id);
    }

    /**
     * Delete the puntosConseguidos by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete PuntosConseguidos : {}", id);
        puntosConseguidosRepository.deleteById(id);
    }
}
