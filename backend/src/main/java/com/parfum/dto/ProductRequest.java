package com.parfum.dto;

import com.parfum.entity.Product;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ProductRequest {
    
    @NotBlank(message = "Le nom du produit est obligatoire")
    private String name;
    
    @NotBlank(message = "La marque est obligatoire")
    private String brand;
    
    private String description;
    
    @NotNull(message = "Le genre est obligatoire")
    private Product.Gender gender;

    @NotNull(message = "La catégorie est obligatoire")
    private Product.Category category = Product.Category.PARFUM;
    
    private Boolean isFeatured = false;
    private Boolean isPublished = true;  // Publié par défaut
    
    private List<String> tags = new ArrayList<>();
    private List<VariantRequest> variants = new ArrayList<>();
}
