package com.reactshop.dto;

public class UserResponse {
    private Long id;
    private String username;
    private String role;
    private String email;

    public UserResponse(Long id, String username, String role, String email) {
        this.id = id;
        this.username = username;
        this.role = role;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
}