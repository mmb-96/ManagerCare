package org.jacaranda.ies.web.rest;

import org.jacaranda.ies.ManagerCareApp;
import org.jacaranda.ies.domain.PuntosConseguidos;
import org.jacaranda.ies.repository.PuntosConseguidosRepository;
import org.jacaranda.ies.service.PuntosConseguidosService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static org.jacaranda.ies.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link PuntosConseguidosResource} REST controller.
 */
@SpringBootTest(classes = ManagerCareApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class PuntosConseguidosResourceIT {

    private static final Integer DEFAULT_PUNTOS = 1;
    private static final Integer UPDATED_PUNTOS = 2;

    private static final ZonedDateTime DEFAULT_ANYOS = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_ANYOS = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private PuntosConseguidosRepository puntosConseguidosRepository;

    @Autowired
    private PuntosConseguidosService puntosConseguidosService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPuntosConseguidosMockMvc;

    private PuntosConseguidos puntosConseguidos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PuntosConseguidos createEntity(EntityManager em) {
        PuntosConseguidos puntosConseguidos = new PuntosConseguidos()
            .puntos(DEFAULT_PUNTOS)
            .anyos(DEFAULT_ANYOS);
        return puntosConseguidos;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PuntosConseguidos createUpdatedEntity(EntityManager em) {
        PuntosConseguidos puntosConseguidos = new PuntosConseguidos()
            .puntos(UPDATED_PUNTOS)
            .anyos(UPDATED_ANYOS);
        return puntosConseguidos;
    }

    @BeforeEach
    public void initTest() {
        puntosConseguidos = createEntity(em);
    }

    @Test
    @Transactional
    public void createPuntosConseguidos() throws Exception {
        int databaseSizeBeforeCreate = puntosConseguidosRepository.findAll().size();

        // Create the PuntosConseguidos
        restPuntosConseguidosMockMvc.perform(post("/api/puntos-conseguidos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(puntosConseguidos)))
            .andExpect(status().isCreated());

        // Validate the PuntosConseguidos in the database
        List<PuntosConseguidos> puntosConseguidosList = puntosConseguidosRepository.findAll();
        assertThat(puntosConseguidosList).hasSize(databaseSizeBeforeCreate + 1);
        PuntosConseguidos testPuntosConseguidos = puntosConseguidosList.get(puntosConseguidosList.size() - 1);
        assertThat(testPuntosConseguidos.getPuntos()).isEqualTo(DEFAULT_PUNTOS);
        assertThat(testPuntosConseguidos.getAnyos()).isEqualTo(DEFAULT_ANYOS);
    }

    @Test
    @Transactional
    public void createPuntosConseguidosWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = puntosConseguidosRepository.findAll().size();

        // Create the PuntosConseguidos with an existing ID
        puntosConseguidos.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPuntosConseguidosMockMvc.perform(post("/api/puntos-conseguidos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(puntosConseguidos)))
            .andExpect(status().isBadRequest());

        // Validate the PuntosConseguidos in the database
        List<PuntosConseguidos> puntosConseguidosList = puntosConseguidosRepository.findAll();
        assertThat(puntosConseguidosList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllPuntosConseguidos() throws Exception {
        // Initialize the database
        puntosConseguidosRepository.saveAndFlush(puntosConseguidos);

        // Get all the puntosConseguidosList
        restPuntosConseguidosMockMvc.perform(get("/api/puntos-conseguidos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(puntosConseguidos.getId().intValue())))
            .andExpect(jsonPath("$.[*].puntos").value(hasItem(DEFAULT_PUNTOS)))
            .andExpect(jsonPath("$.[*].anyos").value(hasItem(sameInstant(DEFAULT_ANYOS))));
    }
    
    @Test
    @Transactional
    public void getPuntosConseguidos() throws Exception {
        // Initialize the database
        puntosConseguidosRepository.saveAndFlush(puntosConseguidos);

        // Get the puntosConseguidos
        restPuntosConseguidosMockMvc.perform(get("/api/puntos-conseguidos/{id}", puntosConseguidos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(puntosConseguidos.getId().intValue()))
            .andExpect(jsonPath("$.puntos").value(DEFAULT_PUNTOS))
            .andExpect(jsonPath("$.anyos").value(sameInstant(DEFAULT_ANYOS)));
    }

    @Test
    @Transactional
    public void getNonExistingPuntosConseguidos() throws Exception {
        // Get the puntosConseguidos
        restPuntosConseguidosMockMvc.perform(get("/api/puntos-conseguidos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePuntosConseguidos() throws Exception {
        // Initialize the database
        puntosConseguidosService.save(puntosConseguidos);

        int databaseSizeBeforeUpdate = puntosConseguidosRepository.findAll().size();

        // Update the puntosConseguidos
        PuntosConseguidos updatedPuntosConseguidos = puntosConseguidosRepository.findById(puntosConseguidos.getId()).get();
        // Disconnect from session so that the updates on updatedPuntosConseguidos are not directly saved in db
        em.detach(updatedPuntosConseguidos);
        updatedPuntosConseguidos
            .puntos(UPDATED_PUNTOS)
            .anyos(UPDATED_ANYOS);

        restPuntosConseguidosMockMvc.perform(put("/api/puntos-conseguidos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPuntosConseguidos)))
            .andExpect(status().isOk());

        // Validate the PuntosConseguidos in the database
        List<PuntosConseguidos> puntosConseguidosList = puntosConseguidosRepository.findAll();
        assertThat(puntosConseguidosList).hasSize(databaseSizeBeforeUpdate);
        PuntosConseguidos testPuntosConseguidos = puntosConseguidosList.get(puntosConseguidosList.size() - 1);
        assertThat(testPuntosConseguidos.getPuntos()).isEqualTo(UPDATED_PUNTOS);
        assertThat(testPuntosConseguidos.getAnyos()).isEqualTo(UPDATED_ANYOS);
    }

    @Test
    @Transactional
    public void updateNonExistingPuntosConseguidos() throws Exception {
        int databaseSizeBeforeUpdate = puntosConseguidosRepository.findAll().size();

        // Create the PuntosConseguidos

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPuntosConseguidosMockMvc.perform(put("/api/puntos-conseguidos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(puntosConseguidos)))
            .andExpect(status().isBadRequest());

        // Validate the PuntosConseguidos in the database
        List<PuntosConseguidos> puntosConseguidosList = puntosConseguidosRepository.findAll();
        assertThat(puntosConseguidosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePuntosConseguidos() throws Exception {
        // Initialize the database
        puntosConseguidosService.save(puntosConseguidos);

        int databaseSizeBeforeDelete = puntosConseguidosRepository.findAll().size();

        // Delete the puntosConseguidos
        restPuntosConseguidosMockMvc.perform(delete("/api/puntos-conseguidos/{id}", puntosConseguidos.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PuntosConseguidos> puntosConseguidosList = puntosConseguidosRepository.findAll();
        assertThat(puntosConseguidosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
