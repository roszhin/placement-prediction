package com.roshin.placement.controller;

import com.roshin.placement.entity.*;
import com.roshin.placement.repository.*;
import com.roshin.placement.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

@Controller
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    private com.roshin.placement.service.FileUploadService fileUploadService;

    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private CompanyRepository companyRepository;
    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Faculty getFreshFaculty(CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) return null;
        return facultyRepository.findById(userDetails.getUser().getId())
                .orElse((Faculty) userDetails.getUser());
    }

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Faculty faculty = getFreshFaculty(userDetails);
        model.addAttribute("faculty", faculty);
        model.addAttribute("studentCount", studentRepository.count());
        model.addAttribute("companyCount", companyRepository.count());
        return "faculty/dashboard";
    }

    // PROFILE
    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Faculty faculty = getFreshFaculty(userDetails);
        model.addAttribute("faculty", faculty);
        return "faculty/profile";
    }

    @PostMapping("/profile")
    public String updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                @ModelAttribute Faculty updatedFaculty,
                                @RequestParam(required = false) String newPassword,
                                RedirectAttributes redirectAttributes) {
        Faculty faculty = facultyRepository.findById(userDetails.getUser().getId()).orElse(null);
        if (faculty != null) {
            faculty.setName(updatedFaculty.getName());
            faculty.setPhoneNumber(updatedFaculty.getPhoneNumber());
            faculty.setDesignation(updatedFaculty.getDesignation());
            faculty.setDepartment(updatedFaculty.getDepartment());
            if (newPassword != null && !newPassword.trim().isEmpty()) {
                faculty.setPassword(passwordEncoder.encode(newPassword));
            }
            facultyRepository.save(faculty);
            redirectAttributes.addFlashAttribute("success", "Profile updated successfully!");
        }
        return "redirect:/faculty/profile";
    }

    // STUDENTS
    @GetMapping("/students")
    public String manageStudents(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("faculty", getFreshFaculty(userDetails));
        model.addAttribute("students", studentRepository.findAll());
        return "faculty/students";
    }

    @PostMapping("/students/add")
    public String addStudent(@ModelAttribute Student student, RedirectAttributes redirectAttributes) {
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            redirectAttributes.addFlashAttribute("error", "Email already exists!");
            return "redirect:/faculty/students";
        }
        Role role = roleRepository.findByName("ROLE_STUDENT").orElse(null);
        student.setRole(role);
        student.setActive(true);
        student.setPassword(passwordEncoder.encode("student123")); // Default password
        studentRepository.save(student);
        redirectAttributes.addFlashAttribute("success", "Student added successfully! Default password: student123");
        return "redirect:/faculty/students";
    }

    @PostMapping("/students/edit/{id}")
    public String editStudent(@PathVariable Long id, @ModelAttribute Student updated, RedirectAttributes redirectAttributes) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student != null) {
            student.setName(updated.getName());
            student.setPhoneNumber(updated.getPhoneNumber());
            student.setRollNumber(updated.getRollNumber());
            student.setCourse(updated.getCourse());
            student.setDepartment(updated.getDepartment());
            student.setCgpa(updated.getCgpa());
            student.setPassingYear(updated.getPassingYear());
            studentRepository.save(student);
            redirectAttributes.addFlashAttribute("success", "Student updated successfully!");
        }
        return "redirect:/faculty/students";
    }

    @PostMapping("/students/delete/{id}")
    @Transactional
    public String deleteStudent(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Student student = studentRepository.findById(id).orElse(null);
        if (student != null) {
            List<Application> apps = applicationRepository.findByStudentOrderByAppliedAtDesc(student);
            applicationRepository.deleteAll(apps);
            applicationRepository.flush(); // Force delete execution before native query
            
            // Delete related ai_analysis and resumes
            jdbcTemplate.update("DELETE FROM ai_analysis WHERE student_id = ?", student.getId());
            jdbcTemplate.update("DELETE FROM resumes WHERE student_id = ?", student.getId());
            studentRepository.delete(student);
            redirectAttributes.addFlashAttribute("success", "Student deleted successfully!");
        }
        return "redirect:/faculty/students";
    }

    // COMPANIES (View Only)
    @GetMapping("/companies")
    public String viewCompanies(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("faculty", getFreshFaculty(userDetails));
        model.addAttribute("companies", companyRepository.findAll());
        return "faculty/companies";
    }
    
    @GetMapping("/company/{id}")
    public String viewCompanyDetails(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Company company = companyRepository.findById(id).orElseThrow();
        model.addAttribute("company", company);
        model.addAttribute("jobs", jobRepository.findByCompany(company));
        model.addAttribute("faculty", getFreshFaculty(userDetails));
        return "faculty/company_details";
    }

    @GetMapping("/job/{id}")
    public String viewJobDetails(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Job job = jobRepository.findById(id).orElseThrow();
        model.addAttribute("job", job);
        model.addAttribute("faculty", getFreshFaculty(userDetails));
        return "faculty/job_details";
    }

    @PostMapping("/profile/picture")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> updateProfilePicture(@RequestParam("file") org.springframework.web.multipart.MultipartFile file, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Faculty user = facultyRepository.findById(userDetails.getUser().getId()).orElse(null);
            if (user != null) {
                String imageUrl = fileUploadService.saveProfilePicture(file);
                user.setProfilePicture(imageUrl);
                facultyRepository.save(user);
                
                java.util.Map<String, String> response = new java.util.HashMap<>();
                response.put("success", "true");
                response.put("imageUrl", imageUrl);
                return org.springframework.http.ResponseEntity.ok(response);
            }
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "User not found"));
        } catch (IllegalArgumentException e) {
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", e.getMessage()));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body(java.util.Collections.singletonMap("error", "Server exception: " + e.getMessage()));
        }
    }

    @PostMapping("/profile/picture/remove")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> removeProfilePicture(@AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Faculty faculty = facultyRepository.findById(userDetails.getUser().getId()).orElse(null);
            if (faculty != null) {
                faculty.setProfilePicture(null);
                facultyRepository.save(faculty);
                return org.springframework.http.ResponseEntity.ok().build();
            }
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Failed to remove picture"));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body(java.util.Collections.singletonMap("error", "Server error"));
        }
    }
}
