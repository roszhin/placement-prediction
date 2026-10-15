package com.roshin.placement.util;

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
public class DemoDataSeeder implements CommandLineRunner {

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
    private AiAnalysisRepository aiAnalysisRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Ensure Roles exist
        Role companyRole = roleRepository.findByName("ROLE_COMPANY").orElseGet(() -> roleRepository.save(new Role("ROLE_COMPANY")));
        Role studentRole = roleRepository.findByName("ROLE_STUDENT").orElseGet(() -> roleRepository.save(new Role("ROLE_STUDENT")));

        String defaultPassword = passwordEncoder.encode("password123");
        ensureDemoStudent("Arjun Patel", "arjun@gmail.com", "MCA", "2024", 8.2, "Computer Science", "Java, Python, Spring Boot, React", defaultPassword, studentRole);
        ensureDemoStudent("Riya Sharma", "riya@gmail.com", "BCA", "2024", 7.5, "Information Technology", "HTML, CSS, JavaScript, Node.js", defaultPassword, studentRole);
        ensureDemoStudent("Vikram Singh", "vikram@gmail.com", "B.Tech", "2024", 6.8, "Computer Science", "Python, Machine Learning, SQL", defaultPassword, studentRole);
        ensureDemoStudent("Ananya Desai", "ananya@gmail.com", "MCA", "2024", 9.1, "Data Science", "Python, TensorFlow, Pandas, SQL", defaultPassword, studentRole);
        ensureDemoStudent("Rohit Verma", "rohit@gmail.com", "B.Tech", "2024", 7.2, "Information Technology", "Java, C++, MySQL", defaultPassword, studentRole);
        ensureDemoStudent("Sneha Gupta", "sneha@gmail.com", "MCA", "2024", 8.5, "Computer Applications", "React, Tailwind, HTML, JS", defaultPassword, studentRole);

        if (jobRepository.count() > 0) {
            System.out.println("Demo students ensured. Database already contains jobs, skipping sample job seeding.");
            return;
        }

        System.out.println("Seeding 50 Unique Jobs...");

        String companyPassword = passwordEncoder.encode("company123");

        // 1. Create Companies (HR Users)
        List<String> companyNames = Arrays.asList(
            "Google", "Microsoft", "Amazon", "Adobe", "Oracle", "IBM", "Infosys", "TCS", 
            "Wipro", "Accenture", "Zoho", "Freshworks", "Cognizant", "Capgemini", "HCL", 
            "Tech Mahindra", "Paytm", "PhonePe", "Swiggy", "Zomato", "NVIDIA", "Intel", 
            "AMD", "Dell", "HP", "Lenovo", "Cisco", "SAP", "Salesforce", "Atlassian", 
            "Figma", "Canva", "Autodesk", "Unity", "Epic Games"
        );

        List<Company> companies = new ArrayList<>();
        for (String cName : companyNames) {
            String email = cName.toLowerCase().replace(" ", "") + "@example.com";
            Company c = companyRepository.findByEmail(email).orElse(null);
            if (c == null) {
                c = createCompany(cName, cName + " HR", email, "HR Manager", "Technology", "Global", "https://www." + cName.toLowerCase().replace(" ", "") + ".com", companyPassword, companyRole);
            }
            companies.add(c);
        }

        // 3. Create Specific Google HR user and 5 jobs
        Company googleCompany = companyRepository.findByEmail("careers@google.com").orElse(null);
        if (googleCompany == null) {
            googleCompany = createCompany("Google", "Google HR", "careers@google.com", "HR Manager", "Technology", "Bengaluru", "https://www.google.com", defaultPassword, companyRole);
        }
        
        List<Job> existingGoogleJobs = jobRepository.findByCompany(googleCompany);
        
        if (existingGoogleJobs.stream().noneMatch(j -> j.getJobTitle().equals("Backend Java Developer"))) {
            Job j = createJob(googleCompany, "Backend Java Developer", "18 LPA", "Bengaluru", "Java, Spring Boot, REST API, MySQL, Git", "We are looking for a Backend Java Developer.");
            j.setEligibilityCriteria("1-3 Years");
            jobRepository.save(j);
        }
        if (existingGoogleJobs.stream().noneMatch(j -> j.getJobTitle().equals("Frontend React Developer"))) {
            Job j = createJob(googleCompany, "Frontend React Developer", "16 LPA", "Hyderabad", "React, JavaScript, HTML, CSS, TypeScript", "We are looking for a Frontend React Developer.");
            j.setEligibilityCriteria("0-2 Years");
            jobRepository.save(j);
        }
        if (existingGoogleJobs.stream().noneMatch(j -> j.getJobTitle().equals("AI / Machine Learning Engineer"))) {
            Job j = createJob(googleCompany, "AI / Machine Learning Engineer", "24 LPA", "Bengaluru", "Python, TensorFlow, PyTorch, Machine Learning, Deep Learning", "We are looking for an AI/ML Engineer.");
            j.setEligibilityCriteria("2+ Years");
            jobRepository.save(j);
        }
        if (existingGoogleJobs.stream().noneMatch(j -> j.getJobTitle().equals("Cloud DevOps Engineer"))) {
            Job j = createJob(googleCompany, "Cloud DevOps Engineer", "20 LPA", "Pune", "AWS, Docker, Kubernetes, Jenkins, Linux", "We are looking for a Cloud DevOps Engineer.");
            j.setEligibilityCriteria("2 Years");
            jobRepository.save(j);
        }
        if (existingGoogleJobs.stream().noneMatch(j -> j.getJobTitle().equals("Cyber Security Analyst"))) {
            Job j = createJob(googleCompany, "Cyber Security Analyst", "17 LPA", "Noida", "Network Security, SIEM, Ethical Hacking, SOC, Linux", "We are looking for a Cyber Security Analyst.");
            j.setEligibilityCriteria("1-3 Years");
            jobRepository.save(j);
        }

        // 4. Create 50 Random Job Postings
        createJob(companies.get(0 % companies.size()), "Software Engineer", "12 LPA", "Bengaluru", "Java, Spring Boot, React, SQL", "We are looking for a highly skilled Software Engineer to join our dynamic team in Bengaluru. You will be responsible for driving innovation and delivering high-quality solutions.");
        createJob(companies.get(1 % companies.size()), "Backend Developer", "8 LPA", "Hyderabad", "Python, Django, PostgreSQL, Docker", "Looking for a Backend Developer to build scalable systems in Hyderabad. Required skills include Python and Django.");
        createJob(companies.get(2 % companies.size()), "Frontend Developer", "6 LPA", "Pune", "HTML, CSS, JavaScript, Vue.js", "Join our Pune team as a Frontend Developer. You will create highly responsive web applications.");
        createJob(companies.get(3 % companies.size()), "Full Stack Developer", "18 LPA", "Chennai", "TypeScript, Node.js, React, MongoDB", "Exciting opportunity for a Full Stack Developer in Chennai working with cutting edge MERN stack.");
        createJob(companies.get(4 % companies.size()), "Java Developer", "8 LPA", "Gurugram", "Java, Spring Boot, Microservices", "We need a strong Java Developer to work on enterprise microservices in Gurugram.");
        createJob(companies.get(5 % companies.size()), "Python Developer", "12 LPA", "Noida", "Python, Flask, AWS, Kubernetes", "Join us as a Python Developer in Noida. Experience with cloud infrastructure is highly preferred.");
        createJob(companies.get(6 % companies.size()), "React Developer", "25 LPA", "Mumbai", "React, Redux, JavaScript, CSS", "Seeking a highly experienced React Developer in Mumbai to lead our frontend architecture.");
        createJob(companies.get(7 % companies.size()), "Angular Developer", "6 LPA", "Kochi", "Angular, TypeScript, HTML, SCSS", "Looking for an Angular Developer to join our rapidly growing team in Kochi.");
        createJob(companies.get(8 % companies.size()), "Flutter Developer", "8 LPA", "Remote", "Flutter, Dart, Firebase", "Remote Flutter Developer needed to build high performance cross-platform mobile apps.");
        createJob(companies.get(9 % companies.size()), "Android Developer", "12 LPA", "Delhi", "Kotlin, Android Studio, Java", "Join our mobile team in Delhi as a Senior Android Developer.");
        createJob(companies.get(10 % companies.size()), "iOS Developer", "18 LPA", "Bengaluru", "Swift, Objective-C, Xcode", "We are hiring an iOS Developer in Bengaluru to create world-class Apple applications.");
        createJob(companies.get(11 % companies.size()), "UI Designer", "4 LPA", "Hyderabad", "Figma, Sketch, Adobe XD", "Creative UI Designer wanted in Hyderabad to craft stunning digital experiences.");
        createJob(companies.get(12 % companies.size()), "UX Designer", "6 LPA", "Pune", "UX Research, Wireframing, Prototyping", "Join us as a UX Designer in Pune to enhance user journeys and digital interactions.");
        createJob(companies.get(13 % companies.size()), "UI/UX Designer", "8 LPA", "Chennai", "Figma, Adobe XD, Photoshop", "Talented UI/UX Designer needed in Chennai for an exciting SaaS product.");
        createJob(companies.get(14 % companies.size()), "Graphic Designer", "4 LPA", "Gurugram", "Photoshop, Illustrator, InDesign", "Graphic Designer wanted in Gurugram to create marketing and brand materials.");
        createJob(companies.get(15 % companies.size()), "Motion Graphics Designer", "6 LPA", "Noida", "After Effects, Premiere Pro, Animation", "We are looking for a Motion Graphics Designer to join our video production team in Noida.");
        createJob(companies.get(16 % companies.size()), "Video Editor", "4 LPA", "Mumbai", "Premiere Pro, Final Cut Pro", "Video Editor needed in Mumbai to produce high quality content for digital platforms.");
        createJob(companies.get(17 % companies.size()), "3D Artist", "8 LPA", "Kochi", "Blender, Maya, ZBrush", "Looking for a 3D Artist in Kochi to create stunning visual assets for our games.");
        createJob(companies.get(18 % companies.size()), "3D Animator", "12 LPA", "Remote", "Maya, Animation, Rigging", "Remote 3D Animator needed for a fast-paced multimedia studio.");
        createJob(companies.get(19 % companies.size()), "Game Developer", "18 LPA", "Delhi", "Unity, C#, Game Design", "We are hiring a Game Developer in Delhi to build next-generation interactive experiences.");
        createJob(companies.get(20 % companies.size()), "Unity Developer", "25 LPA", "Bengaluru", "Unity, C#, 3D Math", "Senior Unity Developer needed in Bengaluru for an ambitious AR project.");
        createJob(companies.get(21 % companies.size()), "Unreal Engine Developer", "35 LPA", "Hyderabad", "Unreal Engine, C++, Blueprints", "Join our AAA studio in Hyderabad as an Unreal Engine Developer.");
        createJob(companies.get(22 % companies.size()), "AR/VR Developer", "45 LPA", "Pune", "ARCore, ARKit, Unity", "We are seeking a highly skilled AR/VR Developer in Pune to build immersive simulations.");
        createJob(companies.get(23 % companies.size()), "AI Engineer", "60 LPA", "Chennai", "Python, TensorFlow, NLP", "Lead AI Engineer role in Chennai working on large language models.");
        createJob(companies.get(24 % companies.size()), "Machine Learning Engineer", "35 LPA", "Gurugram", "Python, Scikit-learn, PyTorch", "We are looking for a Machine Learning Engineer in Gurugram to build predictive models.");
        createJob(companies.get(25 % companies.size()), "Deep Learning Engineer", "45 LPA", "Noida", "Deep Learning, PyTorch, Computer Vision", "Deep Learning Engineer wanted in Noida for advanced image recognition projects.");
        createJob(companies.get(26 % companies.size()), "Prompt Engineer", "12 LPA", "Mumbai", "Generative AI, ChatGPT, Prompting", "Prompt Engineer needed in Mumbai to optimize AI interactions for our enterprise products.");
        createJob(companies.get(27 % companies.size()), "Data Scientist", "25 LPA", "Kochi", "Data Science, Python, R, SQL", "Join our analytics team in Kochi as a Data Scientist.");
        createJob(companies.get(28 % companies.size()), "Data Analyst", "8 LPA", "Remote", "SQL, Excel, Tableau", "Remote Data Analyst needed to uncover insights from our massive datasets.");
        createJob(companies.get(29 % companies.size()), "Business Intelligence Analyst", "12 LPA", "Delhi", "Power BI, SQL, Data Warehousing", "Business Intelligence Analyst wanted in Delhi to drive data-driven decision making.");
        createJob(companies.get(30 % companies.size()), "Cloud Engineer", "18 LPA", "Bengaluru", "AWS, Azure, Terraform", "We are hiring a Cloud Engineer in Bengaluru to manage our expanding infrastructure.");
        createJob(companies.get(31 % companies.size()), "AWS Cloud Engineer", "25 LPA", "Hyderabad", "AWS, EC2, S3, CloudFormation", "Seeking an AWS Cloud Engineer in Hyderabad with expertise in serverless architectures.");
        createJob(companies.get(32 % companies.size()), "DevOps Engineer", "35 LPA", "Pune", "Docker, Kubernetes, CI/CD", "DevOps Engineer needed in Pune to streamline our software delivery pipeline.");
        createJob(companies.get(33 % companies.size()), "Site Reliability Engineer", "45 LPA", "Chennai", "Linux, Kubernetes, Monitoring", "Site Reliability Engineer wanted in Chennai to ensure 99.99% uptime of our systems.");
        createJob(companies.get(34 % companies.size()), "Cyber Security Analyst", "18 LPA", "Gurugram", "Security, Network, Penetration Testing", "We are looking for a Cyber Security Analyst in Gurugram to protect our enterprise networks.");
        createJob(companies.get(35 % companies.size()), "Ethical Hacker", "25 LPA", "Noida", "Ethical Hacking, Security, Linux", "Join us as an Ethical Hacker in Noida to identify and patch system vulnerabilities.");
        createJob(companies.get(36 % companies.size()), "Penetration Tester", "35 LPA", "Mumbai", "Penetration Testing, OWASP, Metasploit", "Penetration Tester needed in Mumbai for rigorous application security testing.");
        createJob(companies.get(37 % companies.size()), "Network Engineer", "12 LPA", "Kochi", "CCNA, Networking, Cisco", "Network Engineer wanted in Kochi to maintain and upgrade our regional network infrastructure.");
        createJob(companies.get(38 % companies.size()), "Database Administrator", "18 LPA", "Remote", "MySQL, Oracle, Database Tuning", "Remote Database Administrator needed for database optimization and maintenance.");
        createJob(companies.get(39 % companies.size()), "System Administrator", "8 LPA", "Delhi", "Windows Server, Active Directory", "We are hiring a System Administrator in Delhi to support our internal IT operations.");
        createJob(companies.get(40 % companies.size()), "QA Engineer", "6 LPA", "Bengaluru", "Manual Testing, JIRA, SQL", "QA Engineer needed in Bengaluru to ensure the highest quality of our web applications.");
        createJob(companies.get(41 % companies.size()), "Automation Test Engineer", "12 LPA", "Hyderabad", "Selenium, Java, TestNG", "Automation Test Engineer wanted in Hyderabad to build robust automated test suites.");
        createJob(companies.get(42 % companies.size()), "Product Designer", "18 LPA", "Pune", "Product Design, Figma, User Research", "Seeking a Product Designer in Pune to shape the future of our digital products.");
        createJob(companies.get(43 % companies.size()), "Interior Design Visualization Specialist", "8 LPA", "Chennai", "3ds Max, V-Ray, AutoCAD", "Interior Design Visualization Specialist needed in Chennai for architectural renderings.");
        createJob(companies.get(44 % companies.size()), "CAD Designer", "6 LPA", "Gurugram", "AutoCAD, SolidWorks", "We are looking for a CAD Designer in Gurugram with excellent mechanical drafting skills.");
        createJob(companies.get(45 % companies.size()), "Web Designer", "4 LPA", "Noida", "HTML, CSS, Web Design", "Web Designer wanted in Noida to create visually appealing and responsive websites.");
        createJob(companies.get(46 % companies.size()), "SEO Specialist", "6 LPA", "Mumbai", "SEO, Google Analytics, Content Marketing", "SEO Specialist needed in Mumbai to drive organic traffic and optimize digital presence.");
        createJob(companies.get(47 % companies.size()), "Digital Marketing Executive", "4 LPA", "Kochi", "Digital Marketing, Social Media", "We are hiring a Digital Marketing Executive in Kochi to manage our online campaigns.");
        createJob(companies.get(48 % companies.size()), "Technical Support Engineer", "4 LPA", "Remote", "Troubleshooting, Customer Support, IT", "Remote Technical Support Engineer needed to assist our global client base.");
        createJob(companies.get(49 % companies.size()), "IT Consultant", "25 LPA", "Delhi", "IT Strategy, Consulting, Cloud", "IT Consultant wanted in Delhi to advise enterprise clients on digital transformation.");

        System.out.println("50 Jobs Seeded Successfully!");
    }

    private Company createCompany(String companyName, String hrName, String email, String designation, String industry, String location, String website, String password, Role role) {
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
    }

    private Job createJob(Company company, String title, String salary, String location, String skills, String desc) {
        Job job = new Job();
        job.setCompany(company);
        job.setJobTitle(title);
        job.setPackageOffered(salary);
        job.setLocation(location);
        job.setRequiredSkills(skills);
        job.setJobDescription(desc);
        
        // Parse salary to Integer for new salaryLpa field if possible
        try {
            String salaryNumStr = salary.replaceAll("[^0-9]", "");
            if(!salaryNumStr.isEmpty()) {
                job.setSalaryLpa(Integer.parseInt(salaryNumStr));
            } else {
                job.setSalaryLpa(0);
            }
        } catch(Exception e) {
            job.setSalaryLpa(0);
        }
        
        // Default new fields to prevent nulls in AI calculations
        job.setDepartment("Software Development");
        job.setEmploymentType("Full Time");
        job.setWorkMode("Hybrid");
        job.setExperienceRequirement("1+ Years");
        job.setMinimumQualification("B.Tech");
        job.setMinimumCgpa(6.5);
        job.setPreferredSkills(skills); // duplicate for now
        job.setResponsibilities("Develop, test, and deploy applications. Collaborate with cross-functional teams.");
        job.setVacancies(5);
        
        job.setActive(true);
        job.setCreatedAt(LocalDateTime.now().minusDays((long)(Math.random() * 10)));
        return jobRepository.save(job);
    }

    private Student createStudent(String name, String email, String course, String passingYear, Double cgpa, String department, String skills, String password, Role role) {
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
    }

    private void ensureDemoStudent(String name, String email, String course, String passingYear, Double cgpa, String department, String skills, String password, Role role) {
        Student student = studentRepository.findByEmail(email)
                .orElseGet(() -> createStudent(name, email, course, passingYear, cgpa, department, skills, password, role));
        student.setPassword(password);
        student.setRole(role);
        student.setActive(true);
        studentRepository.save(student);
    }
}
