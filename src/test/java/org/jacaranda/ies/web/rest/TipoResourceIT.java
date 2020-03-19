package org.jacaranda.ies.web.rest;

import org.jacaranda.ies.ManagerCareApp;
import org.jacaranda.ies.domain.Tipo;
import org.jacaranda.ies.repository.TipoRepository;
import org.jacaranda.ies.service.TipoService;

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
 * Integration tests for the {@link TipoResource} REST controller.
 */
@SpringBootTest(classes = ManagerCareApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class TipoResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    @Autowired
    private TipoRepository tipoRepository;

    @Autowired
    private TipoService tipoService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTipoMockMvc;

    private Tipo tipo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tipo createEntity(EntityManager em) {
        Tipo tipo = new Tipo()
            .nombre(DEFAULT_NOMBRE);
        return tipo;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tipo createUpdatedEntity(EntityManager em) {
        Tipo tipo = new Tipo()
            .nombre(UPDATED_NOMBRE);
        return tipo;
    }

    @BeforeEach
    public void initTest() {
        tipo = createEntity(em);
    }

    @Test
    @Transactional
    public void createTipo() throws Exception {
        int databaseSizeBeforeCreate = tipoRepository.findAll().size();

        // Create the Tipo
        restTipoMockMvc.perform(post("/api/tipos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tipo)))
            .andExpect(status().isCreated());

        // Validate the Tipo in the database
        List<Tipo> tipoList = tipoRepository.findAll();
        assertThat(tipoList).hasSize(databaseSizeBeforeCreate + 1);
        Tipo testTipo = tipoList.get(tipoList.size() - 1);
        assertThat(testTipo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
    }

    @Test
    @Transactional
    public void createTipoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tipoRepository.findAll().size();

        // Create the Tipo with an existing ID
        tipo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipoMockMvc.perform(post("/api/tipos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tipo)))
            .andExpect(status().isBadRequest());

        // Validate the Tipo in the database
        List<Tipo> tipoList = tipoRepository.findAll();
        assertThat(tipoList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllTipos() throws Exception {
        // Initialize the database
        tipoRepository.saveAndFlush(tipo);

        // Get all the tipoList
        restTipoMockMvc.perform(get("/api/tipos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)));
    }
    
    @Test
    @Transactional
    public void getTipo() throws Exception {
        // Initialize the database
        tipoRepository.saveAndFlush(tipo);

        // Get the tipo
        restTipoMockMvc.perform(get("/api/tipos/{id}", tipo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tipo.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE));
    }

    @Test
    @Transactional
    public void getNonExistingTipo() throws Exception {
        // Get the tipo
        restTipoMockMvc.perform(get("/api/tipos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTipo() throws Exception {
        // Initialize the database
        tipoService.save(tipo);

        int databaseSizeBeforeUpdate = tipoRepository.findAll().size();

        // Update the tipo
        Tipo updatedTipo = tipoRepository.findById(tipo.getId()).get();
        // Disconnect from session so that the updates on updatedTipo are not directly saved in db
        em.detach(updatedTipo);
        updatedTipo
            .nombre(UPDATED_NOMBRE);

        restTipoMockMvc.perform(put("/api/tipos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTipo)))
            .andExpect(status().isOk());

        // Validate the Tipo in the database
        List<Tipo> tipoList = tipoRepository.findAll();
        assertThat(tipoList).hasSize(databaseSizeBeforeUpdate);
        Tipo testTipo = tipoList.get(tipoList.size() - 1);
        assertThat(testTipo.getNombre()).isEqualTo(UPDATED_NOMBRE);
    }

    @Test
    @Transactional
    public void updateNonExistingTipo() throws Exception {
        int databaseSizeBeforeUpdate = tipoRepository.findAll().size();

        // Create the Tipo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTipoMockMvc.perform(put("/api/tipos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tipo)))
            .andExpect(status().isBadRequest());

        // Validate the Tipo in the database
        List<Tipo> tipoList = tipoRepository.findAll();
        assertThat(tipoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTipo() throws Exception {
        // Initialize the database
        tipoService.save(tipo);

        int databaseSizeBeforeDelete = tipoRepository.findAll().size();

        // Delete the tipo
        restTipoMockMvc.perform(delete("/api/tipos/{id}", tipo.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tipo> tipoList = tipoRepository.findAll();
        assertThat(tipoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
