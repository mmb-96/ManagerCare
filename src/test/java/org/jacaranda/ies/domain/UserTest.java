package org.jacaranda.ies.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class UserTest {

    @Test
    void toStringExcludesSensitiveFields() {
        User user = new User();
        user.setId(42L);
        user.setLogin("technical-login");
        user.setFirstName("sensitive-first-name");
        user.setLastName("sensitive-last-name");
        user.setEmail("sensitive@example.test");
        user.setImageUrl("https://example.test/sensitive-image");
        user.setPassword("sensitive-password-hash");
        user.setActivationKey("sensitive-activation-key");
        user.setResetKey("sensitive-reset-key");
        user.setActivated(true);
        user.setLangKey("es");

        String value = user.toString();

        assertThat(value).contains("id=42", "technical-login", "activated='true'", "langKey='es'");
        assertThat(value).doesNotContain(
            "sensitive-first-name",
            "sensitive-last-name",
            "sensitive@example.test",
            "sensitive-image",
            "sensitive-password-hash",
            "sensitive-activation-key",
            "sensitive-reset-key"
        );
    }
}
