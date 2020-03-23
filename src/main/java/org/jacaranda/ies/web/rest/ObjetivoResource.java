package org.jacaranda.ies.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.jacaranda.ies.domain.Objetivo;
import org.jacaranda.ies.security.AuthoritiesConstants;
import org.jacaranda.ies.service.ObjetivoService;
import org.jacaranda.ies.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.jacaranda.ies.domain.Objetivo}.
 */
@RestController
@RequestMapping("/api")
public class ObjetivoResource {

    private final Logger log = LoggerFactory.getLogger(ObjetivoResource.class);

    private static final String ENTITY_NAME = "objetivo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ObjetivoService objetivoService;

    public ObjetivoResource(ObjetivoService objetivoService) {
        this.objetivoService = objetivoService;
    }

    /**
     * {@code POST  /objetivos} : Create a new objetivo.
     *
     * @param objetivo the objetivo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new objetivo, or with status {@code 400 (Bad Request)} if the objetivo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/objetivos")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Objetivo> createObjetivo(@RequestBody Objetivo objetivo) throws URISyntaxException {
        log.debug("REST request to save Objetivo : {}", objetivo);
        if (objetivo.getId() != null) {
            throw new BadRequestAlertException("A new objetivo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Objetivo result = objetivoService.save(objetivo);
        return ResponseEntity.created(new URI("/api/objetivos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /objetivos} : Updates an existing objetivo.
     *
     * @param objetivo the objetivo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated objetivo,
     * or with status {@code 400 (Bad Request)} if the objetivo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the objetivo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/objetivos")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Objetivo> updateObjetivo(@RequestBody Objetivo objetivo) throws URISyntaxException {
        log.debug("REST request to update Objetivo : {}", objetivo);
        if (objetivo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Objetivo result = objetivoService.save(objetivo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, objetivo.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /objetivos} : get all the objetivos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of objetivos in body.
     */
    @GetMapping("/objetivos")
    public List<Objetivo> getAllObjetivos() {
        log.debug("REST request to get all Objetivos");
        return objetivoService.findAll();
    }

    /**
     * {@code GET  /objetivos/:id} : get the "id" objetivo.
     *
     * @param id the id of the objetivo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the objetivo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/objetivos/{id}")
    public ResponseEntity<Objetivo> getObjetivo(@PathVariable Long id) {
        log.debug("REST request to get Objetivo : {}", id);
        Optional<Objetivo> objetivo = objetivoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(objetivo);
    }

    /**
     * {@code DELETE  /objetivos/:id} : delete the "id" objetivo.
     *
     * @param id the id of the objetivo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/objetivos/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteObjetivo(@PathVariable Long id) {
        log.debug("REST request to delete Objetivo : {}", id);
        objetivoService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
