package org.bambrikii.security.provider;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RedirectController {
    @RequestMapping(value = "/*/{path:[^.]*}")
    public String redirect() {
        return "forward:/";
    }
}
