package com.parfum.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {
    private long todayOrdersCount;
    private double weekRevenue;
    private long pendingOrdersCount;
    private int lowStockProductsCount;
}
