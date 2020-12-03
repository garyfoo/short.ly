package com.shortly.api.service.impl;

import com.shortly.api.exception.ResourceNotFoundException;
import com.shortly.api.model.ShortLink;
import com.shortly.api.repository.ShortLinkRepository;
import com.shortly.api.service.ShortLinkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShortLinkServiceImpl implements ShortLinkService {

    @Autowired
    private ShortLinkRepository shortLinkRepository;

    public List<ShortLink> getAll() {
        return shortLinkRepository.findAll();
    }

    public ShortLink getById(long id) {
        return shortLinkRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ShortLink with id: " + id + " not found."));
    }

    public ShortLink add(ShortLink shortLink) {
        return shortLinkRepository.save(shortLink);
    }

    public ShortLink updateOneById(long id, ShortLink updatedShortLink) {
        ShortLink shortLink = shortLinkRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ShortLink with id: " + id + " not found."));
        shortLink.setLongUrl(updatedShortLink.getLongUrl());
        shortLink.setTitle(updatedShortLink.getTitle());
        return shortLinkRepository.save(shortLink);
    }

    public void delete(long id) {
        ShortLink shortLink = shortLinkRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ShortLink with id: " + id + " not found."));
        shortLinkRepository.delete(shortLink);
    }

    public String getRedirectUrl(String fragment) {
        ShortLink shortLink = shortLinkRepository.findByFragment(fragment).orElseThrow(() -> new ResourceNotFoundException("ShortLink with fragment: " + fragment + " not found."));
        return shortLink.getLongUrl();
    }

}