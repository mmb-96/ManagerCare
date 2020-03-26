package org.jacaranda.ies.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

/**
 * Entidad Objetivos conseguidos\n@author Manuel Melero.
 */
@ApiModel(description = "Entidad Objetivos conseguidos\n@author Manuel Melero.")
@Entity
@Table(name = "objetivos_conseguidos")
public class ObjetivosConseguidos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * Atributo estado.
     */
    @ApiModelProperty(value = "Atributo estado.")
    @Column(name = "estado")
    private Boolean estado;

    /**
     * Atributo anyos.
     */
    @ApiModelProperty(value = "Atributo anyos.")
    @Column(name = "fecha_apertura")
    private ZonedDateTime fechaApertura;

    /**
     * Atributo fecha cierre.
     */
    @ApiModelProperty(value = "Atributo fecha cierre.")
    @Column(name = "fecha_cierre")
    private ZonedDateTime fechaCierre;

    /**
     * Relacion entre objetivos conseguidos y usuarios.
     */
    @ApiModelProperty(value = "Relacion entre objetivos conseguidos y usuarios.")
    @ManyToOne
    @JsonIgnoreProperties("objetivosConseguidos")
    private User user;

    /**
     * Relacion entre objetivos conseguidos y usuarios.
     */
    @ApiModelProperty(value = "Relacion entre objetivos conseguidos y usuarios.")
    @ManyToOne
    @JsonIgnoreProperties("objetivosConseguidos")
    private Objetivo objetivo;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isEstado() {
        return estado;
    }

    public ObjetivosConseguidos estado(Boolean estado) {
        this.estado = estado;
        return this;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public ZonedDateTime getFechaApertura() {
        return fechaApertura;
    }

    public ObjetivosConseguidos fechaApertura(ZonedDateTime fechaApertura) {
        this.fechaApertura = fechaApertura;
        return this;
    }

    public void setFechaApertura(ZonedDateTime fechaApertura) {
        this.fechaApertura = fechaApertura;
    }

    public ZonedDateTime getFechaCierre() {
        return fechaCierre;
    }

    public ObjetivosConseguidos fechaCierre(ZonedDateTime fechaCierre) {
        this.fechaCierre = fechaCierre;
        return this;
    }

    public void setFechaCierre(ZonedDateTime fechaCierre) {
        this.fechaCierre = fechaCierre;
    }

    public User getUser() {
        return user;
    }

    public ObjetivosConseguidos user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Objetivo getObjetivo() {
        return objetivo;
    }

    public ObjetivosConseguidos objetivo(Objetivo objetivo) {
        this.objetivo = objetivo;
        return this;
    }

    public void setObjetivo(Objetivo objetivo) {
        this.objetivo = objetivo;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ObjetivosConseguidos)) {
            return false;
        }
        return id != null && id.equals(((ObjetivosConseguidos) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ObjetivosConseguidos{" +
            "id=" + getId() +
            ", estado='" + isEstado() + "'" +
            ", fechaApertura='" + getFechaApertura() + "'" +
            ", fechaCierre='" + getFechaCierre() + "'" +
            "}";
    }
}
