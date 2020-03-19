package org.jacaranda.ies.service.impl;

import org.jacaranda.ies.service.ObjetivoService;
import org.jacaranda.ies.domain.Objetivo;
import org.jacaranda.ies.repository.ObjetivoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link Objetivo}.
 */
@Service
@Transactional
public class ObjetivoServiceImpl implements ObjetivoService {

    private final Logger log = LoggerFactory.getLogger(ObjetivoServiceImpl.class);

    private final ObjetivoRepository objetivoRepository;

    public ObjetivoServiceImpl(ObjetivoRepository objetivoRepository) {
        this.objetivoRepository = objetivoRepository;
    }

    /**
     * Save a objetivo.
     *
     * @param objetivo the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Objetivo save(Objetivo objetivo) {
        log.debug("Request to save Objetivo : {}", objetivo);
        return objetivoRepository.save(objetivo);
    }

    /**
     * Get all the objetivos.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Objetivo> findAll() {
        log.debug("Request to get all Objetivos");
        return objetivoRepository.findAll();
    }

    /**
     * Get one objetivo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Objetivo> findOne(Long id) {
        log.debug("Request to get Objetivo : {}", id);
        return objetivoRepository.findById(id);
    }

    /**
     * Delete the objetivo by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Objetivo : {}", id);
        objetivoRepository.deleteById(id);
    }
}
