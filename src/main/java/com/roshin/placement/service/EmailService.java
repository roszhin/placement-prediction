package com.roshin.placement.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.net.http.HttpClient;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

@Service
public class EmailService {

    private final RestClient restClient;

    @Value("${email.gmail.client-id:}")
    private String clientId;

    @Value("${email.gmail.client-secret:}")
    private String clientSecret;

    @Value("${email.gmail.refresh-token:}")
    private String refreshToken;

    @Value("${email.gmail.from:}")
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
        if (isBlank(clientId) || isBlank(clientSecret) || isBlank(refreshToken) || isBlank(from)
                || containsLineBreak(from) || containsLineBreak(to)) {
            throw new EmailDeliveryException();
        }

        try {
            String accessToken = refreshAccessToken();
            String rawMessage = "From: " + from + "\r\n"
                    + "To: " + to + "\r\n"
                    + "Subject: OTP for Skill Platform Registration\r\n"
                    + "MIME-Version: 1.0\r\n"
                    + "Content-Type: text/plain; charset=UTF-8\r\n\r\n"
                    + "Your OTP for registration is: " + otp
                    + "\nThis OTP will expire in 5 minutes.";
            String encodedMessage = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(rawMessage.getBytes(StandardCharsets.UTF_8));

            restClient.post()
                    .uri("https://gmail.googleapis.com/gmail/v1/users/me/messages/send")
                    .headers(headers -> headers.setBearerAuth(accessToken))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("raw", encodedMessage))
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException ex) {
            throw new EmailDeliveryException();
        }
    }

    private String refreshAccessToken() {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("refresh_token", refreshToken);
        form.add("grant_type", "refresh_token");

        Map<String, Object> tokenResponse = restClient.post()
                .uri("https://oauth2.googleapis.com/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        Object accessToken = tokenResponse == null ? null : tokenResponse.get("access_token");
        if (!(accessToken instanceof String token) || token.isBlank()) {
            throw new EmailDeliveryException();
        }
        return token;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private boolean containsLineBreak(String value) {
        return value == null || value.contains("\r") || value.contains("\n");
    }
}
