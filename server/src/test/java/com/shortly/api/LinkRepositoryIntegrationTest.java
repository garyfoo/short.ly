package com.shortly.api;

import com.shortly.api.model.ShortLink;
import com.shortly.api.repository.ShortLinkRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(SpringExtension.class)
@DataJpaTest
public class LinkRepositoryIntegrationTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private ShortLinkRepository shortLinkRepository;

    @Test
    void whenFindByFragment_thenReturnLink() {
        ShortLink youtubeLink = new ShortLink("youtube", "ML5HPi", "https://www.youtube.com/");
        entityManager.persistAndFlush(youtubeLink);

        ShortLink found = shortLinkRepository.findByFragment(youtubeLink.getFragment()).orElse(new ShortLink());
        assertThat(found.getFragment()).isEqualTo(youtubeLink.getFragment());
    }

    @Test
    void whenInvalidFragment_thenReturnNull() {
        ShortLink found = shortLinkRepository.findByFragment("does not exist").orElse(null);
        assertThat(found).isNull();
    }

    @Test
    void whenFindById_thenReturnLink() {
        ShortLink facebookLink = new ShortLink("facebook", "7W8R2o", "https://www.facebook.com/");
        entityManager.persistAndFlush(facebookLink);

        ShortLink fromDb = shortLinkRepository.findById(facebookLink.getId()).orElse(new ShortLink());
        assertThat(fromDb.getTitle()).isEqualTo(facebookLink.getTitle());
    }

    @Test
    void whenInvalidId_thenReturnNull() {
        ShortLink fromDb = shortLinkRepository.findById(99L).orElse(null);
        assertThat(fromDb).isNull();
    }

    @Test
    void givenSetOfLinks_whenFindAll_thenReturnAllLinks() {
        ShortLink instagramLink = new ShortLink("instagram", "Dcf8c8", "https://www.instagram.com/");
        ShortLink tikTokLink = new ShortLink("Tik Tok", "HEv7R2", "https://www.tiktok.com/en/");

        entityManager.persist(instagramLink);
        entityManager.persist(tikTokLink);
        entityManager.flush();

        List<ShortLink> allEmployees = shortLinkRepository.findAll();

        assertThat(allEmployees).hasSize(2).extracting(ShortLink::getTitle).containsOnly(instagramLink.getTitle(), tikTokLink.getTitle());
    }

    @Test
    void whenSaveLink_thenLinkAdded() {
        ShortLink facebookLink = new ShortLink("facebook", "7W8R2o", "https://www.facebook.com/");
        ShortLink fromDb = shortLinkRepository.saveAndFlush(facebookLink);
        assertThat(fromDb.getTitle()).isEqualTo(facebookLink.getTitle());
    }

    @Test
    void whenDeleteLink_thenReturnNull() {
        ShortLink facebookLink = new ShortLink("facebook", "7W8R2o", "https://www.facebook.com/");
        entityManager.persistAndFlush(facebookLink);

        shortLinkRepository.delete(facebookLink);
        assertThat(shortLinkRepository.findByFragment("7W8R2o").orElse(null)).isNull();
    }

}
