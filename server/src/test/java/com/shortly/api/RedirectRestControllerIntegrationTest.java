package com.shortly.api;

import com.shortly.api.model.ShortLink;
import com.shortly.api.repository.ShortLinkRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = ApiApplication.class)
@AutoConfigureMockMvc
@EnableAutoConfiguration(exclude= SecurityAutoConfiguration.class)
@AutoConfigureTestDatabase
public class RedirectRestControllerIntegrationTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ShortLinkRepository repository;

    @AfterEach
    public void resetDb() {
        repository.deleteAll();
    }

    @Test
    void givenValidFragment_thenRedirect() throws Exception {
        ShortLink facebook = createTestShortLink(1L, "facebook", "https://www.facebook.com/", "ML5HPi");

        // @formatter:off
        mvc.perform(get("/ML5HPi"))
                .andDo(print())
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl(facebook.getLongUrl()));
    }

    @Test
    void givenInvalidFragment_thenReturnNotFoundError() throws Exception {
        createTestShortLink(1L, "facebook", "https://www.facebook.com/", "ML5HPi");

        // @formatter:off
        mvc.perform(get("/notafragment"))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    private ShortLink createTestShortLink(long id, String title, String longUrl, String fragment) {
        ShortLink link = new ShortLink();
        link.setId(id);
        link.setTitle(title);
        link.setLongUrl(longUrl);
        link.setFragment(fragment);
        return repository.saveAndFlush(link);
    }
}
