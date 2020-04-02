package org.jacaranda.ies.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.jacaranda.ies.domain.CategoriaAsc;
import org.jacaranda.ies.security.AuthoritiesConstants;
import org.jacaranda.ies.service.CategoriaAscService;
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
 * REST controller for managing {@link org.jacaranda.ies.domain.CategoriaAsc}.
 */
@RestController
@RequestMapping("/api")
public class CategoriaAscResource {

    private final Logger log = LoggerFactory.getLogger(CategoriaAscResource.class);

    private static final String ENTITY_NAME = "categoriaAsc";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CategoriaAscService categoriaAscService;

    public CategoriaAscResource(CategoriaAscService categoriaAscService) {
        this.categoriaAscService = categoriaAscService;
    }

    /**
     * {@code POST  /categoria-ascs} : Create a new categoriaAsc.
     *
     * @param categoriaAsc the categoriaAsc to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new categoriaAsc, or with status {@code 400 (Bad Request)} if the categoriaAsc has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/categoria-ascs")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<CategoriaAsc> createCategoriaAsc(@RequestBody CategoriaAsc categoriaAsc) throws URISyntaxException {
        log.debug("REST request to save CategoriaAsc : {}", categoriaAsc);
        if (categoriaAsc.getId() != null) {
            throw new BadRequestAlertException("A new categoriaAsc cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CategoriaAsc result = categoriaAscService.save(categoriaAsc);
        return ResponseEntity.created(new URI("/api/categoria-ascs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /categoria-ascs} : Updates an existing categoriaAsc.
     *
     * @param categoriaAsc the categoriaAsc to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated categoriaAsc,
     * or with status {@code 400 (Bad Request)} if the categoriaAsc is not valid,
     * or with status {@code 500 (Internal Server Error)} if the categoriaAsc couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/categoria-ascs")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<CategoriaAsc> updateCategoriaAsc(@RequestBody CategoriaAsc categoriaAsc) throws URISyntaxException {
        log.debug("REST request to update CategoriaAsc : {}", categoriaAsc);
        if (categoriaAsc.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CategoriaAsc result = categoriaAscService.save(categoriaAsc);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, categoriaAsc.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /categoria-ascs} : get all the categoriaAscs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of categoriaAscs in body.
     */
    @GetMapping("/categoria-ascs")
    public List<CategoriaAsc> getAllCategoriaAscs() {
        log.debug("REST request to get all CategoriaAscs");
        return categoriaAscService.findAll();
    }

    /**
     * {@code GET  /categoria-ascs/:id} : get the "id" categoriaAsc.
     *
     * @param id the id of the categoriaAsc to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the categoriaAsc, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/categoria-ascs/{id}")
    public ResponseEntity<CategoriaAsc> getCategoriaAsc(@PathVariable Long id) {
        log.debug("REST request to get CategoriaAsc : {}", id);
        Optional<CategoriaAsc> categoriaAsc = categoriaAscService.findOne(id);
        return ResponseUtil.wrapOrNotFound(categoriaAsc);
    }

    /**
     * {@code DELETE  /categoria-ascs/:id} : delete the "id" categoriaAsc.
     *
     * @param id the id of the categoriaAsc to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/categoria-ascs/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<Void> deleteCategoriaAsc(@PathVariable Long id) {
        log.debug("REST request to delete CategoriaAsc : {}", id);
        categoriaAscService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
