package com.parfum.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @Async
    public void sendPasswordResetEmail(String toEmail, String token, String adminName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🔐 Réinitialisation de votre mot de passe - Parfum Store");

            String resetUrl = frontendUrl + "/reset-password?token=" + token;

            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: 'Inter', Arial, sans-serif; background: #FAF9F6; margin: 0; padding: 0; }
                    .container { max-width: 580px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.08); }
                    .header { background: linear-gradient(135deg, #2C2C2C 0%%, #1a1a1a 100%%); padding: 40px 40px 30px; text-align: center; }
                    .logo { font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #D4AF37; }
                    .tagline { color: rgba(212,175,55,0.6); font-size: 11px; letter-spacing: 3px; margin-top: 6px; }
                    .body { padding: 40px; }
                    .greeting { font-size: 22px; color: #2C2C2C; font-weight: 600; margin-bottom: 16px; }
                    .text { color: #6B6B6B; font-size: 15px; line-height: 1.7; margin-bottom: 20px; }
                    .btn { display: inline-block; background: linear-gradient(135deg, #D4AF37, #C19B2E); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 600; font-size: 15px; margin: 24px 0; }
                    .warning { background: #FFF8E8; border-left: 4px solid #D4AF37; padding: 14px 18px; border-radius: 8px; color: #6B6B6B; font-size: 13px; margin-top: 24px; }
                    .footer { background: #F4F1EB; padding: 24px 40px; text-align: center; color: #888; font-size: 12px; }
                    .divider { height: 1px; background: linear-gradient(to right, transparent, #D4AF37, transparent); margin: 24px 0; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <div class="logo">PARFUM</div>
                      <div class="tagline">FRAGRANCES D'EXCEPTION</div>
                    </div>
                    <div class="body">
                      <div class="greeting">Bonjour, %s 👋</div>
                      <p class="text">Vous avez demandé la réinitialisation de votre mot de passe administrateur.</p>
                      <p class="text">Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe sécurisé :</p>
                      <div style="text-align: center;">
                        <a href="%s" class="btn">🔐 Réinitialiser mon mot de passe</a>
                      </div>
                      <div class="divider"></div>
                      <div class="warning">
                        ⏰ <strong>Ce lien expire dans 30 minutes.</strong><br>
                        Si vous n'avez pas fait cette demande, ignorez cet email — votre compte reste sécurisé.
                      </div>
                    </div>
                    <div class="footer">
                      © 2026 Parfum Store · Sécurité et confidentialité garanties
                    </div>
                  </div>
                </body>
                </html>
                """.formatted(adminName, resetUrl);

            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("✅ Password reset email sent to: {}", toEmail);

        } catch (MessagingException e) {
            log.error("❌ Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }
}
