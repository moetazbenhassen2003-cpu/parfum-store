package com.parfum.dto;

import lombok.Data;

@Data
public class ImageResponse {
    private Long id;
    private String imageUrl;
    private Boolean isPrimary;
}
