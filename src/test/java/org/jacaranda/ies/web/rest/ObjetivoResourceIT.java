package org.jacaranda.ies.web.rest;

import org.jacaranda.ies.ManagerCareApp;
import org.jacaranda.ies.domain.Objetivo;
import org.jacaranda.ies.repository.ObjetivoRepository;
import org.jacaranda.ies.service.ObjetivoService;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ObjetivoResource} REST controller.
 */
@SpringBootTest(classes = ManagerCareApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class ObjetivoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final Integer DEFAULT_PUNTOS = 1;
    private static final Integer UPDATED_PUNTOS = 2;

    @Autowired
    private ObjetivoRepository objetivoRepository;

    @Autowired
    private ObjetivoService objetivoService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restObjetivoMockMvc;

    private Objetivo objetivo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Objetivo createEntity(EntityManager em) {
        Objetivo objetivo = new Objetivo()
            .nombre(DEFAULT_NOMBRE)
            .descripcion(DEFAULT_DESCRIPCION)
            .url(DEFAULT_URL)
            .puntos(DEFAULT_PUNTOS);
        return objetivo;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Objetivo createUpdatedEntity(EntityManager em) {
        Objetivo objetivo = new Objetivo()
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .url(UPDATED_URL)
            .puntos(UPDATED_PUNTOS);
        return objetivo;
    }

    @BeforeEach
    public void initTest() {
        objetivo = createEntity(em);
    }

    @Test
    @Transactional
    public void createObjetivo() throws Exception {
        int databaseSizeBeforeCreate = objetivoRepository.findAll().size();

        // Create the Objetivo
        restObjetivoMockMvc.perform(post("/api/objetivos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(objetivo)))
            .andExpect(status().isCreated());

        // Validate the Objetivo in the database
        List<Objetivo> objetivoList = objetivoRepository.findAll();
        assertThat(objetivoList).hasSize(databaseSizeBeforeCreate + 1);
        Objetivo testObjetivo = objetivoList.get(objetivoList.size() - 1);
        assertThat(testObjetivo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testObjetivo.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
        assertThat(testObjetivo.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testObjetivo.getPuntos()).isEqualTo(DEFAULT_PUNTOS);
    }

    @Test
    @Transactional
    public void createObjetivoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = objetivoRepository.findAll().size();

        // Create the Objetivo with an existing ID
        objetivo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restObjetivoMockMvc.perform(post("/api/objetivos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(objetivo)))
            .andExpect(status().isBadRequest());

        // Validate the Objetivo in the database
        List<Objetivo> objetivoList = objetivoRepository.findAll();
        assertThat(objetivoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllObjetivos() throws Exception {
        // Initialize the database
        objetivoRepository.saveAndFlush(objetivo);

        // Get all the objetivoList
        restObjetivoMockMvc.perform(get("/api/objetivos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(objetivo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)))
            .andExpect(jsonPath("$.[*].puntos").value(hasItem(DEFAULT_PUNTOS)));
    }
    
    @Test
    @Transactional
    public void getObjetivo() throws Exception {
        // Initialize the database
        objetivoRepository.saveAndFlush(objetivo);

        // Get the objetivo
        restObjetivoMockMvc.perform(get("/api/objetivos/{id}", objetivo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(objetivo.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL))
            .andExpect(jsonPath("$.puntos").value(DEFAULT_PUNTOS));
    }

    @Test
    @Transactional
    public void getNonExistingObjetivo() throws Exception {
        // Get the objetivo
        restObjetivoMockMvc.perform(get("/api/objetivos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateObjetivo() throws Exception {
        // Initialize the database
        objetivoService.save(objetivo);

        int databaseSizeBeforeUpdate = objetivoRepository.findAll().size();

        // Update the objetivo
        Objetivo updatedObjetivo = objetivoRepository.findById(objetivo.getId()).get();
        // Disconnect from session so that the updates on updatedObjetivo are not directly saved in db
        em.detach(updatedObjetivo);
        updatedObjetivo
            .nombre(UPDATED_NOMBRE)
            .descripcion(UPDATED_DESCRIPCION)
            .url(UPDATED_URL)
            .puntos(UPDATED_PUNTOS);

        restObjetivoMockMvc.perform(put("/api/objetivos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedObjetivo)))
            .andExpect(status().isOk());

        // Validate the Objetivo in the database
        List<Objetivo> objetivoList = objetivoRepository.findAll();
        assertThat(objetivoList).hasSize(databaseSizeBeforeUpdate);
        Objetivo testObjetivo = objetivoList.get(objetivoList.size() - 1);
        assertThat(testObjetivo.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testObjetivo.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
        assertThat(testObjetivo.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testObjetivo.getPuntos()).isEqualTo(UPDATED_PUNTOS);
    }

    @Test
    @Transactional
    public void updateNonExistingObjetivo() throws Exception {
        int databaseSizeBeforeUpdate = objetivoRepository.findAll().size();

        // Create the Objetivo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restObjetivoMockMvc.perform(put("/api/objetivos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(objetivo)))
            .andExpect(status().isBadRequest());

        // Validate the Objetivo in the database
        List<Objetivo> objetivoList = objetivoRepository.findAll();
        assertThat(objetivoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteObjetivo() throws Exception {
        // Initialize the database
        objetivoService.save(objetivo);

        int databaseSizeBeforeDelete = objetivoRepository.findAll().size();

        // Delete the objetivo
        restObjetivoMockMvc.perform(delete("/api/objetivos/{id}", objetivo.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Objetivo> objetivoList = objetivoRepository.findAll();
        assertThat(objetivoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
