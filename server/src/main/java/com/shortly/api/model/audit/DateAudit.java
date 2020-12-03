package com.shortly.api.model.audit;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.io.Serializable;
import java.time.Instant;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties(
        value = {"created", "updated"},
        allowGetters = true
)

@Data
public abstract class DateAudit implements Serializable {

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    @JsonProperty("created_at")
    @CreatedDate
    private Instant createdAt;

    @Column(name = "MODIFIED_AT")
    @JsonProperty("modified_at")
    @LastModifiedDate
    private Instant modifiedAt;
}
