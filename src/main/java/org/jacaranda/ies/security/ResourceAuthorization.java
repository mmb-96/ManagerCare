package org.jacaranda.ies.security;

import org.jacaranda.ies.domain.ObjetivosConseguidos;
import org.jacaranda.ies.domain.PuntosConseguidos;
import org.jacaranda.ies.domain.User;
import org.jacaranda.ies.domain.UserExtra;
import org.jacaranda.ies.repository.ObjetivosConseguidosRepository;
import org.jacaranda.ies.repository.PuntosConseguidosRepository;
import org.jacaranda.ies.repository.UserExtraRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Centralizes ownership checks for employee data exposed by REST resources.
 */
@Component("resourceAuthorization")
@Transactional(readOnly = true)
public class ResourceAuthorization {

    private final UserExtraRepository userExtraRepository;
    private final PuntosConseguidosRepository puntosConseguidosRepository;
    private final ObjetivosConseguidosRepository objetivosConseguidosRepository;

    public ResourceAuthorization(
        UserExtraRepository userExtraRepository,
        PuntosConseguidosRepository puntosConseguidosRepository,
        ObjetivosConseguidosRepository objetivosConseguidosRepository
    ) {
        this.userExtraRepository = userExtraRepository;
        this.puntosConseguidosRepository = puntosConseguidosRepository;
        this.objetivosConseguidosRepository = objetivosConseguidosRepository;
    }

    public boolean canAccessUser(String login) {
        if (isAdmin()) {
            return true;
        }
        if (!hasText(login)) {
            return false;
        }
        return currentLogin()
            .map(current -> current.equalsIgnoreCase(login) || userExtraRepository.existsByUserLoginAndIdResponsableLogin(login, current))
            .orElse(false);
    }

    public boolean canAccessUserExtra(Long id) {
        if (isAdmin()) {
            return true;
        }
        return userExtraRepository.findById(id).map(extra -> canAccessOwner(extra.getUser())).orElse(false);
    }

    public boolean canAccessPuntosConseguidos(Long id) {
        if (isAdmin()) {
            return true;
        }
        return puntosConseguidosRepository.findById(id).map(puntos -> canAccessOwner(puntos.getUser())).orElse(false);
    }

    public boolean canAccessObjetivosConseguidos(Long id) {
        if (isAdmin()) {
            return true;
        }
        return objetivosConseguidosRepository.findById(id).map(objetivo -> canAccessOwner(objetivo.getUser())).orElse(false);
    }

    public boolean canListTeamMembers() {
        return isAdmin() || currentLogin().map(userExtraRepository::existsByIdResponsableLogin).orElse(false);
    }

    public boolean isAuthenticated() {
        return SecurityUtils.isAuthenticated();
    }

    public List<UserExtra> accessibleUserExtras() {
        if (isAdmin()) {
            return userExtraRepository.findAll();
        }
        return currentLogin().map(this::accessibleUserExtras).orElseGet(java.util.Collections::emptyList);
    }

    public List<PuntosConseguidos> accessiblePuntosConseguidos() {
        if (isAdmin()) {
            return puntosConseguidosRepository.findAll();
        }
        return currentLogin().map(this::visibleLogins)
            .map(puntosConseguidosRepository::findByUserLoginIn)
            .orElseGet(java.util.Collections::emptyList);
    }

    public List<ObjetivosConseguidos> accessibleObjetivosConseguidos() {
        if (isAdmin()) {
            return objetivosConseguidosRepository.findAll();
        }
        return currentLogin().map(this::visibleLogins)
            .map(objetivosConseguidosRepository::findByUserLoginIn)
            .orElseGet(java.util.Collections::emptyList);
    }

    private List<UserExtra> accessibleUserExtras(String login) {
        LinkedHashSet<UserExtra> result = new LinkedHashSet<>(userExtraRepository.findByUserLogin(login));
        result.addAll(userExtraRepository.findByIdResponsableLogin(login));
        return result.stream().filter(extra -> canAccessOwner(extra.getUser())).collect(Collectors.toList());
    }

    private Collection<String> visibleLogins(String login) {
        LinkedHashSet<String> result = new LinkedHashSet<>();
        result.add(login);
        userExtraRepository.findByIdResponsableLogin(login).stream()
            .map(UserExtra::getUser)
            .filter(java.util.Objects::nonNull)
            .map(user -> user.getLogin())
            .filter(this::hasText)
            .forEach(result::add);
        return result;
    }

    private boolean canAccessOwner(User owner) {
        return Optional.ofNullable(owner)
            .map(User::getLogin)
            .filter(this::hasText)
            .map(this::canAccessUser)
            .orElse(false);
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private boolean isAdmin() {
        return SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN);
    }

    private Optional<String> currentLogin() {
        return SecurityUtils.getCurrentUserLogin();
    }
}
