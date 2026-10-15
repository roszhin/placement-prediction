package com.roshin.placement.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final RestClient restClient;

    public EmailService() {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(10));
        this.restClient = RestClient.builder()
                .requestFactory(requestFactory)
                .build();
    }

    @Value("${email.resend.api-key:}")
    private String apiKey;

    @Value("${email.resend.from:}")
    private String from;

    public void sendOtpEmail(String to, String otp) {
        if (apiKey == null || apiKey.isBlank() || from == null || from.isBlank()) {
            throw new IllegalStateException("OTP email service is not configured.");
        }

        Map<String, Object> email = Map.of(
                "from", from,
                "to", List.of(to),
                "subject", "OTP for Skill Platform Registration",
                "text", "Your OTP for registration is: " + otp + "\nThis OTP will expire in 5 minutes."
        );

        restClient.post()
                .uri("https://api.resend.com/emails")
                .headers(headers -> headers.setBearerAuth(apiKey))
                .contentType(MediaType.APPLICATION_JSON)
                .body(email)
                .retrieve()
                .toBodilessEntity();
    }
}
