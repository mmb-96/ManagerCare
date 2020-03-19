package org.jacaranda.ies.repository;

import org.jacaranda.ies.domain.Categoria;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Categoria entity.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    @Query(value = "select distinct categoria from Categoria categoria left join fetch categoria.objetivos left join fetch categoria.users",
        countQuery = "select count(distinct categoria) from Categoria categoria")
    Page<Categoria> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct categoria from Categoria categoria left join fetch categoria.objetivos left join fetch categoria.users")
    List<Categoria> findAllWithEagerRelationships();

    @Query("select categoria from Categoria categoria left join fetch categoria.objetivos left join fetch categoria.users where categoria.id =:id")
    Optional<Categoria> findOneWithEagerRelationships(@Param("id") Long id);
}
