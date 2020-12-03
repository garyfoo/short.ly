package com.shortly.api.mapper;

import com.shortly.api.model.ShortLink;
import com.shortly.api.model.dto.ShortLinkDTO;
import com.shortly.api.util.RandomStringGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ShortLinkMapper {

    private ShortLinkMapper() {
    }

    @Value("${site.url}")
    private String siteUrl;

    public ShortLinkDTO mapShortLinkToShortLinkDTO(ShortLink shortLink) {
        ShortLinkDTO shortLinkDTO = new ShortLinkDTO();
        shortLinkDTO.setFragment(shortLink.getFragment());
        shortLinkDTO.setLongUrl(shortLink.getLongUrl());
        shortLinkDTO.setTitle(shortLink.getTitle());
        shortLinkDTO.setCreatedAt(shortLink.getCreatedAt());
        shortLinkDTO.setModifiedAt(shortLink.getModifiedAt());
        shortLinkDTO.setLink(siteUrl.concat(shortLink.getFragment()));
        shortLinkDTO.setId(shortLink.getId());
        return shortLinkDTO;
    }

    public ShortLink mapShortLinkDTOToShortLink(ShortLinkDTO shortLinkDto, boolean isNew) {
        RandomStringGenerator randomStringGenerator = new RandomStringGenerator(6);
        ShortLink shortLink = new ShortLink();
        shortLink.setTitle(shortLinkDto.getTitle());
        shortLink.setLongUrl(shortLinkDto.getLongUrl());
        if (isNew) {
            shortLink.setFragment(randomStringGenerator.generate());
        }
        return shortLink;
    }
}
