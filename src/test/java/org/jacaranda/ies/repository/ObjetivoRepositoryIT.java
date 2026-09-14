package org.jacaranda.ies.repository;

import org.jacaranda.ies.ManagerCareApp;
import org.jacaranda.ies.domain.Categoria;
import org.jacaranda.ies.domain.Objetivo;
import org.jacaranda.ies.domain.User;
import org.jacaranda.ies.domain.UserExtra;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = ManagerCareApp.class)
@Transactional
class ObjetivoRepositoryIT {

    @Autowired
    private ObjetivoRepository objetivoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @WithMockUser(username = "objetivo-category-a")
    void findObjetivoUserReturnsOnlyObjectivesForTheCurrentUsersCategory() {
        Categoria categoryA = new Categoria().nombre("category-a");
        Categoria categoryB = new Categoria().nombre("category-b");
        em.persist(categoryA);
        em.persist(categoryB);

        Objetivo objectiveA = new Objetivo().nombre("objective-a");
        Objetivo objectiveB = new Objetivo().nombre("objective-b");
        categoryA.addObjetivo(objectiveA);
        categoryB.addObjetivo(objectiveB);
        em.persist(objectiveA);
        em.persist(objectiveB);

        User userA = new User();
        userA.setLogin("objetivo-category-a");
        userA.setPassword(passwordEncoder.encode("synthetic-password"));
        userA.setActivated(true);
        em.persist(userA);
        em.persist(new UserExtra().user(userA).categoria(categoryA));

        User userB = new User();
        userB.setLogin("objetivo-category-b");
        userB.setPassword(passwordEncoder.encode("synthetic-password"));
        userB.setActivated(true);
        em.persist(userB);
        em.persist(new UserExtra().user(userB).categoria(categoryB));
        em.flush();
        em.clear();

        List<Objetivo> objectives = objetivoRepository.findObjetivoUser();

        assertThat(objectives).extracting(Objetivo::getNombre).containsExactly("objective-a");
    }
}
