package com.reactshop.dto;

import java.util.List;

public class OrderRequest {

    private String userId;
    private Double total;
    private ShippingData shipping;
    private List<OrderItemRequest> items;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public ShippingData getShipping() { return shipping; }
    public void setShipping(ShippingData shipping) { this.shipping = shipping; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public static class ShippingData {
        private String fullName;
        private String address;
        private String city;
        private String zip;
        private String country;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getZip() { return zip; }
        public void setZip(String zip) { this.zip = zip; }

        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }

    public static class OrderItemRequest {
        private String id;
        private String name;
        private Double price;
        private Integer quantity;
        private String imageUrl;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }
}