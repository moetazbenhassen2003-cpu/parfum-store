package com.parfum.service;

import com.parfum.dto.*;
import com.parfum.entity.*;
import com.parfum.exception.ResourceNotFoundException;
import com.parfum.repository.ProductImageRepository;
import com.parfum.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Value("${app.base-url:http://localhost:8081}")
    private String baseUrl;

    @Value("${app.upload-dir:${user.dir}/uploads}")
    private String uploadDir;
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllPublishedProducts(Pageable pageable) {
        return productRepository.findByIsPublishedTrue(pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsPublishedTrue()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String query, Pageable pageable) {
        return productRepository.searchProducts(query, pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> filterProducts(String gender, String category, BigDecimal minPrice, 
                                                BigDecimal maxPrice, Pageable pageable) {
        Product.Gender genderEnum = gender != null ? Product.Gender.valueOf(gender) : null;
        Product.Category categoryEnum = category != null ? Product.Category.valueOf(category) : null;
        return productRepository.filterProducts(genderEnum, categoryEnum, minPrice, maxPrice, pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
        return convertToResponse(product);
    }
    
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        updateProductFromRequest(product, request);
        product = productRepository.save(product);
        return convertToResponse(product);
    }
    
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
        
        // Clear existing variants and tags
        product.getVariants().clear();
        product.getTags().clear();
        
        updateProductFromRequest(product, request);
        product = productRepository.save(product);
        return convertToResponse(product);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
        productRepository.delete(product);
    }
    
    @Transactional
    public void togglePublished(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
        product.setIsPublished(!product.getIsPublished());
        productRepository.save(product);
    }
    
    @Transactional
    public void toggleFeatured(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
        product.setIsFeatured(!product.getIsFeatured());
        productRepository.save(product);
    }
    
    @Transactional
    public List<String> uploadImages(Long productId, MultipartFile[] files) throws IOException {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));

        // Validate files
        for (MultipartFile file : files) {
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("image/jpeg")
                    && !contentType.equals("image/png")
                    && !contentType.equals("image/webp"))) {
                throw new RuntimeException("Format non supporté. Utilisez JPG, PNG ou WebP.");
            }
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException("Fichier trop volumineux (max 5MB).");
            }
        }

        List<String> imageUrls = new ArrayList<>();
        Path uploadPath = Paths.get(uploadDir, "products", String.valueOf(productId));

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (MultipartFile file : files) {
            String ext = getExtension(file.getOriginalFilename());
            String filename = UUID.randomUUID().toString() + ext;
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "products/" + productId + "/" + filename;
            imageUrls.add(imageUrl);

            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(imageUrl);
            // First image uploaded becomes primary if no primary exists
            boolean hasPrimary = product.getImages().stream().anyMatch(ProductImage::getIsPrimary);
            image.setIsPrimary(!hasPrimary);
            product.getImages().add(image);
        }

        productRepository.save(product);
        return imageUrls;
    }

    private String getExtension(String filename) {
        if (filename == null) return ".jpg";
        int dot = filename.lastIndexOf('.');
        return dot > 0 ? filename.substring(dot).toLowerCase() : ".jpg";
    }
    
    @Transactional
    public void deleteImage(Long productId, Long imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image non trouvée"));
        if (!image.getProduct().getId().equals(productId)) {
            throw new ResourceNotFoundException("Image non trouvée pour ce produit");
        }
        productImageRepository.delete(image);
    }

    @Transactional
    public void setPrimaryImage(Long productId, Long imageId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
        product.getImages().forEach(img -> img.setIsPrimary(img.getId().equals(imageId)));
        productRepository.save(product);
    }
    
    private void updateProductFromRequest(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setDescription(request.getDescription());
        product.setGender(request.getGender());
        product.setCategory(request.getCategory());
        product.setIsFeatured(request.getIsFeatured());
        product.setIsPublished(request.getIsPublished());
        
        // Add tags
        for (String tagName : request.getTags()) {
            ProductTag tag = new ProductTag();
            tag.setProduct(product);
            tag.setTagName(tagName);
            product.getTags().add(tag);
        }
        
        // Add variants
        for (VariantRequest variantReq : request.getVariants()) {
            ProductVariant variant = new ProductVariant();
            variant.setProduct(product);
            variant.setVolumeMl(variantReq.getVolumeMl());
            variant.setPrice(variantReq.getPrice());
            variant.setStockQuantity(variantReq.getStockQuantity());
            product.getVariants().add(variant);
        }
    }
    
    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setBrand(product.getBrand());
        response.setDescription(product.getDescription());
        response.setGender(product.getGender());
        response.setCategory(product.getCategory());
        response.setIsFeatured(product.getIsFeatured());
        response.setIsPublished(product.getIsPublished());
        response.setCreatedAt(product.getCreatedAt());
        
        // Convert variants
        response.setVariants(product.getVariants().stream()
                .map(this::convertVariantToResponse)
                .collect(Collectors.toList()));
        
        // Convert images
        response.setImages(product.getImages().stream()
                .map(this::convertImageToResponse)
                .collect(Collectors.toList()));
        
        // Extract tags
        response.setTags(product.getTags().stream()
                .map(ProductTag::getTagName)
                .collect(Collectors.toList()));
        
        // Get minimum price
        response.setMinPrice(product.getVariants().stream()
                .map(ProductVariant::getPrice)
                .min(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO));
        
        // Get primary image
        response.setPrimaryImageUrl(product.getImages().stream()
                .filter(ProductImage::getIsPrimary)
                .findFirst()
                .map(img -> baseUrl + "/api/files/" + img.getImageUrl())
                .orElse(null));
        
        return response;
    }
    
    private VariantResponse convertVariantToResponse(ProductVariant variant) {
        VariantResponse response = new VariantResponse();
        response.setId(variant.getId());
        response.setVolumeMl(variant.getVolumeMl());
        response.setPrice(variant.getPrice());
        response.setStockQuantity(variant.getStockQuantity());
        return response;
    }
    
    private ImageResponse convertImageToResponse(ProductImage image) {
        ImageResponse response = new ImageResponse();
        response.setId(image.getId());
        response.setImageUrl(baseUrl + "/api/files/" + image.getImageUrl());
        response.setIsPrimary(image.getIsPrimary());
        return response;
    }
    
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
}
