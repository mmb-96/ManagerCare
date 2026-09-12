package org.jacaranda.ies.security;

import org.jacaranda.ies.domain.ObjetivosConseguidos;
import org.jacaranda.ies.domain.PuntosConseguidos;
import org.jacaranda.ies.domain.User;
import org.jacaranda.ies.domain.UserExtra;
import org.jacaranda.ies.repository.ObjetivosConseguidosRepository;
import org.jacaranda.ies.repository.PuntosConseguidosRepository;
import org.jacaranda.ies.repository.UserExtraRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class ResourceAuthorizationTest {

    private UserExtraRepository userExtraRepository = mock(UserExtraRepository.class);
    private PuntosConseguidosRepository puntosRepository = mock(PuntosConseguidosRepository.class);
    private ObjetivosConseguidosRepository objetivosRepository = mock(ObjetivosConseguidosRepository.class);
    private ResourceAuthorization authorization = new ResourceAuthorization(userExtraRepository, puntosRepository, objetivosRepository);

    @BeforeEach
    void setUp() {
        when(userExtraRepository.findByUserLogin(anyString())).thenReturn(Collections.emptyList());
        when(userExtraRepository.findByIdResponsableLogin(anyString())).thenReturn(Collections.emptyList());
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void regularUserCannotListUsersOrReadAnotherProfileButCanReadOwnProfile() {
        authenticate("employee", AuthoritiesConstants.USER);

        assertThat(authorization.canListTeamMembers()).isFalse();
        assertThat(authorization.canAccessUser("other")).isFalse();
        assertThat(authorization.canAccessUser("employee")).isTrue();
    }

    @Test
    void responsibleCanReadOnlyAssignedTeamMembers() {
        authenticate("manager", AuthoritiesConstants.USER);
        when(userExtraRepository.existsByUserLoginAndIdResponsableLogin("member", "manager")).thenReturn(true);

        assertThat(authorization.canAccessUser("member")).isTrue();
        assertThat(authorization.canAccessUser("outside-team")).isFalse();
    }

    @Test
    void administratorKeepsAdministrativeAccess() {
        authenticate("admin", AuthoritiesConstants.ADMIN);

        assertThat(authorization.canAccessUser("any-user")).isTrue();
        assertThat(authorization.canAccessUserExtra(123L)).isTrue();
        assertThat(authorization.canAccessPuntosConseguidos(456L)).isTrue();
        assertThat(authorization.canAccessObjetivosConseguidos(789L)).isTrue();
    }

    @Test
    void changingPuntosIdDoesNotBypassOwnership() {
        authenticate("employee", AuthoritiesConstants.USER);
        when(puntosRepository.findById(42L)).thenReturn(Optional.of(puntosFor("other")));

        assertThat(authorization.canAccessPuntosConseguidos(42L)).isFalse();
    }

    @Test
    void changingObjetivosLoginDoesNotBypassTeamRelationship() {
        authenticate("manager", AuthoritiesConstants.USER);
        when(userExtraRepository.existsByUserLoginAndIdResponsableLogin("member", "manager")).thenReturn(true);

        assertThat(authorization.canAccessUser("member")).isTrue();
        assertThat(authorization.canAccessUser("other")).isFalse();
    }

    @Test
    void unauthenticatedOrUnknownResourceIsDeniedWithoutPartialData() {
        assertThat(authorization.isAuthenticated()).isFalse();
        assertThat(authorization.canAccessUser("employee")).isFalse();
        assertThat(authorization.canAccessPuntosConseguidos(404L)).isFalse();
        assertThat(authorization.canAccessObjetivosConseguidos(404L)).isFalse();
    }

    @Test
    void orphanedResourcesAreDeniedToRegularUsersWithoutThrowing() {
        authenticate("employee", AuthoritiesConstants.USER);
        when(userExtraRepository.findById(1L)).thenReturn(Optional.of(new UserExtra()));
        when(puntosRepository.findById(2L)).thenReturn(Optional.of(new PuntosConseguidos()));
        when(objetivosRepository.findById(3L)).thenReturn(Optional.of(new ObjetivosConseguidos()));

        assertThat(authorization.canAccessUserExtra(1L)).isFalse();
        assertThat(authorization.canAccessPuntosConseguidos(2L)).isFalse();
        assertThat(authorization.canAccessObjetivosConseguidos(3L)).isFalse();
    }

    @Test
    void orphanedResourcesAreDeniedToResponsibleUsersWithoutThrowing() {
        authenticate("manager", AuthoritiesConstants.USER);
        when(userExtraRepository.findById(1L)).thenReturn(Optional.of(new UserExtra()));
        when(puntosRepository.findById(2L)).thenReturn(Optional.of(new PuntosConseguidos()));
        when(objetivosRepository.findById(3L)).thenReturn(Optional.of(new ObjetivosConseguidos()));

        assertThat(authorization.canAccessUserExtra(1L)).isFalse();
        assertThat(authorization.canAccessPuntosConseguidos(2L)).isFalse();
        assertThat(authorization.canAccessObjetivosConseguidos(3L)).isFalse();
    }

    @Test
    void incompleteOwnerRelationIsDeniedWithoutThrowing() {
        authenticate("employee", AuthoritiesConstants.USER);
        PuntosConseguidos puntos = new PuntosConseguidos();
        puntos.setUser(new User());
        when(puntosRepository.findById(42L)).thenReturn(Optional.of(puntos));

        assertThat(authorization.canAccessPuntosConseguidos(42L)).isFalse();
        assertThat(authorization.canAccessUser(null)).isFalse();
        assertThat(authorization.canAccessUser("")).isFalse();
        assertThat(authorization.canAccessUser("   ")).isFalse();
    }

    @Test
    void authorizationExpressionParameterNamesAreRetainedInBytecode() throws NoSuchMethodException {
        assertThat(ResourceAuthorization.class.getDeclaredMethod("canAccessUser", String.class).getParameters()[0].isNamePresent()).isTrue();
        assertThat(ResourceAuthorization.class.getDeclaredMethod("canAccessUser", String.class).getParameters()[0].getName()).isEqualTo("login");
        assertThat(ResourceAuthorization.class.getDeclaredMethod("canAccessPuntosConseguidos", Long.class).getParameters()[0].getName()).isEqualTo("id");
    }

    @Test
    void orphanedResourcesAreExcludedFromResponsibleCollections() {
        authenticate("manager", AuthoritiesConstants.USER);
        UserExtra orphan = new UserExtra();
        orphan.setIdResponsable(user("manager"));
        when(userExtraRepository.findByIdResponsableLogin("manager")).thenReturn(Collections.singletonList(orphan));

        assertThat(authorization.accessibleUserExtras()).isEmpty();
        authorization.accessiblePuntosConseguidos();
        authorization.accessibleObjetivosConseguidos();

        verify(puntosRepository).findByUserLoginIn(argThat(logins -> logins.size() == 1 && logins.contains("manager")));
        verify(objetivosRepository).findByUserLoginIn(argThat(logins -> logins.size() == 1 && logins.contains("manager")));
    }

    @Test
    void collectionQueriesAreRestrictedToCurrentUserAndActualTeam() {
        authenticate("manager", AuthoritiesConstants.USER);
        when(userExtraRepository.findByIdResponsableLogin("manager")).thenReturn(Arrays.asList(userExtraFor("member")));

        authorization.accessiblePuntosConseguidos();
        authorization.accessibleObjetivosConseguidos();

        verify(puntosRepository).findByUserLoginIn(argThat(logins -> logins.contains("manager") && logins.contains("member") && logins.size() == 2));
        verify(objetivosRepository).findByUserLoginIn(argThat(logins -> logins.contains("manager") && logins.contains("member") && logins.size() == 2));
        verify(puntosRepository, never()).findAll();
        verify(objetivosRepository, never()).findAll();
    }

    private void authenticate(String login, String authority) {
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(login, "n/a", Collections.singletonList(new SimpleGrantedAuthority(authority)))
        );
    }

    private PuntosConseguidos puntosFor(String login) {
        PuntosConseguidos puntos = new PuntosConseguidos();
        puntos.setUser(user(login));
        return puntos;
    }

    private UserExtra userExtraFor(String login) {
        UserExtra extra = new UserExtra();
        extra.setUser(user(login));
        return extra;
    }

    private User user(String login) {
        User user = new User();
        user.setLogin(login);
        return user;
    }
}
