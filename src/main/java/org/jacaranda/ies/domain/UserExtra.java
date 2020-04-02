package org.jacaranda.ies.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * Entidad User Extra\n@author Manuel Melero.
 */
@ApiModel(description = "Entidad User Extra\n@author Manuel Melero.")
@Entity
@Table(name = "user_extra")
public class UserExtra implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * Relacion entre Usuario y Usuario Extra.
     */
    @ApiModelProperty(value = "Relacion entre Usuario y Usuario Extra.")
    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    /**
     * Relacion entre Usuario y Usuario Extra.
     */
    @ApiModelProperty(value = "Relacion entre Usuario y Usuario Extra.")
    @ManyToOne
    @JsonIgnoreProperties("userExtras")
    private User idResponsable;

    /**
     * Relacion entre usuario y categoria.
     */
    @ApiModelProperty(value = "Relacion entre usuario y categoria.")
    @ManyToOne
    @JsonIgnoreProperties("userExtras")
    private Categoria categoria;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public UserExtra user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getIdResponsable() {
        return idResponsable;
    }

    public UserExtra idResponsable(User user) {
        this.idResponsable = user;
        return this;
    }

    public void setIdResponsable(User user) {
        this.idResponsable = user;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public UserExtra categoria(Categoria categoria) {
        this.categoria = categoria;
        return this;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserExtra)) {
            return false;
        }
        return id != null && id.equals(((UserExtra) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "UserExtra{" +
            "id=" + getId() +
            "}";
    }
}
