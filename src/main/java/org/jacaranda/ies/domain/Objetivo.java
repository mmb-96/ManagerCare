package org.jacaranda.ies.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad Objetivo\n@author Manuel Melero.
 */
@ApiModel(description = "Entidad Objetivo\n@author Manuel Melero.")
@Entity
@Table(name = "objetivo")
public class Objetivo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * Atributo nombre.
     */
    @ApiModelProperty(value = "Atributo nombre.")
    @Column(name = "nombre")
    private String nombre;

    /**
     * Atributo descripcion.
     */
    @ApiModelProperty(value = "Atributo descripcion.")
    @Column(name = "descripcion")
    private String descripcion;

    /**
     * Atributo url.
     */
    @ApiModelProperty(value = "Atributo url.")
    @Column(name = "url")
    private String url;

    /**
     * Atributo puntos.
     */
    @ApiModelProperty(value = "Atributo puntos.")
    @Column(name = "puntos")
    private Integer puntos;

    /**
     * Relacion entre objetivos y tipo.
     */
    @ApiModelProperty(value = "Relacion entre objetivos y tipo.")
    @ManyToOne
    @JsonIgnoreProperties("objetivos")
    private Tipo tipo;

    @ManyToMany(mappedBy = "objetivos")
    @JsonIgnore
    private Set<Categoria> categorias = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public Objetivo nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Objetivo descripcion(String descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getUrl() {
        return url;
    }

    public Objetivo url(String url) {
        this.url = url;
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getPuntos() {
        return puntos;
    }

    public Objetivo puntos(Integer puntos) {
        this.puntos = puntos;
        return this;
    }

    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }

    public Tipo getTipo() {
        return tipo;
    }

    public Objetivo tipo(Tipo tipo) {
        this.tipo = tipo;
        return this;
    }

    public void setTipo(Tipo tipo) {
        this.tipo = tipo;
    }

    public Set<Categoria> getCategorias() {
        return categorias;
    }

    public Objetivo categorias(Set<Categoria> categorias) {
        this.categorias = categorias;
        return this;
    }

    public Objetivo addCategoria(Categoria categoria) {
        this.categorias.add(categoria);
        categoria.getObjetivos().add(this);
        return this;
    }

    public Objetivo removeCategoria(Categoria categoria) {
        this.categorias.remove(categoria);
        categoria.getObjetivos().remove(this);
        return this;
    }

    public void setCategorias(Set<Categoria> categorias) {
        this.categorias = categorias;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Objetivo)) {
            return false;
        }
        return id != null && id.equals(((Objetivo) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Objetivo{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            ", url='" + getUrl() + "'" +
            ", puntos=" + getPuntos() +
            "}";
    }
}
