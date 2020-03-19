package org.jacaranda.ies;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("org.jacaranda.ies");

        noClasses()
            .that()
                .resideInAnyPackage("org.jacaranda.ies.service..")
            .or()
                .resideInAnyPackage("org.jacaranda.ies.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..org.jacaranda.ies.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
