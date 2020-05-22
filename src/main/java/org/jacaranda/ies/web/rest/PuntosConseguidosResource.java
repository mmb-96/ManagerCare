package org.jacaranda.ies.web.rest;

import org.jacaranda.ies.domain.PuntosConseguidos;
import org.jacaranda.ies.security.AuthoritiesConstants;
import org.jacaranda.ies.service.PuntosConseguidosService;
import org.jacaranda.ies.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.jacaranda.ies.domain.PuntosConseguidos}.
 */
@RestController
@RequestMapping("/api")
public class PuntosConseguidosResource {

    private final Logger log = LoggerFactory.getLogger(PuntosConseguidosResource.class);

    private static final String ENTITY_NAME = "puntosConseguidos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PuntosConseguidosService puntosConseguidosService;

    public PuntosConseguidosResource(PuntosConseguidosService puntosConseguidosService) {
        this.puntosConseguidosService = puntosConseguidosService;
    }

    /**
     * {@code POST  /puntos-conseguidos} : Create a new puntosConseguidos.
     *
     * @param puntosConseguidos the puntosConseguidos to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new puntosConseguidos, or with status {@code 400 (Bad Request)} if the puntosConseguidos has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/puntos-conseguidos")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<PuntosConseguidos> createPuntosConseguidos(@RequestBody PuntosConseguidos puntosConseguidos) throws URISyntaxException {
        log.debug("REST request to save PuntosConseguidos : {}", puntosConseguidos);
        if (puntosConseguidos.getId() != null) {
            throw new BadRequestAlertException("A new puntosConseguidos cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PuntosConseguidos result = puntosConseguidosService.save(puntosConseguidos);
        return ResponseEntity.created(new URI("/api/puntos-conseguidos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /puntos-conseguidos} : Updates an existing puntosConseguidos.
     *
     * @param puntosConseguidos the puntosConseguidos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated puntosConseguidos,
     * or with status {@code 400 (Bad Request)} if the puntosConseguidos is not valid,
     * or with status {@code 500 (Internal Server Error)} if the puntosConseguidos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/puntos-conseguidos")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<PuntosConseguidos> updatePuntosConseguidos(@RequestBody PuntosConseguidos puntosConseguidos) throws URISyntaxException {
        log.debug("REST request to update PuntosConseguidos : {}", puntosConseguidos);
        if (puntosConseguidos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        PuntosConseguidos result = puntosConseguidosService.save(puntosConseguidos);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, puntosConseguidos.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /puntos-conseguidos} : get all the puntosConseguidos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of puntosConseguidos in body.
     */
    @GetMapping("/puntos-conseguidos")
    public List<PuntosConseguidos> getAllPuntosConseguidos() {
        log.debug("REST request to get all PuntosConseguidos");
        return puntosConseguidosService.findAll();
    }

    /**
     * {@code GET  /puntos-conseguidos/:id} : get the "id" puntosConseguidos.
     *
     * @param id the id of the puntosConseguidos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the puntosConseguidos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/puntos-conseguidos/{id}")
    public ResponseEntity<PuntosConseguidos> getPuntosConseguidos(@PathVariable Long id) {
        log.debug("REST request to get PuntosConseguidos : {}", id);
        Optional<PuntosConseguidos> puntosConseguidos = puntosConseguidosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(puntosConseguidos);
    }
    
    /**
     * {@code GET  /puntos-conseguidos-user/:login} : get the puntosConseguidos from the users.
     *
     * @param id the id of the puntosConseguidos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the puntosConseguidos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/puntos-conseguidos-user/{login}")
    public List<PuntosConseguidos> getPuntosConseguidos(@PathVariable String login) {
        log.debug("REST request to get PuntosConseguidos : {}", login);
        return puntosConseguidosService.findByUserPuntos(login);
    }

    /**
     * {@code DELETE  /puntos-conseguidos/:id} : delete the "id" puntosConseguidos.
     *
     * @param id the id of the puntosConseguidos to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/puntos-conseguidos/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deletePuntosConseguidos(@PathVariable Long id) {
        log.debug("REST request to delete PuntosConseguidos : {}", id);
        puntosConseguidosService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
