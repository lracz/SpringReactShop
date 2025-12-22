package com.reactshop.service;

import com.reactshop.dto.OrderRequest;
import com.reactshop.model.Order;
import com.reactshop.model.OrderItem;
import com.reactshop.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Long placeOrder(OrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setTotal(request.getTotal());
        
        if (request.getShipping() != null) {
            order.setFullName(request.getShipping().getFullName());
            order.setAddress(request.getShipping().getAddress());
            order.setCity(request.getShipping().getCity());
            order.setZip(request.getShipping().getZip());
            order.setCountry(request.getShipping().getCountry());
        }

        List<OrderItem> items = new ArrayList<>();
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setProductId(itemReq.getId());
            item.setName(itemReq.getName());
            item.setPrice(itemReq.getPrice());
            item.setQuantity(itemReq.getQuantity());
            items.add(item);
        }
        order.setItems(items);

        return orderRepository.save(order).getId();
    }
}