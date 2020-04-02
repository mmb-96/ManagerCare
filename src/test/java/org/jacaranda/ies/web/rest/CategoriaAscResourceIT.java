package org.jacaranda.ies.web.rest;

import org.jacaranda.ies.ManagerCareApp;
import org.jacaranda.ies.domain.CategoriaAsc;
import org.jacaranda.ies.repository.CategoriaAscRepository;
import org.jacaranda.ies.service.CategoriaAscService;

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
 * Integration tests for the {@link CategoriaAscResource} REST controller.
 */
@SpringBootTest(classes = ManagerCareApp.class)

@AutoConfigureMockMvc
@WithMockUser
public class CategoriaAscResourceIT {

    @Autowired
    private CategoriaAscRepository categoriaAscRepository;

    @Autowired
    private CategoriaAscService categoriaAscService;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCategoriaAscMockMvc;

    private CategoriaAsc categoriaAsc;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CategoriaAsc createEntity(EntityManager em) {
        CategoriaAsc categoriaAsc = new CategoriaAsc();
        return categoriaAsc;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CategoriaAsc createUpdatedEntity(EntityManager em) {
        CategoriaAsc categoriaAsc = new CategoriaAsc();
        return categoriaAsc;
    }

    @BeforeEach
    public void initTest() {
        categoriaAsc = createEntity(em);
    }

    @Test
    @Transactional
    public void createCategoriaAsc() throws Exception {
        int databaseSizeBeforeCreate = categoriaAscRepository.findAll().size();

        // Create the CategoriaAsc
        restCategoriaAscMockMvc.perform(post("/api/categoria-ascs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(categoriaAsc)))
            .andExpect(status().isCreated());

        // Validate the CategoriaAsc in the database
        List<CategoriaAsc> categoriaAscList = categoriaAscRepository.findAll();
        assertThat(categoriaAscList).hasSize(databaseSizeBeforeCreate + 1);
        CategoriaAsc testCategoriaAsc = categoriaAscList.get(categoriaAscList.size() - 1);
    }

    @Test
    @Transactional
    public void createCategoriaAscWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = categoriaAscRepository.findAll().size();

        // Create the CategoriaAsc with an existing ID
        categoriaAsc.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCategoriaAscMockMvc.perform(post("/api/categoria-ascs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(categoriaAsc)))
            .andExpect(status().isBadRequest());

        // Validate the CategoriaAsc in the database
        List<CategoriaAsc> categoriaAscList = categoriaAscRepository.findAll();
        assertThat(categoriaAscList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCategoriaAscs() throws Exception {
        // Initialize the database
        categoriaAscRepository.saveAndFlush(categoriaAsc);

        // Get all the categoriaAscList
        restCategoriaAscMockMvc.perform(get("/api/categoria-ascs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(categoriaAsc.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getCategoriaAsc() throws Exception {
        // Initialize the database
        categoriaAscRepository.saveAndFlush(categoriaAsc);

        // Get the categoriaAsc
        restCategoriaAscMockMvc.perform(get("/api/categoria-ascs/{id}", categoriaAsc.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(categoriaAsc.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingCategoriaAsc() throws Exception {
        // Get the categoriaAsc
        restCategoriaAscMockMvc.perform(get("/api/categoria-ascs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCategoriaAsc() throws Exception {
        // Initialize the database
        categoriaAscService.save(categoriaAsc);

        int databaseSizeBeforeUpdate = categoriaAscRepository.findAll().size();

        // Update the categoriaAsc
        CategoriaAsc updatedCategoriaAsc = categoriaAscRepository.findById(categoriaAsc.getId()).get();
        // Disconnect from session so that the updates on updatedCategoriaAsc are not directly saved in db
        em.detach(updatedCategoriaAsc);

        restCategoriaAscMockMvc.perform(put("/api/categoria-ascs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedCategoriaAsc)))
            .andExpect(status().isOk());

        // Validate the CategoriaAsc in the database
        List<CategoriaAsc> categoriaAscList = categoriaAscRepository.findAll();
        assertThat(categoriaAscList).hasSize(databaseSizeBeforeUpdate);
        CategoriaAsc testCategoriaAsc = categoriaAscList.get(categoriaAscList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingCategoriaAsc() throws Exception {
        int databaseSizeBeforeUpdate = categoriaAscRepository.findAll().size();

        // Create the CategoriaAsc

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCategoriaAscMockMvc.perform(put("/api/categoria-ascs")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(categoriaAsc)))
            .andExpect(status().isBadRequest());

        // Validate the CategoriaAsc in the database
        List<CategoriaAsc> categoriaAscList = categoriaAscRepository.findAll();
        assertThat(categoriaAscList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCategoriaAsc() throws Exception {
        // Initialize the database
        categoriaAscService.save(categoriaAsc);

        int databaseSizeBeforeDelete = categoriaAscRepository.findAll().size();

        // Delete the categoriaAsc
        restCategoriaAscMockMvc.perform(delete("/api/categoria-ascs/{id}", categoriaAsc.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CategoriaAsc> categoriaAscList = categoriaAscRepository.findAll();
        assertThat(categoriaAscList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
