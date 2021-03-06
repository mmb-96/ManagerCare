package org.jacaranda.ies.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * Entidad Categoria Asc\n@author Manuel Melero.
 */
@ApiModel(description = "Entidad Categoria Asc\n@author Manuel Melero.")
@Entity
@Table(name = "categoria_asc")
public class CategoriaAsc implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * Relacion entre categoria y Categoria Asc.
     */
    @ApiModelProperty(value = "Relacion entre categoria y Categoria Asc.")
    @ManyToOne
    @JsonIgnoreProperties("categoriaAscs")
    private Categoria idHijo;

    /**
     * Relacion entre categoria y Categoria Asc.
     */
    @ApiModelProperty(value = "Relacion entre categoria y Categoria Asc.")
    @ManyToOne
    @JsonIgnoreProperties("categoriaAscs")
    private Categoria idPadre;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Categoria getIdHijo() {
        return idHijo;
    }

    public CategoriaAsc idHijo(Categoria categoria) {
        this.idHijo = categoria;
        return this;
    }

    public void setIdHijo(Categoria categoria) {
        this.idHijo = categoria;
    }

    public Categoria getIdPadre() {
        return idPadre;
    }

    public CategoriaAsc idPadre(Categoria categoria) {
        this.idPadre = categoria;
        return this;
    }

    public void setIdPadre(Categoria categoria) {
        this.idPadre = categoria;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CategoriaAsc)) {
            return false;
        }
        return id != null && id.equals(((CategoriaAsc) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "CategoriaAsc{" +
            "id=" + getId() +
            "}";
    }
}
