package com.parfum.dto;

import com.parfum.entity.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private String description;
    private Product.Gender gender;
    private Product.Category category;
    private Boolean isFeatured;
    private Boolean isPublished;
    private LocalDateTime createdAt;
    private List<VariantResponse> variants = new ArrayList<>();
    private List<ImageResponse> images = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private BigDecimal minPrice;
    private String primaryImageUrl;
}
