package com.roshin.placement.controller;

import com.roshin.placement.dto.RegistrationDto;
import com.roshin.placement.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("registrationDto", new RegistrationDto());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(RegistrationDto registrationDto, Model model) {
        try {
            authService.initiateRegistration(registrationDto);
            return "redirect:/login?registered=true";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }

    @GetMapping("/dashboard")
    public String redirectBasedOnRole(@org.springframework.security.core.annotation.AuthenticationPrincipal com.roshin.placement.security.CustomUserDetails userDetails) {
        if (userDetails == null) return "redirect:/login";
        String role = userDetails.getUser().getRole().getName();
        if (role.equals("ROLE_STUDENT")) {
            return "redirect:/student/dashboard";
        } else if (role.equals("ROLE_FACULTY")) {
            return "redirect:/faculty/dashboard";
        } else if (role.equals("ROLE_COMPANY")) {
            return "redirect:/company/dashboard";
        } else if (role.equals("ROLE_ADMIN")) {
            return "redirect:/admin/dashboard";
        }
        return "redirect:/";
    }
}
