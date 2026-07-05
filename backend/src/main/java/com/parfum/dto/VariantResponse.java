package com.parfum.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class VariantResponse {
    private Long id;
    private Integer volumeMl;
    private BigDecimal price;
    private Integer stockQuantity;
}
