package com.reactshop.config;

import com.reactshop.model.Product;
import com.reactshop.model.User;
import com.reactshop.repository.ProductRepository;
import com.reactshop.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(ProductRepository productRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); 
            admin.setRole("admin");
            admin.setEmail("admin@reactshop.hu");
            
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123")); 
            user.setRole("user");
            user.setEmail("user@reactshop.hu");

            userRepository.saveAll(Arrays.asList(admin, user));
            logger.info("Felhasználók (admin, user) létrehozva és titkosítva!");
        }

        if (productRepository.count() == 0) {
            Product p1 = new Product();
            p1.setName("Gaming Egér");
            p1.setDescription("Profi optikai szenzor, RGB világítás");
            p1.setPrice(15000.0);
            p1.setCategory("Periféria");
            p1.setImageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500");
            p1.setStock(50);

            Product p2 = new Product();
            p2.setName("Mechanikus Billentyűzet");
            p2.setDescription("Kék kapcsolók, magyar kiosztás");
            p2.setPrice(35000.0);
            p2.setCategory("Periféria");
            p2.setImageUrl("https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500");
            p2.setStock(20);

            Product p3 = new Product();
            p3.setName("Gamer Monitor");
            p3.setDescription("27 col, 144Hz, 1ms válaszidő");
            p3.setPrice(85000.0);
            p3.setCategory("Monitor");
            p3.setImageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500");
            p3.setStock(10);

            productRepository.saveAll(Arrays.asList(p1, p2, p3));
            logger.info("Adatbázis inicializálva termékekkel!");
        }
    }
}