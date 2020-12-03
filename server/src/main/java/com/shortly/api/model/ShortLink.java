package com.shortly.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.shortly.api.model.audit.DateAudit;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import javax.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "SHORT_LINK")
public class ShortLink extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private long id;

    @Column(nullable = false, name = "TITLE")
    @NotBlank(message = "Title cannot be blank or empty")
    @Size(min = 1, max = 100, message = "Title must be between 1 to 100 characters")
    @JsonProperty("title")
    private String title;

    @Column(nullable = false, unique=true, name = "FRAGMENT")
    @NotBlank(message = "Fragment cannot be blank or empty")
    @Size(min = 1, max = 6, message = "Fragment must be between 1 to 6 characters")
    @JsonProperty("fragment")
    private String fragment;

    @Column(nullable = false, name = "LONG_URL")
    @NotBlank(message = "Site URL cannot be blank or empty")
    @Size(min = 1, max = 500, message = "Site URL must be between 1 to 200 characters")
    @JsonProperty("long_url")
    @URL
    private String longUrl;

    public ShortLink(@NotBlank(message = "Title cannot be blank or empty") @Size(min = 1, max = 100, message = "Title must be between 1 to 100 characters") String title, @NotBlank(message = "Fragment cannot be blank or empty") @Size(min = 1, max = 6, message = "Fragment must be between 1 to 6 characters") String fragment, @NotBlank(message = "Site URL cannot be blank or empty") @Size(min = 1, max = 200, message = "Site URL must be between 1 to 200 characters") String longUrl) {
        this.title = title;
        this.fragment = fragment;
        this.longUrl = longUrl;
    }
}
