package org.jacaranda.ies.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

/**
 * Entidad Puntos conseguidos\n@author Manuel Melero.
 */
@ApiModel(description = "Entidad Puntos conseguidos\n@author Manuel Melero.")
@Entity
@Table(name = "puntos_conseguidos", uniqueConstraints = {@UniqueConstraint(columnNames = {"anyos", "user_id"})})
public class PuntosConseguidos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * Atributo puntos.
     */
    @ApiModelProperty(value = "Atributo puntos.")
    @Column(name = "puntos")
    private Integer puntos;

    /**
     * Atributo anyos.
     */
    @ApiModelProperty(value = "Atributo anyos.")
    @Column(name = "anyos")
    private ZonedDateTime anyos;

    /**
     * Relacion entre puntos conseguidos y usuarios.
     */
    @ApiModelProperty(value = "Relacion entre puntos conseguidos y usuarios.")
    @ManyToOne
    @JsonIgnoreProperties("puntosConseguidos")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPuntos() {
        return puntos;
    }

    public PuntosConseguidos puntos(Integer puntos) {
        this.puntos = puntos;
        return this;
    }

    public void setPuntos(Integer puntos) {
        this.puntos = puntos;
    }

    public ZonedDateTime getAnyos() {
        return anyos;
    }

    public PuntosConseguidos anyos(ZonedDateTime anyos) {
        this.anyos = anyos;
        return this;
    }

    public void setAnyos(ZonedDateTime anyos) {
        this.anyos = anyos;
    }

    public User getUser() {
        return user;
    }

    public PuntosConseguidos user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PuntosConseguidos)) {
            return false;
        }
        return id != null && id.equals(((PuntosConseguidos) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "PuntosConseguidos{" +
            "id=" + getId() +
            ", puntos=" + getPuntos() +
            ", anyos='" + getAnyos() + "'" +
            "}";
    }
}
