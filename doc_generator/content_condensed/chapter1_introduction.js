const { p, bullet, chapterHeading, sectionHeading, subSectionHeading } = require('../doc_helper');

function getChapter1() {
    const elements = [];

    elements.push(chapterHeading("1. INTRODUCTION"));

    elements.push(
        p("In tertiary engineering education, campus recruitment represents the definitive bridge connecting academic learning with enterprise employment. Annually, institutions orchestrate placement drives connecting hundreds of recruiters with thousands of engineering candidates. However, conventional campus placement administration remains fundamentally burdened by antiquated, manual processes—spreadsheets, unindexed file folders, and generic submission portals—that obscure student readiness, drain faculty time, and offer no diagnostic feedback to candidates."),
        p("Simultaneously, corporate talent acquisition has evolved into an AI-driven, automated ecosystem where over 90% of Fortune 500 enterprises deploy Applicant Tracking Systems (ATS) to filter candidate pools prior to human review. Consequently, technically competent graduates are routinely disqualified simply because their resumes fail ATS parsing standards, lack critical keywords, or diverge from specific job profiles. Students receive binary outcomes—shortlisted or rejected—without objective guidance on how to remediate their technical deficits."),
        p("To solve this challenge, this project presents the \"Campus Placement Prediction & Skill Gap Analyzer with AI ATS Resume Evaluation and Hiring Companies Portal\". Engineered using Java 21 LTS, Spring Boot 3.3.0, Spring Security 6, MySQL 8.0, and Google Gemini 1.5 Flash via reactive WebClient pipelines, the platform unifies students, recruiters, faculty, and administrators into an integrated ecosystem featuring automated ATS scoring, explicit skill gap identification, and intelligent job matching.")
    );

    elements.push(sectionHeading("1.1 Project Profile"));

    elements.push(subSectionHeading("1.1.1 Context and Motivation"));
    elements.push(
        p("Traditional placement operations rely on disparate spreadsheets and shared cloud drives. This approach creates immense administrative friction, lacks document version control, and forces placement officers to manually verify candidate eligibility against visiting corporate criteria."),
        p("For corporate recruiters, screening hundreds of unformatted resumes produces screening fatigue and inconsistent evaluations. Recruiters strongly benefit from an objective automated screening tier that verifies candidate proficiencies against job descriptions beforehand."),
        p("For students, the absence of real-time diagnostic evaluation is a major obstacle. Candidates invest substantial effort crafting resumes without knowing whether their profile matches 50% or 85% of a job's requirements, nor which specific frameworks they lack. This platform democratizes enterprise-grade ATS evaluation technology, delivering actionable career diagnostics directly to every student prior to formal application.")
    );

    elements.push(subSectionHeading("1.1.2 Problem Statement"));
    elements.push(
        p("The central challenge addressed is: How can an integrated academic web platform utilize Generative AI and modern enterprise Java frameworks to provide real-time ATS resume scoring, precise skill gap diagnostics, and recruitment lifecycle automation while guaranteeing data integrity, role-based security, and high system availability?"),
        p("This challenge encompasses four core engineering objectives:"),
        bullet("Reliable PDF resume ingestion, magic-byte validation, and Apache PDFBox text extraction safeguarding against encoding errors and corrupted uploads.", "1. Document Ingestion:"),
        bullet("Secure orchestration of Google Gemini 1.5 Flash via reactive WebClient to return strictly validated JSON match metrics and tailored guidance.", "2. AI Engine Orchestration:"),
        bullet("State consistency and automatic cache invalidation in MySQL to prevent stale match scores when students upload updated resumes.", "3. Cache Synchronization:"),
        bullet("Multi-tenant Role-Based Access Control (RBAC) across Students, Companies, Faculty, and Administrators using Spring Security 6.", "4. Multi-Role Governance:")
    );

    elements.push(subSectionHeading("1.1.3 Project Scope and Primary Objectives"));
    elements.push(
        p("The platform delivers an end-to-end web application supporting the complete placement lifecycle through seven primary capabilities:"),
        bullet("Role-based authentication via Spring Security 6, BCrypt encryption, and SMTP OTP verification for secure onboarding.", "1. Authentication & Security:"),
        bullet("Dual-redundancy resume storage persisting PDF bytes in MySQL LONGBLOB columns while mirroring files on disk for high availability.", "2. Dual-Redundancy Storage:"),
        bullet("Apache PDFBox text extraction combined with multimodal PDF fallback for resilient document parsing.", "3. Resume Parsing Engine:"),
        bullet("Google Gemini 1.5 Flash integration with a 15-second timeout and heuristic fallback ensuring uninterrupted evaluation.", "4. AI ATS Evaluation:"),
        bullet("AI-Ranked Job Matching ('Jobs For You') that sorts open jobs by suitability with dedicated asynchronous loading states.", "5. Intelligent Matching:"),
        bullet("Interactive Companies Directory displaying verified recruiters and real-time open job vacancy counts.", "6. Companies Explorer:"),
        bullet("Faculty and Administrator dashboards featuring Chart.js analytics for institutional placement oversight.", "7. Governance & Analytics:")
    );

    elements.push(sectionHeading("1.2 Organizational Profile"));

    elements.push(subSectionHeading("1.2.1 Institutional Setting and Placement Cell Mission"));
    elements.push(
        p("The project was developed within an autonomous technical institution where the Training and Placement Cell functions as the central bridge between academic programs and industry recruiters. The Placement Cell's mission is to cultivate corporate partnerships, organize technical training, and conduct recruitment drives that maximize career opportunities across Computer Science and allied engineering disciplines."),
        p("The cell operates under rigorous performance metrics established by national accreditation bodies (such as NBA and NAAC), tracking overall placement rates, median salary packages, top-tier corporate offers, and demographic inclusivity across student cohorts.")
    );

    elements.push(subSectionHeading("1.2.2 Institutional Placement Lifecycle"));
    elements.push(
        p("The annual campus placement process spans five distinct phases across twelve months:"),
        bullet("Phase I (June – July): Student profiling, academic history aggregation, and eligibility verification.", "• Student Profiling:"),
        bullet("Phase II (August – September): Pre-placement technical training, mock coding tests, and soft skills preparation.", "• Training & Upskilling:"),
        bullet("Phase III (October – November): Corporate onboarding, Job Announcement Form (JAF) registration, and job posting.", "• Corporate Onboarding:"),
        bullet("Phase IV (December – March): On-campus recruitment drives, technical assessments, and interview rounds.", "• Recruitment Drives:"),
        bullet("Phase V (April – May): Offer verification, selection analytics reporting, and institutional governance auditing.", "• Final Selection:")
    );

    return elements;
}

module.exports = { getChapter1 };
