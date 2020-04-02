package org.jacaranda.ies.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import org.jacaranda.ies.web.rest.TestUtil;

public class CategoriaAscTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CategoriaAsc.class);
        CategoriaAsc categoriaAsc1 = new CategoriaAsc();
        categoriaAsc1.setId(1L);
        CategoriaAsc categoriaAsc2 = new CategoriaAsc();
        categoriaAsc2.setId(categoriaAsc1.getId());
        assertThat(categoriaAsc1).isEqualTo(categoriaAsc2);
        categoriaAsc2.setId(2L);
        assertThat(categoriaAsc1).isNotEqualTo(categoriaAsc2);
        categoriaAsc1.setId(null);
        assertThat(categoriaAsc1).isNotEqualTo(categoriaAsc2);
    }
}
