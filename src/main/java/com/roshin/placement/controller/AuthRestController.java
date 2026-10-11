package com.roshin.placement.controller;

import com.roshin.placement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthRestController {

    @Autowired
    private AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestParam String email) {
        Map<String, String> response = new HashMap<>();
        try {
            authService.sendOtpForRegistration(email);
            response.put("status", "success");
            response.put("message", "OTP sent successfully to " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        Map<String, String> response = new HashMap<>();
        if (authService.verifyOtpApi(email, otp)) {
            response.put("status", "success");
            response.put("message", "OTP Verified");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "error");
            response.put("message", "Invalid or expired OTP");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
