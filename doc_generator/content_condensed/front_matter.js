const { Paragraph, TextRun, AlignmentType } = require('docx');
const { p, pMulti, chapterHeading, sectionHeading, table } = require('../doc_helper');

const FONT_FAMILY = "Times New Roman";

function getFrontMatter(pageMap = {}) {
    const elements = [];

    const getP = (key, fallback) => pageMap[key] || fallback;

    // ==========================================
    // 1. TITLE PAGE
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 140 },
            children: [
                new TextRun({
                    text: "CAMPUS PLACEMENT PREDICTION & SKILL GAP ANALYZER WITH AI ATS RESUME EVALUATION AND HIRING COMPANIES PORTAL",
                    font: FONT_FAMILY,
                    size: 32, // 16pt
                    bold: true,
                    color: "0F172A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
            children: [
                new TextRun({
                    text: "A PROJECT REPORT",
                    font: FONT_FAMILY,
                    size: 26, // 13pt
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
                new TextRun({
                    text: "Submitted in partial fulfillment of the requirements for the award of the degree of",
                    font: FONT_FAMILY,
                    size: 22,
                    italics: true,
                    color: "334155"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 160 },
            children: [
                new TextRun({
                    text: "BACHELOR OF TECHNOLOGY / BACHELOR OF ENGINEERING\nIN\nCOMPUTER SCIENCE AND ENGINEERING",
                    font: FONT_FAMILY,
                    size: 24,
                    bold: true,
                    color: "0F172A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 140, after: 60 },
            children: [
                new TextRun({
                    text: "Submitted by:",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
                new TextRun({
                    text: "[STUDENT NAME: ____________________________________]",
                    font: FONT_FAMILY,
                    size: 24,
                    bold: true,
                    color: "0F172A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 200 },
            children: [
                new TextRun({
                    text: "[REGISTER NUMBER: ____________________________________]",
                    font: FONT_FAMILY,
                    size: 24,
                    bold: true,
                    color: "0F172A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 60 },
            children: [
                new TextRun({
                    text: "Under the Guidance of:",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
                new TextRun({
                    text: "[INTERNAL GUIDE NAME: ____________________________________]",
                    font: FONT_FAMILY,
                    size: 24,
                    bold: true,
                    color: "0F172A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 260 },
            children: [
                new TextRun({
                    text: "[GUIDE DESIGNATION & DEPARTMENT: __________________________]",
                    font: FONT_FAMILY,
                    size: 20,
                    italics: true,
                    color: "334155"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 60 },
            children: [
                new TextRun({
                    text: "DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING",
                    font: FONT_FAMILY,
                    size: 26,
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
                new TextRun({
                    text: "[COLLEGE / INSTITUTION NAME]",
                    font: FONT_FAMILY,
                    size: 28,
                    bold: true,
                    color: "0F172A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
                new TextRun({
                    text: "[AFFILIATED UNIVERSITY / AUTONOMOUS BODY]",
                    font: FONT_FAMILY,
                    size: 20,
                    color: "475569"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 0 },
            children: [
                new TextRun({
                    text: "APRIL / MAY 2026",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        })
    );

    // ==========================================
    // 2. BONAFIDE CERTIFICATE
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 200, after: 180 },
            children: [
                new TextRun({
                    text: "BONAFIDE CERTIFICATE",
                    font: FONT_FAMILY,
                    size: 28,
                    bold: true,
                    underline: {},
                    color: "0F172A"
                })
            ]
        }),
        p("This is to certify that the project report entitled \"CAMPUS PLACEMENT PREDICTION & SKILL GAP ANALYZER WITH AI ATS RESUME EVALUATION AND HIRING COMPANIES PORTAL\" is a bonafide record of the independent project work carried out by [STUDENT NAME] (Register Number: [REGISTER NUMBER]), under my supervision and guidance, in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology / Bachelor of Engineering in Computer Science and Engineering during the academic year 2025 – 2026."),
        p("The work documented in this report is authentic, original, and has not been submitted elsewhere in part or full for the award of any other degree, diploma, fellowship, or professional title."),
        new Paragraph({ spacing: { before: 360 } }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 100 },
            children: [
                new TextRun({
                    text: "Internal Guide Signature: ______________________          Head of Department: ______________________\n\nName: [Guide Name]                                                   Name: [HOD Name]\nDesignation: [Guide Designation]                               Department: Computer Science and Engg.\nDate: ________________________                                     Date: ________________________",
                    font: FONT_FAMILY,
                    size: 22,
                    color: "1E293B"
                })
            ]
        }),
        new Paragraph({ spacing: { before: 260 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 140, after: 80 },
            children: [
                new TextRun({
                    text: "Submitted for the Project Viva-Voce Examination held on: ________________________",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "334155"
                })
            ]
        }),
        new Paragraph({ spacing: { before: 200 } }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 100 },
            children: [
                new TextRun({
                    text: "Internal Examiner: ___________________________          External Examiner: ___________________________",
                    font: FONT_FAMILY,
                    size: 22,
                    color: "1E293B"
                })
            ]
        })
    );

    // ==========================================
    // 3. DECLARATION PAGE
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 200, after: 180 },
            children: [
                new TextRun({
                    text: "DECLARATION",
                    font: FONT_FAMILY,
                    size: 28,
                    bold: true,
                    underline: {},
                    color: "0F172A"
                })
            ]
        }),
        p("I hereby declare that the project report entitled \"CAMPUS PLACEMENT PREDICTION & SKILL GAP ANALYZER WITH AI ATS RESUME EVALUATION AND HIRING COMPANIES PORTAL\" submitted to the Department of Computer Science and Engineering, [College / Institution Name], affiliated to [Affiliated University], is an authentic record of the original project work independently planned, designed, implemented, and tested by me under the expert guidance of [Guide Name], [Guide Designation], Department of Computer Science and Engineering."),
        p("I further declare that this report represents my own intellectual work, that all external sources, libraries, frameworks (including Spring Boot, Google Gemini AI API, Apache PDFBox, and MySQL), and research publications cited have been duly acknowledged in the Bibliography, and that this report has not been submitted previously for any academic qualification."),
        new Paragraph({ spacing: { before: 140 } }),
        p("Place: ________________________\nDate:  ________________________"),
        new Paragraph({ spacing: { before: 260 } }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { line: 360, after: 100 },
            children: [
                new TextRun({
                    text: "Signature of the Candidate: _______________________\n[STUDENT NAME]\nRegister No: [REGISTER NUMBER]",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "1E293B"
                })
            ]
        })
    );

    // ==========================================
    // 4. ACKNOWLEDGEMENT PAGE
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 200, after: 180 },
            children: [
                new TextRun({
                    text: "ACKNOWLEDGEMENT",
                    font: FONT_FAMILY,
                    size: 28,
                    bold: true,
                    underline: {},
                    color: "0F172A"
                })
            ]
        }),
        p("The completion of this academic project would be incomplete without expressing gratitude to all those who offered guidance, encouragement, and support throughout this endeavor."),
        p("First and foremost, I thank Almighty God for granting me the wisdom, health, and perseverance necessary to successfully complete this project."),
        p("I convey my profound gratitude to our respected Management, Principal [Principal Name], and Head of the Department [HOD Name], Department of Computer Science and Engineering, for their visionary leadership, institutional facilities, and administrative encouragement."),
        p("I express my deepest gratitude to my respected Project Guide, [Guide Name], [Guide Designation], Department of Computer Science and Engineering, for invaluable mentorship, constructive critique, patient guidance, and technical insights throughout the design and implementation phases."),
        p("I also extend my sincere appreciation to the faculty members, technical staff, and Placement Cell coordinators who provided practical domain perspectives regarding recruitment workflows and applicant tracking systems."),
        p("Finally, I extend my heartfelt thanks to my parents, family members, and peers for their continuous moral support and encouragement throughout my academic journey."),
        new Paragraph({ spacing: { before: 300 } }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { line: 360, after: 80 },
            children: [
                new TextRun({
                    text: "[STUDENT NAME]\n(Register No: [REGISTER NUMBER])",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "1E293B"
                })
            ]
        })
    );

    // ==========================================
    // 5. ABSTRACT PAGE
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 200, after: 160 },
            children: [
                new TextRun({
                    text: "ABSTRACT",
                    font: FONT_FAMILY,
                    size: 28,
                    bold: true,
                    underline: {},
                    color: "0F172A"
                })
            ]
        }),
        p("In higher education institutions, campus placement administration serves as the critical bridge connecting academic achievement with corporate employment. However, conventional placement operations remain burdened by fragmented manual procedures: placement cells collect unindexed resume files via email, recruiters are overwhelmed by hundreds of mismatched candidate profiles, and students receive binary application outcomes without constructive feedback regarding their technical deficiencies, ATS compatibility, or missing skills."),
        p("To resolve these challenges, this project presents the architectural design and full-stack engineering of the \"Campus Placement Prediction & Skill Gap Analyzer with AI ATS Resume Evaluation and Hiring Companies Portal\". Engineered on Java 21 LTS and Spring Boot 3.3.0, the platform integrates Google Gemini 1.5 Flash through reactive Spring WebClient pipelines. Resumes uploaded in PDF format are ingested via dual storage redundancy—persisting binary payloads securely within MySQL 8.0 LONGBLOB structures while mirroring files on disk. Resumes are parsed using Apache PDFBox 3.0.2 and submitted alongside corporate job specifications to Gemini 1.5 Flash. The AI engine computes an objective ATS match percentage (0–100%), extracts matched vs. missing skills, and delivers tailored interview advice in validated JSON format."),
        p("The platform features an AI-Ranked Job Matching engine (\"Jobs For You\") with asynchronous loading states, an interactive Companies Directory with live open job indicators, Spring Security 6 role-based governance with BCrypt encryption, JavaMailSender SMTP OTP verification, and responsive Bootstrap 5.3 and Chart.js dashboards. Comprehensive testing validates that the platform eliminates manual screening bottlenecks, maintains 100% data integrity, prevents stale AI cache anomalies, and provides automated, transparent career readiness guidance."),
        p("Keywords: Campus Placement Prediction, AI ATS Resume Parsing, Google Gemini 1.5 Flash, Spring Boot 3.3.0, Java 21, Apache PDFBox, Skill Gap Analyzer, Thymeleaf, Spring Security, MySQL 8.0.")
    );

    // ==========================================
    // 6. TABLE OF CONTENTS
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 200, after: 160 },
            children: [
                new TextRun({
                    text: "TABLE OF CONTENTS",
                    font: FONT_FAMILY,
                    size: 28,
                    bold: true,
                    underline: {},
                    color: "0F172A"
                })
            ]
        })
    );

    const tocHeaders = ["Chapter No.", "Title", "Page No."];
    const tocRows = [
        ["", "BONAFIDE CERTIFICATE", "ii"],
        ["", "DECLARATION", "iii"],
        ["", "ACKNOWLEDGEMENT", "iv"],
        ["", "ABSTRACT", "v"],
        ["", "LIST OF FIGURES AND TABLES", "vii"],
        ["1", "INTRODUCTION", "8"],
        ["", "1.1 Project Profile", "8"],
        ["", "1.2 Organizational Profile", "10"],
        ["2", "SYSTEM STUDY", "11"],
        ["", "2.1 Existing System & Drawbacks", "11"],
        ["", "2.2 Proposed System & Advantages", "12"],
        ["3", "SYSTEM DESCRIPTION", "15"],
        ["", "3.1 Hardware Description", "15"],
        ["", "3.2 Software Description", "16"],
        ["", "3.3 Project Architecture and Implementation", "16"],
        ["4", "SYSTEM ANALYSIS", "20"],
        ["", "4.1 Requirement Determination", "20"],
        ["", "4.2 Functional Requirements", "20"],
        ["", "4.3 Non-Functional Requirements", "21"],
        ["", "4.4 Feasibility Study", "22"],
        ["", "4.5 System Modules", "22"],
        ["5", "SYSTEM DESIGN", "24"],
        ["", "5.1 System Flow Chart", "24"],
        ["", "5.2 Data Flow Diagrams (Level 0 – Level 3)", "25"],
        ["", "5.3 Entity Relationship Diagram", "28"],
        ["", "5.4 Input Design", "29"],
        ["", "5.5 Database Design (All 11 Entities)", "30"],
        ["", "5.6 Output Design", "34"],
        ["6", "SYSTEM TESTING", "36"],
        ["", "6.1 Testing Methodology and Objectives", "36"],
        ["", "6.2 Test Cases and Verification Results", "36"],
        ["7", "SYSTEM IMPLEMENTATION", "39"],
        ["", "7.1 Deployment Environment and Configuration", "39"],
        ["", "7.2 Operational Challenges and Bugs Resolved", "40"],
        ["8", "CONCLUSION", "43"],
        ["", "8.1 Summary of Completed Work", "43"],
        ["", "8.2 Lessons Learned and Engineering Takeaways", "44"],
        ["9", "FUTURE ENHANCEMENT", "46"],
        ["", "9.1 Functional and Architectural Roadmap", "46"],
        ["10", "BIBLIOGRAPHY", "49"]
    ];

    elements.push(...table(
        tocHeaders,
        tocRows,
        [15, 70, 15],
        ""
    ));

    // ==========================================
    // 7. LIST OF FIGURES AND LIST OF TABLES
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 200, after: 140 },
            children: [
                new TextRun({
                    text: "LIST OF FIGURES AND TABLES",
                    font: FONT_FAMILY,
                    size: 26,
                    bold: true,
                    underline: {},
                    color: "0F172A"
                })
            ]
        })
    );

    const figListHeaders = ["Figure / Table No.", "Title", "Page No."];
    const figListRows = [
        ["Figure 3.1", "3-Tier MVC Architecture with Gemini AI Integration", "17"],
        ["Figure 5.1", "End-to-End Placement System Flow Chart", "24"],
        ["Figure 5.2", "Data Flow Diagram: Level-0 Context Diagram", "26"],
        ["Figure 5.3", "Data Flow Diagram: Level-1 Overview Decomposition", "27"],
        ["Figure 5.4", "Data Flow Diagram: Level-2 AI ATS Evaluation Subsystem", "27"],
        ["Figure 5.5", "Data Flow Diagram: Level-3 Recruiter Lifecycle Subsystem", "28"],
        ["Figure 5.6", "Entity-Relationship (ER) Diagram", "29"],
        ["Table 2.1", "Comparative Analysis of Existing vs. Proposed System", "14"],
        ["Table 3.1", "Development Hardware Environment Specifications", "15"],
        ["Table 3.2", "Production Server Infrastructure Sizing", "16"],
        ["Table 3.3", "Software Environment and Technology Stack", "16"],
        ["Table 4.1", "Functional Requirements Matrix", "21"],
        ["Table 4.2", "Non-Functional Requirements Matrix", "22"],
        ["Table 4.3", "Five-Dimensional Feasibility Study Matrix", "22"],
        ["Table 4.4", "Subsystem Architectural Decomposition Matrix", "23"],
        ["Tables 5.1 – 5.3", "Input Form Design Specifications", "30"],
        ["Tables 5.4 – 5.14", "Relational Database Schema Design (All 11 Entities)", "31 – 34"],
        ["Tables 6.1 – 6.3", "System Test Execution Suites (24 Test Cases)", "37 – 38"],
        ["Table 7.1", "Resolved Operational Challenges and Bug Fixes", "41"],
        ["Table 8.1", "Placement Administration Performance Benchmarks", "44"],
        ["Table 9.1", "Strategic Phased Implementation Roadmap", "48"]
    ];

    elements.push(...table(
        figListHeaders,
        figListRows,
        [20, 65, 15],
        ""
    ));

    return elements;
}

module.exports = { getFrontMatter };
