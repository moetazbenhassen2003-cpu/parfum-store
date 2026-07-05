package com.parfum.service;

import com.parfum.dto.*;
import com.parfum.entity.*;
import com.parfum.exception.ResourceNotFoundException;
import com.parfum.repository.OrderRepository;
import com.parfum.repository.ProductVariantRepository;
import com.parfum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository variantRepository;
    
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        // Support anonymous orders — no login required
        User client = null;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) auth.getPrincipal()).getUsername();
            client = userRepository.findByEmail(email).orElse(null);
        }

        Order order = new Order();
        order.setClient(client);
        order.setStatus(Order.OrderStatus.EN_ATTENTE);
        order.setDeliveryFullName(request.getDeliveryFullName());
        order.setDeliveryPhone(request.getDeliveryPhone());
        order.setDeliveryWilaya(request.getDeliveryWilaya());
        order.setDeliveryCity(request.getDeliveryCity());
        order.setDeliveryStreet(request.getDeliveryStreet());
        order.setNote(request.getNote());
        
        BigDecimal total = BigDecimal.ZERO;
        
        // Process order items
        for (OrderItemRequest itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getProductVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Variante non trouvée"));
            
            if (variant.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour " + variant.getProduct().getName());
            }
            
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductVariant(variant);
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(variant.getPrice());
            
            order.getItems().add(item);
            
            BigDecimal itemTotal = variant.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(itemTotal);
            
            // Update stock
            variant.setStockQuantity(variant.getStockQuantity() - itemReq.getQuantity());
        }
        
        order.setTotalPrice(total);
        order = orderRepository.save(order);
        
        return convertToResponse(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {
        User client = getCurrentUser();
        return orderRepository.findByClientOrderByCreatedAtDesc(client)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(String status, Pageable pageable) {
        if (status != null && !status.isEmpty()) {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status);
            return orderRepository.findByStatus(orderStatus, pageable)
                    .map(this::convertToResponse);
        }
        return orderRepository.findAll(pageable)
                .map(this::convertToResponse);
    }
    
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));
        return convertToResponse(order);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));
        
        order.setStatus(Order.OrderStatus.valueOf(status));
        order = orderRepository.save(order);
        
        return convertToResponse(order);
    }
    
    public DashboardStatsResponse getDashboardStats() {
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        
        long todayOrders = orderRepository.countOrdersSince(todayStart);
        Double weekRevenue = orderRepository.sumRevenueSince(weekStart);
        long pendingOrders = orderRepository.countByStatus(Order.OrderStatus.EN_ATTENTE);
        int lowStock = variantRepository.findLowStockVariants().size();
        
        return new DashboardStatsResponse(
            todayOrders,
            weekRevenue != null ? weekRevenue : 0.0,
            pendingOrders,
            lowStock
        );
    }
    
    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
    }
    
    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setTotalPrice(order.getTotalPrice());
        response.setStatus(order.getStatus());
        response.setNote(order.getNote());
        response.setDeliveryFullName(order.getDeliveryFullName());
        response.setDeliveryPhone(order.getDeliveryPhone());
        response.setDeliveryWilaya(order.getDeliveryWilaya());
        response.setDeliveryCity(order.getDeliveryCity());
        response.setDeliveryStreet(order.getDeliveryStreet());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        
        if (order.getClient() != null) {
            UserDto clientDto = new UserDto(
                order.getClient().getId(),
                order.getClient().getFullName(),
                order.getClient().getEmail(),
                order.getClient().getPhone(),
                order.getClient().getRole().name()
            );
            response.setClient(clientDto);
        }
        
        response.setItems(order.getItems().stream()
                .map(this::convertItemToResponse)
                .collect(Collectors.toList()));
        
        return response;
    }
    
    private OrderItemResponse convertItemToResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setProductName(item.getProductVariant().getProduct().getName());
        response.setProductBrand(item.getProductVariant().getProduct().getBrand());
        response.setVolumeMl(item.getProductVariant().getVolumeMl());
        response.setQuantity(item.getQuantity());
        response.setUnitPrice(item.getUnitPrice());
        response.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        
        // Get primary image
        String imageUrl = item.getProductVariant().getProduct().getImages().stream()
                .filter(ProductImage::getIsPrimary)
                .findFirst()
                .map(img -> "/api/files/" + img.getImageUrl())
                .orElse(null);
        response.setProductImageUrl(imageUrl);
        
        return response;
    }
}
