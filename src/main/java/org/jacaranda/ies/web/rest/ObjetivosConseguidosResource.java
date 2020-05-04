package org.jacaranda.ies.web.rest;

import org.jacaranda.ies.domain.ObjetivosConseguidos;
import org.jacaranda.ies.security.AuthoritiesConstants;
import org.jacaranda.ies.service.ObjetivosConseguidosService;
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
 * REST controller for managing {@link org.jacaranda.ies.domain.ObjetivosConseguidos}.
 */
@RestController
@RequestMapping("/api")
public class ObjetivosConseguidosResource {

    private final Logger log = LoggerFactory.getLogger(ObjetivosConseguidosResource.class);

    private static final String ENTITY_NAME = "objetivosConseguidos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ObjetivosConseguidosService objetivosConseguidosService;

    public ObjetivosConseguidosResource(ObjetivosConseguidosService objetivosConseguidosService) {
        this.objetivosConseguidosService = objetivosConseguidosService;
    }

    /**
     * {@code POST  /objetivos-conseguidos} : Create a new objetivosConseguidos.
     *
     * @param objetivosConseguidos the objetivosConseguidos to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new objetivosConseguidos, or with status {@code 400 (Bad Request)} if the objetivosConseguidos has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/objetivos-conseguidos")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<ObjetivosConseguidos> createObjetivosConseguidos(@RequestBody ObjetivosConseguidos objetivosConseguidos) throws URISyntaxException {
        log.debug("REST request to save ObjetivosConseguidos : {}", objetivosConseguidos);
        if (objetivosConseguidos.getId() != null) {
            throw new BadRequestAlertException("A new objetivosConseguidos cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ObjetivosConseguidos result = objetivosConseguidosService.save(objetivosConseguidos);
        return ResponseEntity.created(new URI("/api/objetivos-conseguidos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /objetivos-conseguidos} : Updates an existing objetivosConseguidos.
     *
     * @param objetivosConseguidos the objetivosConseguidos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated objetivosConseguidos,
     * or with status {@code 400 (Bad Request)} if the objetivosConseguidos is not valid,
     * or with status {@code 500 (Internal Server Error)} if the objetivosConseguidos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/objetivos-conseguidos")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<ObjetivosConseguidos> updateObjetivosConseguidos(@RequestBody ObjetivosConseguidos objetivosConseguidos) throws URISyntaxException {
        log.debug("REST request to update ObjetivosConseguidos : {}", objetivosConseguidos);
        if (objetivosConseguidos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ObjetivosConseguidos result = objetivosConseguidosService.save(objetivosConseguidos);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, objetivosConseguidos.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /objetivos-conseguidos} : get all the objetivosConseguidos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of objetivosConseguidos in body.
     */
    @GetMapping("/objetivos-conseguidos")
    public List<ObjetivosConseguidos> getAllObjetivosConseguidos() {
        log.debug("REST request to get all ObjetivosConseguidos");
        return objetivosConseguidosService.findAll();
    }

    /**
     * {@code GET  /objetivos-conseguidos/:id} : get the "id" objetivosConseguidos.
     *
     * @param id the id of the objetivosConseguidos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the objetivosConseguidos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/objetivos-conseguidos/{id}")
    public ResponseEntity<ObjetivosConseguidos> getObjetivosConseguidos(@PathVariable Long id) {
        log.debug("REST request to get ObjetivosConseguidos : {}", id);
        Optional<ObjetivosConseguidos> objetivosConseguidos = objetivosConseguidosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(objetivosConseguidos);
    }
    
    /**
     * {@code GET  /objetivos-ST/:{login} : get all the objetivosConseguidos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of objetivosConseguidos in body.
     */
    @GetMapping("/objetivos-ST/{login}")
    public List<ObjetivosConseguidos> getAllObjetivosConseguidos(@PathVariable String login) {
        log.debug("REST request to get ObjetivosConseguidos Miembro del equipo : {}", login);
        return objetivosConseguidosService.findByUserObjetivo(login);
    }

    /**
     * {@code DELETE  /objetivos-conseguidos/:id} : delete the "id" objetivosConseguidos.
     *
     * @param id the id of the objetivosConseguidos to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/objetivos-conseguidos/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteObjetivosConseguidos(@PathVariable Long id) {
        log.debug("REST request to delete ObjetivosConseguidos : {}", id);
        objetivosConseguidosService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
