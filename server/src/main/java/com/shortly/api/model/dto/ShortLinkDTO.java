package com.shortly.api.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.shortly.api.model.audit.DateAudit;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShortLinkDTO extends DateAudit {

    private long id;

    @NotBlank(message = "Title cannot be blank or empty")
    @Size(min = 1, max = 100, message = "Title must be between 1 to 100 characters")
    private String title;

    private String link;

    private String fragment;

    // https://www.geeksforgeeks.org/check-if-an-url-is-valid-or-not-using-regular-expression/
    @NotBlank(message = "Site URL cannot be blank or empty")
    @Size(min = 1, max = 500, message = "Site URL must be between 1 to 500 characters")
    @URL
    @JsonProperty("long_url")
    private String longUrl;

}
