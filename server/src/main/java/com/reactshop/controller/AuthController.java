package com.reactshop.controller;

import com.reactshop.dto.LoginRequest;
import com.reactshop.dto.RegisterRequest;
import com.reactshop.dto.UserResponse;
import com.reactshop.model.User;
import com.reactshop.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isPresent() && passwordEncoder.matches(request.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();
            return new UserResponse(user.getId(), user.getUsername(), user.getRole(), user.getEmail());
        } else {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Hibás felhasználónév vagy jelszó!");
        }
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A felhasználónév már foglalt!");
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); 
        newUser.setRole("user");
        newUser.setEmail(request.getUsername() + "@example.com");

        userRepository.save(newUser);

        return Map.of(
            "message", "Sikeres regisztráció",
            "user", new UserResponse(newUser.getId(), newUser.getUsername(), newUser.getRole(), newUser.getEmail())
        );
    }
}