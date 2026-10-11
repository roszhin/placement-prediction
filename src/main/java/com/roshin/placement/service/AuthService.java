package com.roshin.placement.service;

import com.roshin.placement.dto.RegistrationDto;
import com.roshin.placement.entity.*;
import com.roshin.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private OtpVerificationRepository otpRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;

    @Transactional
    public void sendOtpForRegistration(String email) throws Exception {
        if (userRepository.existsByEmail(email)) {
            throw new Exception("Email already exists");
        }
        
        // Generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Remove existing OTPs for this email
        otpRepository.deleteByEmail(email);
        
        OtpVerification otpVerification = new OtpVerification(
                email,
                otp,
                LocalDateTime.now().plusMinutes(5)
        );
        otpRepository.save(otpVerification);

        // Send Email
        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtpApi(String email, String otp) {
        Optional<OtpVerification> otpOpt = otpRepository.findByEmailAndOtp(email, otp);
        if (otpOpt.isEmpty() || otpOpt.get().getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }
        return true;
    }

    @Transactional
    public void initiateRegistration(RegistrationDto dto) throws Exception {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new Exception("Email already exists");
        }
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new Exception("Passwords do not match");
        }

        // Verify OTP first
        Optional<OtpVerification> otpOpt = otpRepository.findByEmailAndOtp(dto.getEmail(), dto.getOtp());
        if (otpOpt.isEmpty() || otpOpt.get().getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new Exception("Invalid or expired OTP");
        }

        // Create the user active immediately
        Role role = roleRepository.findByName("ROLE_" + dto.getRole().toUpperCase())
                .orElseGet(() -> roleRepository.save(new Role("ROLE_" + dto.getRole().toUpperCase())));

        User user = null;
        if ("STUDENT".equalsIgnoreCase(dto.getRole())) {
            Student student = new Student();
            student.setRollNumber(dto.getRollNumber());
            student.setCourse(dto.getCourse());
            student.setPassingYear(dto.getPassingYear());
            student.setCgpa(dto.getCgpa());
            student.setDepartment(dto.getDepartment());
            user = student;
        } else if ("FACULTY".equalsIgnoreCase(dto.getRole())) {
            Faculty faculty = new Faculty();
            faculty.setEmployeeId(dto.getEmployeeId());
            faculty.setDesignation(dto.getDesignation());
            faculty.setDepartment(dto.getDepartment());
            user = faculty;
        } else if ("COMPANY".equalsIgnoreCase(dto.getRole())) {
            Company company = new Company();
            company.setCompanyName(dto.getCompanyName());
            company.setWebsite(dto.getWebsite());
            company.setIndustry(dto.getIndustry());
            company.setCompanyDescription(dto.getCompanyDescription());
            user = company;
        } else {
            throw new Exception("Invalid role");
        }

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setGender(dto.getGender());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setAddress(dto.getAddress());
        user.setRole(role);
        user.setActive(true); // Active immediately

        if (user instanceof Student) {
            studentRepository.save((Student) user);
        } else if (user instanceof Faculty) {
            facultyRepository.save((Faculty) user);
        } else if (user instanceof Company) {
            companyRepository.save((Company) user);
        }

        // Cleanup OTP
        otpRepository.delete(otpOpt.get());
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        Optional<OtpVerification> otpOpt = otpRepository.findByEmailAndOtp(email, otp);
        if (otpOpt.isPresent()) {
            OtpVerification verification = otpOpt.get();
            if (verification.getExpiryTime().isAfter(LocalDateTime.now())) {
                // OTP is valid
                User user = userRepository.findByEmail(email).orElse(null);
                if (user != null) {
                    user.setActive(true);
                    userRepository.save(user);
                    otpRepository.delete(verification);
                    return true;
                }
            }
        }
        return false;
    }
}
