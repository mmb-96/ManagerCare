package org.jacaranda.ies.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import org.jacaranda.ies.web.rest.TestUtil;

public class PuntosConseguidosTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PuntosConseguidos.class);
        PuntosConseguidos puntosConseguidos1 = new PuntosConseguidos();
        puntosConseguidos1.setId(1L);
        PuntosConseguidos puntosConseguidos2 = new PuntosConseguidos();
        puntosConseguidos2.setId(puntosConseguidos1.getId());
        assertThat(puntosConseguidos1).isEqualTo(puntosConseguidos2);
        puntosConseguidos2.setId(2L);
        assertThat(puntosConseguidos1).isNotEqualTo(puntosConseguidos2);
        puntosConseguidos1.setId(null);
        assertThat(puntosConseguidos1).isNotEqualTo(puntosConseguidos2);
    }
}
