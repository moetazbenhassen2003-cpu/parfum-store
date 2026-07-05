package com.parfum.repository;

import com.parfum.entity.Order;
import com.parfum.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByClientOrderByCreatedAtDesc(User client);
    
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.createdAt >= :startDate AND o.status != 'ANNULEE'")
    Double sumRevenueSince(@Param("startDate") LocalDateTime startDate);
    
    long countByStatus(Order.OrderStatus status);
}
