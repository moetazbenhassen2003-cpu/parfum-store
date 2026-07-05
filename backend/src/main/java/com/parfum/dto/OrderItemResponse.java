package com.parfum.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long id;
    private String productName;
    private String productBrand;
    private String productImageUrl;
    private Integer volumeMl;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
}
