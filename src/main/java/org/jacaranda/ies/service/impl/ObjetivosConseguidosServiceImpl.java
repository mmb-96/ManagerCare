package org.jacaranda.ies.service.impl;

import org.jacaranda.ies.service.ObjetivosConseguidosService;
import org.jacaranda.ies.domain.ObjetivosConseguidos;
import org.jacaranda.ies.repository.ObjetivosConseguidosRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link ObjetivosConseguidos}.
 */
@Service
@Transactional
public class ObjetivosConseguidosServiceImpl implements ObjetivosConseguidosService {

    private final Logger log = LoggerFactory.getLogger(ObjetivosConseguidosServiceImpl.class);

    private final ObjetivosConseguidosRepository objetivosConseguidosRepository;

    public ObjetivosConseguidosServiceImpl(ObjetivosConseguidosRepository objetivosConseguidosRepository) {
        this.objetivosConseguidosRepository = objetivosConseguidosRepository;
    }

    /**
     * Save a objetivosConseguidos.
     *
     * @param objetivosConseguidos the entity to save.
     * @return the persisted entity.
     */
    @Override
    public ObjetivosConseguidos save(ObjetivosConseguidos objetivosConseguidos) {
        log.debug("Request to save ObjetivosConseguidos : {}", objetivosConseguidos);
        return objetivosConseguidosRepository.save(objetivosConseguidos);
    }

    /**
     * Get all the objetivosConseguidos.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ObjetivosConseguidos> findAll() {
        log.debug("Request to get all ObjetivosConseguidos");
        return objetivosConseguidosRepository.findAll();
    }

    /**
     * Get one objetivosConseguidos by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<ObjetivosConseguidos> findOne(Long id) {
        log.debug("Request to get ObjetivosConseguidos : {}", id);
        return objetivosConseguidosRepository.findById(id);
    }
    
    /**
     * Get one objetivosConseguidos by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ObjetivosConseguidos> findByUserObjetivo(String login) {
        log.debug("Request to get ObjetivosConseguidos : {}", login);
        return objetivosConseguidosRepository.findByUserObjetivo(login);
    }


    /**
     * Delete the objetivosConseguidos by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ObjetivosConseguidos : {}", id);
        objetivosConseguidosRepository.deleteById(id);
    }
}
