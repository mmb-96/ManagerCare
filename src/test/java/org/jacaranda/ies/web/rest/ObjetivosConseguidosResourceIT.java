package org.jacaranda.ies.web.rest;

import org.jacaranda.ies.ManagerCareApp;
import org.jacaranda.ies.domain.ObjetivosConseguidos;
import org.jacaranda.ies.repository.ObjetivosConseguidosRepository;
import org.jacaranda.ies.service.ObjetivosConseguidosService;

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
 * Integration tests for the {@link ObjetivosConseguidosResource} REST controller.
 */
@SpringBootTest(classes = ManagerCareApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class ObjetivosConseguidosResourceIT {

    private static final Boolean DEFAULT_ESTADO = false;
    private static final Boolean UPDATED_ESTADO = true;

    private static final ZonedDateTime DEFAULT_FECHA_APERTURA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FECHA_APERTURA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_FECHA_CIERRE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_FECHA_CIERRE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ObjetivosConseguidosRepository objetivosConseguidosRepository;

    @Autowired
    private ObjetivosConseguidosService objetivosConseguidosService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restObjetivosConseguidosMockMvc;

    private ObjetivosConseguidos objetivosConseguidos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ObjetivosConseguidos createEntity(EntityManager em) {
        ObjetivosConseguidos objetivosConseguidos = new ObjetivosConseguidos()
            .estado(DEFAULT_ESTADO)
            .fechaApertura(DEFAULT_FECHA_APERTURA)
            .fechaCierre(DEFAULT_FECHA_CIERRE);
        return objetivosConseguidos;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ObjetivosConseguidos createUpdatedEntity(EntityManager em) {
        ObjetivosConseguidos objetivosConseguidos = new ObjetivosConseguidos()
            .estado(UPDATED_ESTADO)
            .fechaApertura(UPDATED_FECHA_APERTURA)
            .fechaCierre(UPDATED_FECHA_CIERRE);
        return objetivosConseguidos;
    }

    @BeforeEach
    public void initTest() {
        objetivosConseguidos = createEntity(em);
    }

    @Test
    @Transactional
    public void createObjetivosConseguidos() throws Exception {
        int databaseSizeBeforeCreate = objetivosConseguidosRepository.findAll().size();

        // Create the ObjetivosConseguidos
        restObjetivosConseguidosMockMvc.perform(post("/api/objetivos-conseguidos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(objetivosConseguidos)))
            .andExpect(status().isCreated());

        // Validate the ObjetivosConseguidos in the database
        List<ObjetivosConseguidos> objetivosConseguidosList = objetivosConseguidosRepository.findAll();
        assertThat(objetivosConseguidosList).hasSize(databaseSizeBeforeCreate + 1);
        ObjetivosConseguidos testObjetivosConseguidos = objetivosConseguidosList.get(objetivosConseguidosList.size() - 1);
        assertThat(testObjetivosConseguidos.isEstado()).isEqualTo(DEFAULT_ESTADO);
        assertThat(testObjetivosConseguidos.getFechaApertura()).isEqualTo(DEFAULT_FECHA_APERTURA);
        assertThat(testObjetivosConseguidos.getFechaCierre()).isEqualTo(DEFAULT_FECHA_CIERRE);
    }

    @Test
    @Transactional
    public void createObjetivosConseguidosWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = objetivosConseguidosRepository.findAll().size();

        // Create the ObjetivosConseguidos with an existing ID
        objetivosConseguidos.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restObjetivosConseguidosMockMvc.perform(post("/api/objetivos-conseguidos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(objetivosConseguidos)))
            .andExpect(status().isBadRequest());

        // Validate the ObjetivosConseguidos in the database
        List<ObjetivosConseguidos> objetivosConseguidosList = objetivosConseguidosRepository.findAll();
        assertThat(objetivosConseguidosList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllObjetivosConseguidos() throws Exception {
        // Initialize the database
        objetivosConseguidosRepository.saveAndFlush(objetivosConseguidos);

        // Get all the objetivosConseguidosList
        restObjetivosConseguidosMockMvc.perform(get("/api/objetivos-conseguidos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(objetivosConseguidos.getId().intValue())))
            .andExpect(jsonPath("$.[*].estado").value(hasItem(DEFAULT_ESTADO.booleanValue())))
            .andExpect(jsonPath("$.[*].fechaApertura").value(hasItem(sameInstant(DEFAULT_FECHA_APERTURA))))
            .andExpect(jsonPath("$.[*].fechaCierre").value(hasItem(sameInstant(DEFAULT_FECHA_CIERRE))));
    }
    
    @Test
    @Transactional
    public void getObjetivosConseguidos() throws Exception {
        // Initialize the database
        objetivosConseguidosRepository.saveAndFlush(objetivosConseguidos);

        // Get the objetivosConseguidos
        restObjetivosConseguidosMockMvc.perform(get("/api/objetivos-conseguidos/{id}", objetivosConseguidos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(objetivosConseguidos.getId().intValue()))
            .andExpect(jsonPath("$.estado").value(DEFAULT_ESTADO.booleanValue()))
            .andExpect(jsonPath("$.fechaApertura").value(sameInstant(DEFAULT_FECHA_APERTURA)))
            .andExpect(jsonPath("$.fechaCierre").value(sameInstant(DEFAULT_FECHA_CIERRE)));
    }

    @Test
    @Transactional
    public void getNonExistingObjetivosConseguidos() throws Exception {
        // Get the objetivosConseguidos
        restObjetivosConseguidosMockMvc.perform(get("/api/objetivos-conseguidos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateObjetivosConseguidos() throws Exception {
        // Initialize the database
        objetivosConseguidosService.save(objetivosConseguidos);

        int databaseSizeBeforeUpdate = objetivosConseguidosRepository.findAll().size();

        // Update the objetivosConseguidos
        ObjetivosConseguidos updatedObjetivosConseguidos = objetivosConseguidosRepository.findById(objetivosConseguidos.getId()).get();
        // Disconnect from session so that the updates on updatedObjetivosConseguidos are not directly saved in db
        em.detach(updatedObjetivosConseguidos);
        updatedObjetivosConseguidos
            .estado(UPDATED_ESTADO)
            .fechaApertura(UPDATED_FECHA_APERTURA)
            .fechaCierre(UPDATED_FECHA_CIERRE);

        restObjetivosConseguidosMockMvc.perform(put("/api/objetivos-conseguidos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedObjetivosConseguidos)))
            .andExpect(status().isOk());

        // Validate the ObjetivosConseguidos in the database
        List<ObjetivosConseguidos> objetivosConseguidosList = objetivosConseguidosRepository.findAll();
        assertThat(objetivosConseguidosList).hasSize(databaseSizeBeforeUpdate);
        ObjetivosConseguidos testObjetivosConseguidos = objetivosConseguidosList.get(objetivosConseguidosList.size() - 1);
        assertThat(testObjetivosConseguidos.isEstado()).isEqualTo(UPDATED_ESTADO);
        assertThat(testObjetivosConseguidos.getFechaApertura()).isEqualTo(UPDATED_FECHA_APERTURA);
        assertThat(testObjetivosConseguidos.getFechaCierre()).isEqualTo(UPDATED_FECHA_CIERRE);
    }

    @Test
    @Transactional
    public void updateNonExistingObjetivosConseguidos() throws Exception {
        int databaseSizeBeforeUpdate = objetivosConseguidosRepository.findAll().size();

        // Create the ObjetivosConseguidos

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restObjetivosConseguidosMockMvc.perform(put("/api/objetivos-conseguidos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(objetivosConseguidos)))
            .andExpect(status().isBadRequest());

        // Validate the ObjetivosConseguidos in the database
        List<ObjetivosConseguidos> objetivosConseguidosList = objetivosConseguidosRepository.findAll();
        assertThat(objetivosConseguidosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteObjetivosConseguidos() throws Exception {
        // Initialize the database
        objetivosConseguidosService.save(objetivosConseguidos);

        int databaseSizeBeforeDelete = objetivosConseguidosRepository.findAll().size();

        // Delete the objetivosConseguidos
        restObjetivosConseguidosMockMvc.perform(delete("/api/objetivos-conseguidos/{id}", objetivosConseguidos.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ObjetivosConseguidos> objetivosConseguidosList = objetivosConseguidosRepository.findAll();
        assertThat(objetivosConseguidosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
