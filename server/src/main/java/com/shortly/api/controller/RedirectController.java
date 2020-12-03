package com.shortly.api.controller;

import com.shortly.api.service.ShortLinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;


@Controller
@RequestMapping("/")
public class RedirectController {

    @Autowired
    private ShortLinkService shortLinkService;

    // https://github.com/eugenp/tutorials/blob/master/spring-mvc-xml/src/main/java/com/baeldung/spring/controller/RequestAndPathVariableValidationController.java
    // Alphanumeric regex only https://stackoverflow.com/questions/388996/regex-for-javascript-to-allow-only-alphanumeric
    @GetMapping("/{fragment}")
    public RedirectView redirect(@PathVariable @Size(max = 10) @Pattern(regexp = "/^[a-z0-9]+$/i") String fragment) {
        String url = shortLinkService.getRedirectUrl(fragment);
        return new RedirectView(url);
    }
}
