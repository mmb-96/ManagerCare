package org.jacaranda.ies.config;

import org.jacaranda.ies.ManagerCareApp;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = ManagerCareApp.class)
@Transactional
class PasswordEncoderConfigurationIT {

    @Autowired
    private List<PasswordEncoder> passwordEncoders;

    @Test
    void registersTheHistoricalBcryptPasswordEncoder() {
        assertThat(passwordEncoders).hasSize(1);
        PasswordEncoder passwordEncoder = passwordEncoders.get(0);
        String encoded = passwordEncoder.encode("synthetic-password");

        assertThat(passwordEncoder).isInstanceOf(BCryptPasswordEncoder.class);
        assertThat(encoded).startsWith("$2");
        assertThat(passwordEncoder.matches("synthetic-password", encoded)).isTrue();
    }
}
