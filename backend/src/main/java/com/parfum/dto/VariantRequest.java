package com.parfum.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class VariantRequest {
    
    @NotNull(message = "Le volume est obligatoire")
    @Min(value = 1, message = "Le volume doit être supérieur à 0")
    private Integer volumeMl;
    
    @NotNull(message = "Le prix est obligatoire")
    @Min(value = 0, message = "Le prix doit être positif")
    private BigDecimal price;
    
    @NotNull(message = "La quantité en stock est obligatoire")
    @Min(value = 0, message = "La quantité doit être positive")
    private Integer stockQuantity;
}
