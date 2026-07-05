package com.parfum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    
    @NotEmpty(message = "Le panier ne peut pas être vide")
    private List<OrderItemRequest> items;
    
    @NotBlank(message = "Le nom complet est obligatoire")
    private String deliveryFullName;
    
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String deliveryPhone;
    
    @NotBlank(message = "La wilaya est obligatoire")
    private String deliveryWilaya;
    
    @NotBlank(message = "La ville est obligatoire")
    private String deliveryCity;
    
    @NotBlank(message = "L'adresse est obligatoire")
    private String deliveryStreet;
    
    private String note;
}
