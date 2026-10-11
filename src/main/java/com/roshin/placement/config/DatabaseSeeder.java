package com.roshin.placement.config;

import com.roshin.placement.entity.Admin;
import com.roshin.placement.entity.Role;
import com.roshin.placement.repository.AdminRepository;
import com.roshin.placement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.roshin.placement.repository.CompanyRepository companyRepository;

    @Autowired
    private com.roshin.placement.repository.JobRepository jobRepository;

    @Autowired
    private com.roshin.placement.repository.FacultyRepository facultyRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Fix existing bad rows where ai_feedback is NULL
        try {
            jdbcTemplate.execute("UPDATE ai_analysis SET ai_feedback = 'Analysis unavailable — please re-analyze.' WHERE ai_feedback IS NULL");
        } catch (Exception e) {
            System.err.println("Migration notice: " + e.getMessage());
        }

        // Seed Roles
        String[] roleNames = {"ROLE_STUDENT", "ROLE_FACULTY", "ROLE_COMPANY", "ROLE_ADMIN"};
        for (String roleName : roleNames) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(new Role(roleName));
            }
        }

        // Seed Admin User
        if (adminRepository.findByEmail("admin@skill.com").isEmpty()) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").get();
            Admin admin = new Admin();
            admin.setName("Super Admin");
            admin.setEmail("admin@skill.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhoneNumber("1234567890");
            admin.setRole(adminRole);
            admin.setActive(true);
            admin.setAdminLevel("SUPER_ADMIN");
            adminRepository.save(admin);
            System.out.println("Admin seeded: admin@skill.com / admin123");
        }

        // Seed Sample Company
        if (companyRepository.findByEmail("careers@google.com").isEmpty()) {
            Role companyRole = roleRepository.findByName("ROLE_COMPANY").get();
            com.roshin.placement.entity.Company google = new com.roshin.placement.entity.Company();
            google.setName("Google HR");
            google.setEmail("careers@google.com");
            google.setPassword(passwordEncoder.encode("GoogleHR@123"));
            google.setPhoneNumber("9876543210");
            google.setRole(companyRole);
            google.setActive(true);
            google.setCompanyName("Google");
            google.setIndustry("Technology");
            google.setWebsite("https://careers.google.com");
            companyRepository.save(google);
            
            System.out.println("Sample Company seeded.");
        }

        // Seed Sample Faculty
        if (roleRepository.findByName("ROLE_FACULTY").isPresent()) {
            if (facultyRepository.findByEmail("faculty@skill.com").isEmpty()) {
                Role facultyRole = roleRepository.findByName("ROLE_FACULTY").get();
                com.roshin.placement.entity.Faculty faculty = new com.roshin.placement.entity.Faculty();
                faculty.setName("Prof. John Doe");
                faculty.setEmail("faculty@skill.com");
                faculty.setPassword(passwordEncoder.encode("faculty123"));
                faculty.setPhoneNumber("1122334455");
                faculty.setRole(facultyRole);
                faculty.setActive(true);
                faculty.setEmployeeId("EMP-101");
                faculty.setDesignation("Professor");
                faculty.setDepartment("Computer Science");
                facultyRepository.save(faculty);
                System.out.println("Faculty seeded: faculty@skill.com / faculty123");
            }
        }
    }
}
