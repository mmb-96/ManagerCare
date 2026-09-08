package org.jacaranda.ies.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Scanner;
import java.util.stream.Stream;

import io.github.jhipster.config.JHipsterProperties;
import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.mail.MailProperties;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatIllegalStateException;

class SecurityConfigurationFilesTest {

    private static final Path PROJECT_ROOT = Paths.get("").toAbsolutePath();

    @Test
    void testConfigurationUsesSyntheticJwtKey() throws IOException {
        String testConfiguration = projectFile("src/test/resources/config/application.yml");

        assertThat(testConfiguration).contains("Fixed, synthetic key used exclusively by automated tests.");
        assertThat(testConfiguration).contains("TUMwMV9NQzAyX1RFU1RfT05MWV9K");
    }

    @Test
    void productionConfigurationUsesOnlyAnExternalJwtVariable() throws IOException {
        String productionConfiguration = projectFile("src/main/resources/config/application-prod.yml");

        assertThat(productionConfiguration).contains("${JHIPSTER_SECURITY_AUTHENTICATION_JWT_BASE64_SECRET:}");
        assertThat(productionConfiguration).doesNotMatch("(?s).*base64-secret:\\s*(?!\\$\\{)[^\\s#]+.*");
        assertThat(productionConfiguration).doesNotContain("jwt:\n        secret:");
    }

    @Test
    void productionConfigurationContainsNoVersionedSmtpCredentials() throws IOException {
        String productionConfiguration = projectFile("src/main/resources/config/application-prod.yml");

        assertThat(productionConfiguration).contains("host: ${SPRING_MAIL_HOST:}");
        assertThat(productionConfiguration).contains("username: ${SPRING_MAIL_USERNAME:}");
        assertThat(productionConfiguration).contains("password: ${SPRING_MAIL_PASSWORD:}");
        assertThat(productionConfiguration).doesNotContain("smtp." + "gmail.com");
    }

    @Test
    void missingProductionJwtProducesControlledError() {
        assertThatIllegalStateException().isThrownBy(() ->
            ProductionSecretsConfiguration.validate(new JHipsterProperties(), new MailProperties(), false))
            .withMessageContaining("Missing required production JWT variable");
    }

    @Test
    void testProfileDoesNotUseGmail() throws IOException {
        String testConfiguration = projectFile("src/test/resources/config/application.yml");

        assertThat(testConfiguration).contains("host: localhost");
        assertThat(testConfiguration).doesNotContain("smtp." + "gmail.com");
    }

    @Test
    void removedSecretsDoNotReappearInVersionedConfiguration() throws IOException {
        try (Stream<Path> files = versionedConfigurationFiles()) {
            boolean unsafeConfigurationFound = files
                .map(this::read)
                .anyMatch(content -> content.contains("smtp." + "gmail.com")
                    || content.contains("jwtSecret" + "Key")
                    || content.matches("(?s).*jwt:\\s*\\n\\s*secret:\\s*\\S+.*"));

            assertThat(unsafeConfigurationFound).isFalse();
        }
    }

    private String projectFile(String relativePath) throws IOException {
        return new String(Files.readAllBytes(PROJECT_ROOT.resolve(relativePath)), StandardCharsets.UTF_8);
    }

    private String read(Path path) {
        try {
            return new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
        } catch (IOException ex) {
            throw new IllegalStateException("Cannot read configuration file " + path, ex);
        }
    }

    private Stream<Path> versionedConfigurationFiles() throws IOException {
        Process process = new ProcessBuilder("git", "ls-files", "-z").directory(PROJECT_ROOT.toFile()).start();
        String files;
        try (Scanner scanner = new Scanner(process.getInputStream(), StandardCharsets.UTF_8.name()).useDelimiter("\\A")) {
            files = scanner.hasNext() ? scanner.next() : "";
        }
        try {
            if (process.waitFor() != 0) {
                throw new IllegalStateException("Cannot list versioned files for the security scan");
            }
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted while listing versioned files for the security scan", ex);
        }
        return Arrays.stream(files.split("\u0000"))
            .filter(path -> path.endsWith(".yml") || path.endsWith(".yo-rc.json"))
            .map(PROJECT_ROOT::resolve);
    }
}
