package org.jacaranda.ies.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad Categoria\n@author Manuel Melero.
 */
@ApiModel(description = "Entidad Categoria\n@author Manuel Melero.")
@Entity
@Table(name = "categoria")
public class Categoria implements Serializable {

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
    @Column(name = "descripcion")
    private String descripcion;

    /**
     * Relacion entre categoria y objetivos.
     */
    @ApiModelProperty(value = "Relacion entre categoria y objetivos.")
    @ManyToMany
    @JoinTable(name = "categoria_objetivo",
               joinColumns = @JoinColumn(name = "categoria_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "objetivo_id", referencedColumnName = "id"))
    private Set<Objetivo> objetivos = new HashSet<>();

    /**
     * Relacion entre categoria y usuarios.
     */
    @ApiModelProperty(value = "Relacion entre categoria y usuarios.")
    @ManyToMany
    @JoinTable(name = "categoria_user",
               joinColumns = @JoinColumn(name = "categoria_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"))
    private Set<User> users = new HashSet<>();

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

    public Categoria nombre(String nombre) {
        this.nombre = nombre;
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public Categoria descripcion(String descripcion) {
        this.descripcion = descripcion;
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Set<Objetivo> getObjetivos() {
        return objetivos;
    }

    public Categoria objetivos(Set<Objetivo> objetivos) {
        this.objetivos = objetivos;
        return this;
    }

    public Categoria addObjetivo(Objetivo objetivo) {
        this.objetivos.add(objetivo);
        objetivo.getCategorias().add(this);
        return this;
    }

    public Categoria removeObjetivo(Objetivo objetivo) {
        this.objetivos.remove(objetivo);
        objetivo.getCategorias().remove(this);
        return this;
    }

    public void setObjetivos(Set<Objetivo> objetivos) {
        this.objetivos = objetivos;
    }

    public Set<User> getUsers() {
        return users;
    }

    public Categoria users(Set<User> users) {
        this.users = users;
        return this;
    }

    public Categoria addUser(User user) {
        this.users.add(user);
        return this;
    }

    public Categoria removeUser(User user) {
        this.users.remove(user);
        return this;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Categoria)) {
            return false;
        }
        return id != null && id.equals(((Categoria) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Categoria{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
