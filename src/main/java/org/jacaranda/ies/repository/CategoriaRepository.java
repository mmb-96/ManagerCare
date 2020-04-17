package org.jacaranda.ies.repository;

import java.util.List;
import java.util.Optional;

import org.jacaranda.ies.domain.Categoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Categoria entity.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    @Query(value = "select distinct categoria from Categoria categoria left join fetch categoria.objetivos",
        countQuery = "select count(distinct categoria) from Categoria categoria")
    Page<Categoria> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct categoria from Categoria categoria left join fetch categoria.objetivos")
    List<Categoria> findAllWithEagerRelationships();

    @Query("select categoria from Categoria categoria left join fetch categoria.objetivos where categoria.id =:id")
    Optional<Categoria> findOneWithEagerRelationships(@Param("id") Long id);
    
	/**
	 * Metodo que obtiene las categorias padre de la categoria del usuario.
	 * 
	 */
    @Query("select cat from CategoriaAsc catAsc join catAsc.idPadre cat where catAsc.idHijo = (Select eu.categoria from UserExtra eu where eu.user.login = ?#{principal.username})")
    List<Categoria> findByCategoria();
}
