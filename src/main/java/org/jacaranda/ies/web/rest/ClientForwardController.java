package org.jacaranda.ies.web.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClientForwardController {

    /**
     * Forwards any unmapped paths (except those containing a period) to the client {@code index.html}.
     * @return forward to client {@code index.html}.
     */
    @GetMapping(
        value = {
            "/{path:^(?!api$|management$|swagger$|v2$|webjars$|content$|i18n$|app$)[^.]+$}",
            "/{path:^(?!api$|management$|swagger$|v2$|webjars$|content$|i18n$|app$)[^.]+$}/**"
        }
    )
    public String forward() {
        return "forward:/";
    }
}
