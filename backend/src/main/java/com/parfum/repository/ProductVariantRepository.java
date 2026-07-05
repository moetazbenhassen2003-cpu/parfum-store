package com.parfum.repository;

import com.parfum.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    
    @Query("SELECT v FROM ProductVariant v WHERE v.stockQuantity < 10")
    List<ProductVariant> findLowStockVariants();
}
