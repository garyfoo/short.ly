package com.shortly.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.shortly.api.model.ShortLink;
import com.shortly.api.model.dto.ShortLinkDTO;
import com.shortly.api.repository.ShortLinkRepository;
import com.shortly.api.util.RandomStringGenerator;
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

import java.io.IOException;
import java.util.List;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = ApiApplication.class)
@AutoConfigureMockMvc
@EnableAutoConfiguration(exclude= SecurityAutoConfiguration.class)
@AutoConfigureTestDatabase
public class LinkRestIntegrationControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ShortLinkRepository repository;

    @AfterEach
    public void resetDb() {
        repository.deleteAll();
    }

    @Test
    void givenLinks_whenGetLinks_thenStatus200() throws Exception {
        createTestShortLink(1L, "facebook", "https://www.facebook.com/");
        createTestShortLink(2L,"instagram", "https://www.instagram.com/");
        // @formatter:off
        mvc.perform(get("/api/links").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$[0].title", is("facebook")))
                .andExpect(jsonPath("$[1].title", is("instagram")));
        // @formatter:on
    }

    @Test
    void whenValidInput_thenCreateShortLink() throws IOException, Exception {
        ShortLink tikTokLink = createTestShortLink(4L,"tik-tok", "https://www.tik-tok.com/");
        mvc.perform(post("/api/links").contentType(MediaType.APPLICATION_JSON).content(JsonUtil.toJson(tikTokLink)));

        List<ShortLink> found = repository.findAll();
        assertThat(found).extracting(ShortLink::getTitle).contains("tik-tok");
    }

    @Test
    void whenValidLink_thenUpdateLink() throws Exception {
        System.out.println(repository.findAll());
        createTestShortLink(2L, "facebook", "https://www.facebook.com/");
        ShortLinkDTO shortLinkDTO = new ShortLinkDTO();
        shortLinkDTO.setId(2L);
        shortLinkDTO.setTitle("facebook title test");
        shortLinkDTO.setLongUrl("https://www.facebooker.com/");

        System.out.println(repository.findAll());

        // @formatter:off
        mvc.perform(put("/api/links/2").contentType(MediaType.APPLICATION_JSON).content(JsonUtil.toJson(shortLinkDTO)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("title", is("facebook title test")))
                .andExpect(jsonPath("long_url", is("https://www.facebooker.com/")));
    }

    @Test
    void whenInvalidLink_throwBadRequest() throws Exception {
        createTestShortLink(2L, "facebook", "https://www.facebook.com/");
        ShortLinkDTO shortLinkDTO = new ShortLinkDTO();
        shortLinkDTO.setTitle("facebook title test");
        shortLinkDTO.setLongUrl("notalink");

        // @formatter:off
        mvc.perform(put("/api/links/2").contentType(MediaType.APPLICATION_JSON).content(JsonUtil.toJson(shortLinkDTO)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenValidLink_deleteSuccess() throws Exception {
        createTestShortLink(1L, "facebook", "https://www.facebook.com/");

        // @formatter:off
        mvc.perform(delete("/api/links/1").contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk());
    }

    private ShortLink createTestShortLink(long id, String title, String longUrl) {
        RandomStringGenerator randomStringGenerator = new RandomStringGenerator(6);
        ShortLink link = new ShortLink();
        link.setId(id);
        link.setTitle(title);
        link.setLongUrl(longUrl);
        link.setFragment(randomStringGenerator.generate());
        return repository.saveAndFlush(link);
    }
}
