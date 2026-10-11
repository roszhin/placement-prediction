package com.roshin.placement.security;

import com.roshin.placement.entity.User;
import com.roshin.placement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        org.springframework.web.context.request.RequestAttributes rawAttr = RequestContextHolder.getRequestAttributes();
        String roleParam = null;
        if (rawAttr instanceof ServletRequestAttributes) {
            roleParam = ((ServletRequestAttributes) rawAttr).getRequest().getParameter("role");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
                
        if (roleParam != null && !roleParam.isEmpty()) {
            String expectedRole = "ROLE_" + roleParam.toUpperCase();
            if (!user.getRole().getName().equalsIgnoreCase(expectedRole)) {
                throw new UsernameNotFoundException("Invalid role selected. You are not a " + roleParam);
            }
        }
                
        return new CustomUserDetails(user);
    }
}
