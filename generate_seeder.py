import random

companies = [
    "Google", "Microsoft", "Amazon", "Adobe", "Oracle", "IBM", "Infosys", "TCS", 
    "Wipro", "Accenture", "Zoho", "Freshworks", "Cognizant", "Capgemini", "HCL", 
    "Tech Mahindra", "Paytm", "PhonePe", "Swiggy", "Zomato", "NVIDIA", "Intel", 
    "AMD", "Dell", "HP", "Lenovo", "Cisco", "SAP", "Salesforce", "Atlassian", 
    "Figma", "Canva", "Autodesk", "Unity", "Epic Games"
]

roles = [
    "Software Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer",
    "Java Developer", "Python Developer", "React Developer", "Angular Developer",
    "Flutter Developer", "Android Developer", "iOS Developer", "UI Designer",
    "UX Designer", "UI/UX Designer", "Graphic Designer", "Motion Graphics Designer",
    "Video Editor", "3D Artist", "3D Animator", "Game Developer", "Unity Developer",
    "Unreal Engine Developer", "AR/VR Developer", "AI Engineer", "Machine Learning Engineer",
    "Deep Learning Engineer", "Prompt Engineer", "Data Scientist", "Data Analyst",
    "Business Intelligence Analyst", "Cloud Engineer", "AWS Cloud Engineer", "DevOps Engineer",
    "Site Reliability Engineer", "Cyber Security Analyst", "Ethical Hacker", "Penetration Tester",
    "Network Engineer", "Database Administrator", "System Administrator", "QA Engineer",
    "Automation Test Engineer", "Product Designer", "Interior Design Visualization Specialist",
    "CAD Designer", "Web Designer", "SEO Specialist", "Digital Marketing Executive",
    "Technical Support Engineer", "IT Consultant"
]

locations = ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Gurugram", "Noida", "Mumbai", "Kochi", "Remote", "Delhi"]

salaries = ["4 LPA", "6 LPA", "8 LPA", "12 LPA", "18 LPA", "25 LPA", "35 LPA", "45 LPA", "60 LPA"]

skills_pool = [
    "Java", "Python", "C++", "C#", "JavaScript", "TypeScript", "React", "Angular", "Vue.js", "Node.js",
    "Spring Boot", "Django", "Flask", "SQL", "NoSQL", "MongoDB", "PostgreSQL", "AWS", "Azure", "GCP",
    "Docker", "Kubernetes", "Git", "Linux", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
    "Data Analysis", "Tableau", "Power BI", "Figma", "Adobe XD", "Photoshop", "Illustrator", "Unity",
    "Unreal Engine", "Blender", "Maya", "Cyber Security", "Networking", "SEO", "Digital Marketing"
]

job_template = """        Job job{i} = createJob(companies.get({c}), "{role}", "{salary}", "{location}", "{skills}", "{description}");"""

output = []
for i, role in enumerate(roles):
    c_idx = random.randint(0, len(companies) - 1)
    location = random.choice(locations)
    salary = random.choice(salaries)
    
    # Pick 4-6 random skills
    num_skills = random.randint(4, 6)
    job_skills = ", ".join(random.sample(skills_pool, num_skills))
    
    desc = f"We are looking for a highly skilled {role} to join our dynamic team in {location}. You will be responsible for driving innovation and delivering high-quality solutions. Minimum requirements include proficiency in {job_skills}."
    output.append(job_template.format(i=i+1, c=c_idx, role=role, salary=salary, location=location, skills=job_skills, description=desc))

java_code = f"""package com.roshin.placement.util;

import com.roshin.placement.entity.*;
import com.roshin.placement.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DemoDataSeeder implements CommandLineRunner {{

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {{
        // Ensure Roles exist
        Role companyRole = roleRepository.findByName("ROLE_COMPANY").orElseGet(() -> roleRepository.save(new Role("ROLE_COMPANY")));
        Role studentRole = roleRepository.findByName("ROLE_STUDENT").orElseGet(() -> roleRepository.save(new Role("ROLE_STUDENT")));

        if (jobRepository.count() == 50) {{
            System.out.println("50 Jobs already seeded.");
            return;
        }}

        System.out.println("Clearing old jobs and applications...");
        applicationRepository.deleteAll();
        jobRepository.deleteAll();
        
        System.out.println("Seeding 50 Unique Jobs...");

        String defaultPassword = passwordEncoder.encode("password123");

        // 1. Create Companies (HR Users)
        List<String> companyNames = Arrays.asList(
            "Google", "Microsoft", "Amazon", "Adobe", "Oracle", "IBM", "Infosys", "TCS", 
            "Wipro", "Accenture", "Zoho", "Freshworks", "Cognizant", "Capgemini", "HCL", 
            "Tech Mahindra", "Paytm", "PhonePe", "Swiggy", "Zomato", "NVIDIA", "Intel", 
            "AMD", "Dell", "HP", "Lenovo", "Cisco", "SAP", "Salesforce", "Atlassian", 
            "Figma", "Canva", "Autodesk", "Unity", "Epic Games"
        );

        List<Company> companies = new ArrayList<>();
        for (String cName : companyNames) {{
            String email = cName.toLowerCase().replace(" ", "") + "@example.com";
            Company c = companyRepository.findByEmail(email).orElse(null);
            if (c == null) {{
                c = createCompany(cName, cName + " HR", email, "HR Manager", "Technology", "Global", "https://www." + cName.toLowerCase().replace(" ", "") + ".com", defaultPassword, companyRole);
            }}
            companies.add(c);
        }}

        // 3. Create Sample Students
        if (studentRepository.count() == 0) {{
            List<Student> students = Arrays.asList(
                createStudent("Arjun Patel", "arjun@gmail.com", "MCA", "2024", 8.2, "Computer Science", "Java, Python, Spring Boot, React", defaultPassword, studentRole),
                createStudent("Riya Sharma", "riya@gmail.com", "BCA", "2024", 7.5, "Information Technology", "HTML, CSS, JavaScript, Node.js", defaultPassword, studentRole),
                createStudent("Vikram Singh", "vikram@gmail.com", "B.Tech", "2024", 6.8, "Computer Science", "Python, Machine Learning, SQL", defaultPassword, studentRole),
                createStudent("Ananya Desai", "ananya@gmail.com", "MCA", "2024", 9.1, "Data Science", "Python, TensorFlow, Pandas, SQL", defaultPassword, studentRole),
                createStudent("Rohit Verma", "rohit@gmail.com", "B.Tech", "2024", 7.2, "Information Technology", "Java, C++, MySQL", defaultPassword, studentRole),
                createStudent("Sneha Gupta", "sneha@gmail.com", "MCA", "2024", 8.5, "Computer Applications", "React, Tailwind, HTML, JS", defaultPassword, studentRole)
            );
        }}

        // 2. Create 50 Job Postings
{chr(10).join(output)}

        System.out.println("50 Jobs Seeded Successfully!");
    }}

    private Company createCompany(String companyName, String hrName, String email, String designation, String industry, String location, String website, String password, Role role) {{
        Company company = new Company();
        company.setCompanyName(companyName);
        company.setName(hrName);
        company.setEmail(email);
        company.setAddress(location);
        company.setIndustry(industry);
        company.setWebsite(website);
        company.setPassword(password);
        company.setRole(role);
        company.setActive(true);
        company.setApproved(true);
        company.setCompanyDescription("HR Designation: " + designation);
        return companyRepository.save(company);
    }}

    private Job createJob(Company company, String title, String salary, String location, String skills, String desc) {{
        Job job = new Job();
        job.setCompany(company);
        job.setJobTitle(title);
        job.setPackageOffered(salary);
        job.setLocation(location);
        job.setRequiredSkills(skills);
        job.setJobDescription(desc);
        job.setActive(true);
        job.setCreatedAt(LocalDateTime.now().minusDays((long)(Math.random() * 10)));
        return jobRepository.save(job);
    }}

    private Student createStudent(String name, String email, String course, String passingYear, Double cgpa, String department, String skills, String password, Role role) {{
        Student student = new Student();
        student.setName(name);
        student.setEmail(email);
        student.setCourse(course);
        student.setPassingYear(passingYear);
        student.setCgpa(cgpa);
        student.setDepartment(department);
        student.setTechnicalSkills(skills);
        student.setPassword(password);
        student.setRole(role);
        student.setActive(true);
        student.setPhoneNumber("9876543210");
        return studentRepository.save(student);
    }}
}}
"""

with open(r"C:\1 . project\Placement Prediction\src\main\java\com\roshin\placement\util\DemoDataSeeder.java", "w", encoding="utf-8") as f:
    f.write(java_code)
