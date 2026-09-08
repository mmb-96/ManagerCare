package org.jacaranda.ies.config;

import javax.annotation.PostConstruct;

import io.github.jhipster.config.JHipsterProperties;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.util.StringUtils;

/**
 * Rejects incomplete external production configuration before the application serves requests.
 */
@Configuration
@Profile("prod")
public class ProductionSecretsConfiguration {

    private final JHipsterProperties jHipsterProperties;
    private final MailProperties mailProperties;
    private final boolean mailEnabled;

    public ProductionSecretsConfiguration(JHipsterProperties jHipsterProperties, MailProperties mailProperties,
            @Value("${managercare.mail.enabled:false}") boolean mailEnabled) {
        this.jHipsterProperties = jHipsterProperties;
        this.mailProperties = mailProperties;
        this.mailEnabled = mailEnabled;
    }

    @PostConstruct
    public void validateProductionSecrets() {
        validate(jHipsterProperties, mailProperties, mailEnabled);
    }

    static void validate(JHipsterProperties jHipsterProperties, MailProperties mailProperties, boolean mailEnabled) {
        String legacySecret = jHipsterProperties.getSecurity().getAuthentication().getJwt().getSecret();
        String base64Secret = jHipsterProperties.getSecurity().getAuthentication().getJwt().getBase64Secret();
        if (StringUtils.hasText(legacySecret)) {
            throw new IllegalStateException("Production JWT must use JHIPSTER_SECURITY_AUTHENTICATION_JWT_BASE64_SECRET");
        }
        if (!StringUtils.hasText(base64Secret)) {
            throw new IllegalStateException("Missing required production JWT variable: JHIPSTER_SECURITY_AUTHENTICATION_JWT_BASE64_SECRET");
        }
        try {
            if (Decoders.BASE64.decode(base64Secret).length < 64) {
                throw new IllegalStateException("Production JWT Base64 secret must decode to at least 64 bytes");
            }
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("Production JWT variable must be valid Base64", ex);
        }

        if (mailEnabled && (!StringUtils.hasText(mailProperties.getHost()) || mailProperties.getPort() == null
                || !StringUtils.hasText(mailProperties.getUsername()) || !StringUtils.hasText(mailProperties.getPassword()))) {
            throw new IllegalStateException("Enabled production mail requires SPRING_MAIL_HOST, SPRING_MAIL_PORT, "
                + "SPRING_MAIL_USERNAME, and SPRING_MAIL_PASSWORD");
        }
    }
}
