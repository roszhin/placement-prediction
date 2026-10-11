package com.roshin.placement.controller;

import com.roshin.placement.entity.*;
import com.roshin.placement.repository.*;
import com.roshin.placement.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private com.roshin.placement.service.FileUploadService fileUploadService;

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private FacultyRepository facultyRepository;
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

    private Admin getFreshAdmin(CustomUserDetails userDetails) {
        if (userDetails == null || userDetails.getUser() == null) return null;
        return adminRepository.findById(userDetails.getUser().getId())
                .orElse((Admin) userDetails.getUser());
    }

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Admin admin = getFreshAdmin(userDetails);
        model.addAttribute("admin", admin);
        model.addAttribute("studentCount", studentRepository.count());
        model.addAttribute("facultyCount", facultyRepository.count());
        model.addAttribute("companyCount", companyRepository.count());
        model.addAttribute("jobCount", jobRepository.count());
        return "admin/dashboard";
    }

    // PROFILE
    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        Admin admin = getFreshAdmin(userDetails);
        model.addAttribute("admin", admin);
        return "admin/profile";
    }

    @PostMapping("/profile")
    public String updateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                @ModelAttribute Admin updatedAdmin,
                                @RequestParam(required = false) String newPassword,
                                RedirectAttributes redirectAttributes) {
        Admin admin = adminRepository.findById(userDetails.getUser().getId()).orElse(null);
        if (admin != null) {
            admin.setName(updatedAdmin.getName());
            admin.setPhoneNumber(updatedAdmin.getPhoneNumber());
            if (newPassword != null && !newPassword.trim().isEmpty()) {
                admin.setPassword(passwordEncoder.encode(newPassword));
            }
            adminRepository.save(admin);
            redirectAttributes.addFlashAttribute("success", "Profile updated successfully!");
        }
        return "redirect:/admin/profile";
    }

    // STUDENTS
    @GetMapping("/students")
    public String manageStudents(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("admin", getFreshAdmin(userDetails));
        model.addAttribute("students", studentRepository.findAll());
        return "admin/students";
    }

    @PostMapping("/students/add")
    public String addStudent(@ModelAttribute Student student, RedirectAttributes redirectAttributes) {
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            redirectAttributes.addFlashAttribute("error", "Email already exists!");
            return "redirect:/admin/students";
        }
        Role role = roleRepository.findByName("ROLE_STUDENT").orElse(null);
        student.setRole(role);
        student.setActive(true);
        student.setPassword(passwordEncoder.encode("student123")); // Default password
        studentRepository.save(student);
        redirectAttributes.addFlashAttribute("success", "Student added successfully! Default password: student123");
        return "redirect:/admin/students";
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
        return "redirect:/admin/students";
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
        return "redirect:/admin/students";
    }

    // FACULTY
    @GetMapping("/faculty")
    public String manageFaculty(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("admin", getFreshAdmin(userDetails));
        model.addAttribute("facultyList", facultyRepository.findAll());
        return "admin/faculty";
    }

    @PostMapping("/faculty/add")
    public String addFaculty(@ModelAttribute Faculty faculty, RedirectAttributes redirectAttributes) {
        if (facultyRepository.findByEmail(faculty.getEmail()).isPresent()) {
            redirectAttributes.addFlashAttribute("error", "Email already exists!");
            return "redirect:/admin/faculty";
        }
        Role role = roleRepository.findByName("ROLE_FACULTY").orElse(null);
        faculty.setRole(role);
        faculty.setActive(true);
        faculty.setPassword(passwordEncoder.encode("faculty123")); // Default password
        facultyRepository.save(faculty);
        redirectAttributes.addFlashAttribute("success", "Faculty added successfully! Default password: faculty123");
        return "redirect:/admin/faculty";
    }

    @PostMapping("/faculty/edit/{id}")
    public String editFaculty(@PathVariable Long id, @ModelAttribute Faculty updated, RedirectAttributes redirectAttributes) {
        Faculty faculty = facultyRepository.findById(id).orElse(null);
        if (faculty != null) {
            faculty.setName(updated.getName());
            faculty.setPhoneNumber(updated.getPhoneNumber());
            faculty.setEmployeeId(updated.getEmployeeId());
            faculty.setDepartment(updated.getDepartment());
            faculty.setDesignation(updated.getDesignation());
            facultyRepository.save(faculty);
            redirectAttributes.addFlashAttribute("success", "Faculty updated successfully!");
        }
        return "redirect:/admin/faculty";
    }

    @PostMapping("/faculty/delete/{id}")
    public String deleteFaculty(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        facultyRepository.deleteById(id);
        redirectAttributes.addFlashAttribute("success", "Faculty deleted successfully!");
        return "redirect:/admin/faculty";
    }

    // COMPANIES
    @GetMapping("/companies")
    public String manageCompanies(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("admin", getFreshAdmin(userDetails));
        model.addAttribute("companies", companyRepository.findAll());
        return "admin/companies";
    }

    @PostMapping("/companies/add")
    public String addCompany(@ModelAttribute Company company, RedirectAttributes redirectAttributes) {
        if (companyRepository.findByEmail(company.getEmail()).isPresent()) {
            redirectAttributes.addFlashAttribute("error", "Email already exists!");
            return "redirect:/admin/companies";
        }
        Role role = roleRepository.findByName("ROLE_COMPANY").orElse(null);
        company.setRole(role);
        company.setActive(true);
        company.setPassword(passwordEncoder.encode("company123")); // Default password
        companyRepository.save(company);
        redirectAttributes.addFlashAttribute("success", "Company added successfully! Default password: company123");
        return "redirect:/admin/companies";
    }

    @PostMapping("/companies/edit/{id}")
    public String editCompany(@PathVariable Long id, @ModelAttribute Company updated, RedirectAttributes redirectAttributes) {
        Company company = companyRepository.findById(id).orElse(null);
        if (company != null) {
            company.setName(updated.getName());
            company.setCompanyName(updated.getCompanyName());
            company.setPhoneNumber(updated.getPhoneNumber());
            company.setIndustry(updated.getIndustry());
            company.setWebsite(updated.getWebsite());
            companyRepository.save(company);
            redirectAttributes.addFlashAttribute("success", "Company updated successfully!");
        }
        return "redirect:/admin/companies";
    }

    @PostMapping("/companies/delete/{id}")
    @Transactional
    public String deleteCompany(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        Company company = companyRepository.findById(id).orElse(null);
        if (company != null) {
            List<Job> jobs = jobRepository.findByCompany(company);
            for (Job job : jobs) {
                jdbcTemplate.update("DELETE FROM ai_analysis WHERE job_id = ?", job.getId());
                List<Application> apps = applicationRepository.findByJobId(job.getId());
                applicationRepository.deleteAll(apps);
            }
            jobRepository.deleteAll(jobs);
            companyRepository.delete(company);
            redirectAttributes.addFlashAttribute("success", "Company deleted successfully!");
        }
        return "redirect:/admin/companies";
    }
    @PostMapping("/profile/picture")
    @ResponseBody
    public org.springframework.http.ResponseEntity<?> updateProfilePicture(@RequestParam("file") org.springframework.web.multipart.MultipartFile file, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Admin user = adminRepository.findById(userDetails.getUser().getId()).orElse(null);
            if (user != null) {
                String imageUrl = fileUploadService.saveProfilePicture(file);
                user.setProfilePicture(imageUrl);
                adminRepository.save(user);
                
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
            Admin admin = adminRepository.findById(userDetails.getUser().getId()).orElse(null);
            if (admin != null) {
                admin.setProfilePicture(null);
                adminRepository.save(admin);
                return org.springframework.http.ResponseEntity.ok().build();
            }
            return org.springframework.http.ResponseEntity.badRequest().body(java.util.Collections.singletonMap("error", "Failed to remove picture"));
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body(java.util.Collections.singletonMap("error", "Server error"));
        }
    }
}
