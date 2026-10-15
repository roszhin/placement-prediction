package com.roshin.placement.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final RestClient restClient;

    @Value("${email.resend.api-key:}")
    private String apiKey;

    @Value("${email.resend.from:}")
    private String from;

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

    public void sendOtpEmail(String to, String otp) {
        if (isBlank(apiKey) || isBlank(from) || containsLineBreak(from) || containsLineBreak(to)) {
            logger.warn("OTP email not sent: Resend configuration is missing or invalid");
            throw new EmailDeliveryException();
        }

        Map<String, Object> message = Map.of(
                "from", from,
                "to", List.of(to),
                "subject", "OTP for Skill Platform Registration",
                "text", "Your OTP for registration is: " + otp + "\nThis OTP will expire in 5 minutes."
        );

        try {
            restClient.post()
                    .uri("https://api.resend.com/emails")
                    .headers(headers -> headers.setBearerAuth(apiKey))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(message)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException ex) {
            logger.warn("Resend rejected OTP email request with HTTP status {}", ex.getStatusCode().value());
            throw new EmailDeliveryException();
        } catch (RestClientException ex) {
            logger.warn("Could not connect to the Resend email API");
            throw new EmailDeliveryException();
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private boolean containsLineBreak(String value) {
        return value == null || value.contains("\r") || value.contains("\n");
    }
}
