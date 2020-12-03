package com.shortly.api.service;

import com.shortly.api.model.ShortLink;

import java.util.List;

public interface ShortLinkService {

    List<ShortLink> getAll();

    ShortLink getById(long id);

    ShortLink add(ShortLink shortLink);

    ShortLink updateOneById(long id, ShortLink updatedShortLink);

    void delete(long id);

    String getRedirectUrl(String fragment);

}
