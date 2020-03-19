package org.jacaranda.ies.web.rest;

import org.jacaranda.ies.domain.Tipo;
import org.jacaranda.ies.service.TipoService;
import org.jacaranda.ies.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.jacaranda.ies.domain.Tipo}.
 */
@RestController
@RequestMapping("/api")
public class TipoResource {

    private final Logger log = LoggerFactory.getLogger(TipoResource.class);

    private static final String ENTITY_NAME = "tipo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TipoService tipoService;

    public TipoResource(TipoService tipoService) {
        this.tipoService = tipoService;
    }

    /**
     * {@code POST  /tipos} : Create a new tipo.
     *
     * @param tipo the tipo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tipo, or with status {@code 400 (Bad Request)} if the tipo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tipos")
    public ResponseEntity<Tipo> createTipo(@RequestBody Tipo tipo) throws URISyntaxException {
        log.debug("REST request to save Tipo : {}", tipo);
        if (tipo.getId() != null) {
            throw new BadRequestAlertException("A new tipo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tipo result = tipoService.save(tipo);
        return ResponseEntity.created(new URI("/api/tipos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tipos} : Updates an existing tipo.
     *
     * @param tipo the tipo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tipo,
     * or with status {@code 400 (Bad Request)} if the tipo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tipo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tipos")
    public ResponseEntity<Tipo> updateTipo(@RequestBody Tipo tipo) throws URISyntaxException {
        log.debug("REST request to update Tipo : {}", tipo);
        if (tipo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tipo result = tipoService.save(tipo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tipo.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /tipos} : get all the tipos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tipos in body.
     */
    @GetMapping("/tipos")
    public List<Tipo> getAllTipos() {
        log.debug("REST request to get all Tipos");
        return tipoService.findAll();
    }

    /**
     * {@code GET  /tipos/:id} : get the "id" tipo.
     *
     * @param id the id of the tipo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tipo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tipos/{id}")
    public ResponseEntity<Tipo> getTipo(@PathVariable Long id) {
        log.debug("REST request to get Tipo : {}", id);
        Optional<Tipo> tipo = tipoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(tipo);
    }

    /**
     * {@code DELETE  /tipos/:id} : delete the "id" tipo.
     *
     * @param id the id of the tipo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tipos/{id}")
    public ResponseEntity<Void> deleteTipo(@PathVariable Long id) {
        log.debug("REST request to delete Tipo : {}", id);
        tipoService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
