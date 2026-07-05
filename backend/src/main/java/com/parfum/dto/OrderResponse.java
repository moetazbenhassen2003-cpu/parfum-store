package com.parfum.dto;

import com.parfum.entity.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private UserDto client;
    private BigDecimal totalPrice;
    private Order.OrderStatus status;
    private String note;
    private String deliveryFullName;
    private String deliveryPhone;
    private String deliveryWilaya;
    private String deliveryCity;
    private String deliveryStreet;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderItemResponse> items = new ArrayList<>();
}
