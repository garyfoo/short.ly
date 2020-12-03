package com.shortly.api;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.shortly.api.exception.ResourceNotFoundException;
import com.shortly.api.model.ShortLink;
import com.shortly.api.repository.ShortLinkRepository;
import com.shortly.api.service.ShortLinkService;
import com.shortly.api.service.impl.ShortLinkServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.internal.verification.VerificationModeFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;


@ExtendWith(SpringExtension.class)
class ShortLinkServiceImplTest {

    @Autowired
    private ShortLinkService shortLinkService;

    @MockBean
    private ShortLinkRepository shortLinkRepository;

    @TestConfiguration
    static class ShortLinkServiceImplTestContextConfiguration {
        @Bean
        ShortLinkService shortLinkService() {
            return new ShortLinkServiceImpl();
        }
    }

    @BeforeEach
    void setUp() {

        ShortLink youtubeLink = new ShortLink(11L, "youtube", "ML5HPi", "https://www.youtube.com/");
        ShortLink facebookLink = new ShortLink(1L, "facebook", "7W8R2o", "https://www.facebook.com/");
        ShortLink instagramLink = new ShortLink(12L, "instagram", "Dcf8c8", "https://www.instagram.com/");
        ShortLink tikTokLink = new ShortLink(13L, "Tik Tok", "HEv7R2", "https://www.tiktok.com/en/");
        ShortLink updatedTikTokLink = new ShortLink(13L, "Tik Tok Cheng", "HEv7R2", "https://www.tiktok.com/en/");

        List<ShortLink> allShortLinks = Arrays.asList(youtubeLink, facebookLink, instagramLink);

        when(shortLinkRepository.findByFragment(youtubeLink.getFragment())).thenReturn(Optional.of(youtubeLink));
        when(shortLinkRepository.findByFragment(facebookLink.getFragment())).thenReturn(Optional.of(facebookLink));
        when(shortLinkRepository.findByFragment(instagramLink.getFragment())).thenReturn(Optional.of(instagramLink));
        when(shortLinkRepository.findByFragment(("wrong_link"))).thenReturn(Optional.empty());
        when(shortLinkRepository.findById(instagramLink.getId())).thenReturn(Optional.of(instagramLink));
        when(shortLinkRepository.findById(tikTokLink.getId())).thenReturn(Optional.of(tikTokLink));
        when(shortLinkRepository.findAll()).thenReturn(allShortLinks);
        when(shortLinkRepository.findById(99L)).thenReturn(Optional.empty());
        when(shortLinkRepository.save(tikTokLink)).thenReturn(tikTokLink);
        when(shortLinkRepository.save(updatedTikTokLink)).thenReturn(updatedTikTokLink);
    }

    @Test
    void given3ShortLinks_whengetAll_thenReturn3Records() {
        ShortLink youtubeLink = new ShortLink(11L, "youtube", "ML5HPi", "https://www.youtube.com/");
        ShortLink facebookLink = new ShortLink(1L, "facebook", "7W8R2o", "https://www.facebook.com/");
        ShortLink instagramLink = new ShortLink(12L, "instagram", "Dcf8c8", "https://www.instagram.com/");

        List<ShortLink> allShortLinks = shortLinkService.getAll();
        verifyFindAllShortLinksIsCalledOnce();
        assertThat(allShortLinks).hasSize(3).extracting(ShortLink::getTitle).contains(youtubeLink.getTitle(), facebookLink.getTitle(), instagramLink.getTitle());
    }

    @Test
    void whenGetByValidId_thenShortLinkShouldBeFound() {
        ShortLink fromDb = shortLinkService.getById(12L);
        assertThat(fromDb.getFragment()).isEqualTo("Dcf8c8");

        verifyFindByIdIsCalledOnce();
    }

    @Test
    void whenGetByInvalidId_thenThrowResourceNotFound() {
        ResourceNotFoundException resourceNotFoundException = assertThrows(ResourceNotFoundException.class, () -> {
            shortLinkService.getById(99L);
        });

        String expectedMessage = "ShortLink with id: 99 not found.";
        String actualMessage = resourceNotFoundException.getMessage();

        verifyFindByIdIsCalledOnce();

        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    void whenAddUsingValidShortLink_thenShortLinkAdded() {
        ShortLink tikTokLink = new ShortLink(13L, "Tik Tok", "HEv7R2", "https://www.tiktok.com/en/");
        ShortLink savedLink = shortLinkService.add(tikTokLink);

        verifySaveOrUpdateIsCalledOnce(tikTokLink);

        assertEquals(tikTokLink, savedLink);
    }

    @Test
    void whenAddUsingValidShortLink_thenShortLinkUpdated() {
        ShortLink tikTokLink = new ShortLink(13L, "Tik Tok Cheng", "HEv7R2", "https://www.tiktok.com/en/");
        ShortLink savedLink = shortLinkService.updateOneById(13L, tikTokLink);

        verifySaveOrUpdateIsCalledOnce(tikTokLink);

        assertEquals(tikTokLink, savedLink);
    }

    @Test
    void whenAddUsingInvalidShortLink_thenThrowResourceNotFound() {
        ShortLink tikTokLink = new ShortLink(99L, "Tik Tok", "HEv7R2", "https://www.tiktok.com/en/");
        ResourceNotFoundException resourceNotFoundException = assertThrows(ResourceNotFoundException.class, () -> {
            shortLinkService.updateOneById(99L, tikTokLink);
        });

        String expectedMessage = "ShortLink with id: 99 not found.";
        String actualMessage = resourceNotFoundException.getMessage();

        verifyFindByIdIsCalledOnce();

        assertTrue(actualMessage.contains(expectedMessage));
    }


    @Test
    void whenDeleteByValidId_thenSuccess() {
        ShortLink tikTokLink = new ShortLink(13L, "Tik Tok", "HEv7R2", "https://www.tiktok.com/en/");
        shortLinkService.delete(tikTokLink.getId());

        verifyDeleteIsCalledOnce(tikTokLink);
    }

    @Test
    void whenDeleteByInvalidId_thenThrowResourceNotFound() {
        ResourceNotFoundException resourceNotFoundException = assertThrows(ResourceNotFoundException.class, () -> {
            shortLinkService.delete(99L);
        });

        String expectedMessage = "ShortLink with id: 99 not found.";
        String actualMessage = resourceNotFoundException.getMessage();

        verifyFindByIdIsCalledOnce();

        assertTrue(actualMessage.contains(expectedMessage));
    }

    @Test
    void whenValidFragment_thenShortLinkShouldBeFound() {
        String name = "ML5HPi";
        String link = "https://www.youtube.com/";
        String longUrl = shortLinkService.getRedirectUrl(name);

        assertThat(longUrl).isEqualTo(link);
    }

    @Test
    void whenInvalidFragment_thenThrowResourceNotFound() {
        ResourceNotFoundException resourceNotFoundException = assertThrows(ResourceNotFoundException.class, () -> {
            shortLinkService.getRedirectUrl("wrong_link");
        });

        String expectedMessage = "ShortLink with fragment: wrong_link not found.";
        String actualMessage = resourceNotFoundException.getMessage();

        verifyFindByFragmentIsCalledOnce("wrong_link");

        assertTrue(actualMessage.contains(expectedMessage));
    }

    private void verifyFindByFragmentIsCalledOnce(String fragment) {
        verify(shortLinkRepository, VerificationModeFactory.times(1)).findByFragment(fragment);
        reset(shortLinkRepository);
    }

    private void verifyFindByIdIsCalledOnce() {
        verify(shortLinkRepository, VerificationModeFactory.times(1)).findById(Mockito.anyLong());
        reset(shortLinkRepository);
    }

    private void verifySaveOrUpdateIsCalledOnce(ShortLink shortLink) {
        verify(shortLinkRepository, VerificationModeFactory.times(1)).save(shortLink);
        reset(shortLinkRepository);
    }

    private void verifyDeleteIsCalledOnce(ShortLink shortLink) {
        verify(shortLinkRepository, VerificationModeFactory.times(1)).delete(shortLink);
        reset(shortLinkRepository);
    }

    private void verifyFindAllShortLinksIsCalledOnce() {
        verify(shortLinkRepository, VerificationModeFactory.times(1)).findAll();
        reset(shortLinkRepository);
    }
}