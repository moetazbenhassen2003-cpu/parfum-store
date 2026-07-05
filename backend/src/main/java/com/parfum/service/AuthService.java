package com.parfum.service;

import com.parfum.dto.*;
import com.parfum.entity.PasswordResetToken;
import com.parfum.entity.User;
import com.parfum.exception.UnauthorizedException;
import com.parfum.repository.PasswordResetTokenRepository;
import com.parfum.repository.UserRepository;
import com.parfum.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@EnableAsync
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailService emailService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UnauthorizedException("Cet email est déjà utilisé");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(User.Role.CLIENT);

        user = userRepository.save(user);

        String token = buildToken(user);
        return new AuthResponse(token, user.getRole().name(), convertToDto(user));
    }

    public AuthResponse login(AuthRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            throw new UnauthorizedException("Email ou mot de passe incorrect");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Utilisateur non trouvé"));

        String token = buildToken(user);
        return new AuthResponse(token, user.getRole().name(), convertToDto(user));
    }

    public UserDto getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedException("Non authentifié");
        }

        String email = ((UserDetails) auth.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Utilisateur non trouvé"));

        return convertToDto(user);
    }

    // ── Change password (admin logged in) ──────────────────────────────────
    @Transactional
    public Map<String, String> changePassword(ChangePasswordRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) auth.getPrincipal()).getUsername();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Utilisateur non trouvé"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Mot de passe actuel incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("✅ Password changed for user: {}", email);

        return Map.of("message", "Mot de passe modifié avec succès");
    }

    // ── Forgot password — send reset email ─────────────────────────────────
    @Transactional
    public Map<String, String> forgotPassword(ForgotPasswordRequest request) {
        // Always return success (don't leak whether email exists)
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            // Delete old tokens for this user
            resetTokenRepository.deleteByUser(user);

            // Create secure token
            String rawToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(rawToken);
            resetToken.setUser(user);
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));
            resetToken.setUsed(false);
            resetTokenRepository.save(resetToken);

            // Send email async
            emailService.sendPasswordResetEmail(user.getEmail(), rawToken, user.getFullName());
            log.info("🔐 Password reset requested for: {}", user.getEmail());
        });

        return Map.of("message", "Si cet email existe, un lien de réinitialisation a été envoyé.");
    }

    // ── Validate reset token ────────────────────────────────────────────────
    public Map<String, Boolean> validateResetToken(String token) {
        boolean valid = resetTokenRepository.findByToken(token)
                .map(t -> !t.isExpired() && !t.isUsed())
                .orElse(false);
        return Map.of("valid", valid);
    }

    // ── Reset password with token ───────────────────────────────────────────
    @Transactional
    public Map<String, String> resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new UnauthorizedException("Token invalide ou expiré"));

        if (resetToken.isExpired()) {
            throw new UnauthorizedException("Ce lien a expiré. Veuillez en demander un nouveau.");
        }

        if (resetToken.isUsed()) {
            throw new UnauthorizedException("Ce lien a déjà été utilisé.");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);

        log.info("✅ Password reset successfully for: {}", user.getEmail());
        return Map.of("message", "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.");
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    private String buildToken(User user) {
        return jwtUtil.generateToken(
            org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .authorities("ROLE_" + user.getRole().name())
                .build()
        );
    }

    private UserDto convertToDto(User user) {
        return new UserDto(
            user.getId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getRole().name()
        );
    }
}
