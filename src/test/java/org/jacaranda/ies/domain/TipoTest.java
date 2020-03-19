package org.jacaranda.ies.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import org.jacaranda.ies.web.rest.TestUtil;

public class TipoTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tipo.class);
        Tipo tipo1 = new Tipo();
        tipo1.setId(1L);
        Tipo tipo2 = new Tipo();
        tipo2.setId(tipo1.getId());
        assertThat(tipo1).isEqualTo(tipo2);
        tipo2.setId(2L);
        assertThat(tipo1).isNotEqualTo(tipo2);
        tipo1.setId(null);
        assertThat(tipo1).isNotEqualTo(tipo2);
    }
}
