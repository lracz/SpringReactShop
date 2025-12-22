package com.reactshop.controller;

import com.reactshop.dto.OrderRequest;
import com.reactshop.model.Order;
import com.reactshop.repository.OrderRepository;
import com.reactshop.service.OrderService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

	private final OrderService orderService;
    private final OrderRepository orderRepository;

    public OrderController(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public Map<String, Object> createOrder(@RequestBody OrderRequest request) {
        Long orderId = orderService.placeOrder(request);
        return Map.of("success", true, "orderId", orderId);
    }
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}