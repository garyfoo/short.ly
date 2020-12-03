package com.shortly.api.controller;

import com.shortly.api.mapper.ShortLinkMapper;
import com.shortly.api.model.ShortLink;
import com.shortly.api.model.dto.ShortLinkDTO;
import com.shortly.api.service.ShortLinkService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/links")
@CrossOrigin({"http://localhost:4200"})
public class LinksController {

    final
    ShortLinkMapper shortLinkMapper;

    final
    ShortLinkService shortLinkService;

    private final Logger logger = LoggerFactory.getLogger(LinksController.class);

    public LinksController(ShortLinkService shortLinkService, ShortLinkMapper shortLinkMapper) {
        this.shortLinkService = shortLinkService;
        this.shortLinkMapper = shortLinkMapper;
    }

    @GetMapping
    public List<ShortLinkDTO> getAll() {
        return shortLinkService.getAll()
                .stream()
                .map(shortLinkMapper::mapShortLinkToShortLinkDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ShortLinkDTO getById(@PathVariable long id) {
        return shortLinkMapper.mapShortLinkToShortLinkDTO(shortLinkService.getById(id));
    }

    @PostMapping
    public ShortLinkDTO add(@RequestBody @Valid ShortLinkDTO shortLink) {
        return shortLinkMapper.mapShortLinkToShortLinkDTO(
                shortLinkService.add(shortLinkMapper.mapShortLinkDTOToShortLink(shortLink, true))
        );
    }

    @PutMapping("/{id}")
    public ShortLinkDTO updateOneById(@PathVariable long id, @Valid @RequestBody ShortLinkDTO updatedShortLink) {
        return shortLinkMapper.mapShortLinkToShortLinkDTO(
                shortLinkService.updateOneById(id, shortLinkMapper.mapShortLinkDTOToShortLink(updatedShortLink, false))
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable long id) {
        shortLinkService.delete(id);
    }
}
