package com.parfum.config;

import com.parfum.entity.User;
import com.parfum.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        // ── Migration: make client_id nullable for anonymous orders ──
        try {
            // Check if column is still NOT NULL, then alter it
            jdbcTemplate.execute(
                "ALTER TABLE orders MODIFY COLUMN client_id BIGINT NULL"
            );
            log.info("✅ Migration: orders.client_id is now nullable (anonymous orders supported)");
        } catch (Exception e) {
            // Already nullable or table doesn't exist yet — ignore
            log.debug("Migration skipped (already applied or table not yet created): {}", e.getMessage());
        }

        // ── Create default admin if not exists (password NOT reset on restart) ──
        if (!userRepository.existsByEmail("admin@parfum.com")) {
            User admin = new User();
            admin.setFullName("Admin");
            admin.setEmail("admin@parfum.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@2026!"));
            admin.setPhone("92584454");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            log.info("✅ Admin account created: admin@parfum.com / Admin@2026!");
        } else {
            log.info("ℹ️  Admin account already exists — password unchanged.");
        }
    }
}
