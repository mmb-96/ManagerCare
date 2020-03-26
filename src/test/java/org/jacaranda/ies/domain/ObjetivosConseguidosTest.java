package org.jacaranda.ies.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import org.jacaranda.ies.web.rest.TestUtil;

public class ObjetivosConseguidosTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ObjetivosConseguidos.class);
        ObjetivosConseguidos objetivosConseguidos1 = new ObjetivosConseguidos();
        objetivosConseguidos1.setId(1L);
        ObjetivosConseguidos objetivosConseguidos2 = new ObjetivosConseguidos();
        objetivosConseguidos2.setId(objetivosConseguidos1.getId());
        assertThat(objetivosConseguidos1).isEqualTo(objetivosConseguidos2);
        objetivosConseguidos2.setId(2L);
        assertThat(objetivosConseguidos1).isNotEqualTo(objetivosConseguidos2);
        objetivosConseguidos1.setId(null);
        assertThat(objetivosConseguidos1).isNotEqualTo(objetivosConseguidos2);
    }
}
