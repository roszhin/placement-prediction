const { Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');
const { FONT_FAMILY, p, pMulti, chapterHeading, sectionHeading } = require('../doc_helper');

function getFrontMatter() {
    const elements = [];

    // ==========================================
    // 1. TITLE PAGE
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 140 },
            children: [
                new TextRun({
                    text: "A PROJECT RECORD ON",
                    font: FONT_FAMILY,
                    size: 26, // 13pt
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 260 },
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
            spacing: { before: 240, after: 120 },
            children: [
                new TextRun({
                    text: "Submitted in partial fulfillment of the requirements for the award of the degree of",
                    font: FONT_FAMILY,
                    size: 22,
                    italics: true,
                    color: "475569"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
                new TextRun({
                    text: "BACHELOR OF TECHNOLOGY / BACHELOR OF ENGINEERING",
                    font: FONT_FAMILY,
                    size: 26,
                    bold: true,
                    color: "1E293B"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 360 },
            children: [
                new TextRun({
                    text: "IN\nCOMPUTER SCIENCE AND ENGINEERING / INFORMATION TECHNOLOGY",
                    font: FONT_FAMILY,
                    size: 24,
                    bold: true,
                    color: "334155"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 80 },
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
            spacing: { before: 60, after: 60 },
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
            spacing: { before: 60, after: 360 },
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
            spacing: { before: 200, after: 80 },
            children: [
                new TextRun({
                    text: "Under the Esteemed Guidance of:",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
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
            spacing: { before: 60, after: 360 },
            children: [
                new TextRun({
                    text: "[DESIGNATION & DEPARTMENT: ____________________________________]",
                    font: FONT_FAMILY,
                    size: 22,
                    color: "334155"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 80 },
            children: [
                new TextRun({
                    text: "[DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING]",
                    font: FONT_FAMILY,
                    size: 24,
                    bold: true,
                    color: "1E293B"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [
                new TextRun({
                    text: "[COLLEGE / INSTITUTION NAME: ____________________________________]",
                    font: FONT_FAMILY,
                    size: 24,
                    bold: true,
                    color: "0F172A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [
                new TextRun({
                    text: "[AFFILIATED UNIVERSITY / ACCREDITATION BODY]",
                    font: FONT_FAMILY,
                    size: 22,
                    color: "475569"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 100 },
            children: [
                new TextRun({
                    text: "ACADEMIC YEAR: 2025 – 2026",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        })
    );

    // ==========================================
    // 2. CERTIFICATE PAGE
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 240, after: 80 },
            children: [
                new TextRun({
                    text: "[COLLEGE / INSTITUTION NAME]",
                    font: FONT_FAMILY,
                    size: 28,
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 120 },
            children: [
                new TextRun({
                    text: "[Affiliated to University Name | Approved by AICTE, New Delhi]",
                    font: FONT_FAMILY,
                    size: 20,
                    italics: true,
                    color: "475569"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 280 },
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
        p("This is to certify that the project record entitled \"CAMPUS PLACEMENT PREDICTION & SKILL GAP ANALYZER WITH AI ATS RESUME EVALUATION AND HIRING COMPANIES PORTAL\" is a bonafide record of the independent project work carried out by [STUDENT NAME] (Register Number: [REGISTER NUMBER]), under my supervision and guidance, in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology / Bachelor of Engineering in Computer Science and Engineering during the academic year 2025 – 2026."),
        p("The work documented in this report is authentic, original, and has not been submitted elsewhere in part or full for the award of any other degree, diploma, fellowship, or professional title."),
        new Paragraph({ spacing: { before: 500 } }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 140 },
            children: [
                new TextRun({
                    text: "Internal Guide Signature: ______________________          Head of Department: ______________________\n\nName: [Guide Name]                                                   Name: [HOD Name]\nDesignation: [Guide Designation]                               Department: Computer Science and Engg.\nDate: ________________________                                     Date: ________________________",
                    font: FONT_FAMILY,
                    size: 22,
                    color: "1E293B"
                })
            ]
        }),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
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
        new Paragraph({ spacing: { before: 300 } }),
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { line: 360, after: 140 },
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
            spacing: { before: 300, after: 240 },
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
        p("I, [STUDENT NAME], student of Bachelor of Technology / Bachelor of Engineering in Computer Science and Engineering, [College Name], hereby declare that the project record entitled \"CAMPUS PLACEMENT PREDICTION & SKILL GAP ANALYZER WITH AI ATS RESUME EVALUATION AND HIRING COMPANIES PORTAL\" is my original work carried out under the supervision and guidance of [Guide Name], [Guide Designation], Department of Computer Science and Engineering."),
        p("I further declare that this report has been authored independently and that all external technical references, libraries, source code frameworks, algorithms, and documentation cited herein have been duly acknowledged in the text and referenced in the Bibliography."),
        p("This project record has not previously formed the basis for the award of any Degree, Diploma, Associate-ship, Fellowship, or any other similar title to any candidate at this or any other university or academic institution."),
        new Paragraph({ spacing: { before: 500 } }),
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { line: 360, after: 140 },
            children: [
                new TextRun({
                    text: "Place: _________________________\nDate:  _________________________",
                    font: FONT_FAMILY,
                    size: 22,
                    color: "334155"
                })
            ]
        }),
        new Paragraph({ spacing: { before: 300 } }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { line: 360, after: 140 },
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
            spacing: { before: 300, after: 240 },
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
        p("The satisfaction and euphoria that accompany the successful completion of any task would be incomplete without expressing gratitude to the people who made it possible and whose encouragement has crowned my efforts with success."),
        p("First and foremost, I express my deepest gratitude to the Almighty God for showering His divine grace, wisdom, health, and perseverance upon me throughout the duration of this academic project work."),
        p("I place on record my sincere thanks and profound gratitude to our respected Chairman / Secretary / Correspondent and Management Trustees of [College / Institution Name] for providing excellent infrastructural facilities, modern laboratory environments, and an intellectually inspiring atmosphere that enabled the execution of this endeavor."),
        p("I convey my heartfelt thanks to our respected Principal, [Principal Name], for his constant encouragement, visionary leadership, and kind permission to utilize the institutional resources for conducting research and system development."),
        p("I express my heartfelt gratitude to [HOD Name], Head of the Department of Computer Science and Engineering, for providing invaluable technical guidance, administrative support, continuous motivation, and constructive suggestions throughout the semester."),
        p("I am profoundly indebted and express my deepest sense of gratitude to my respected Project Guide, [Guide Name], [Guide Designation], Department of Computer Science and Engineering, for his/her invaluable mentorship, constructive critique, patient guidance, and insightful recommendations at every stage of design, implementation, and documentation."),
        p("I also extend my sincere appreciation to all Teaching Faculty Members, Technical Staff, and Placement Cell Coordinators who directly and indirectly shared their practical domain knowledge regarding corporate recruitment workflows, applicant tracking challenges, and institutional placement statistics."),
        p("Last but by no means least, I express my eternal gratitude to my beloved parents and family members for their unconditional love, moral support, and endless sacrifices. I also thank my fellow classmates and friends for their enthusiastic collaboration, constructive peer reviews, and camaraderie."),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { line: 360, after: 100 },
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
            spacing: { before: 240, after: 180 },
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
        p("In higher education institutions, campus placement administration serves as the critical bridge connecting academic achievement with corporate employment. However, conventional campus placement operations remain fundamentally burdened by manual, fragmented procedures: placement cells collect unindexed resume files via email, recruiters are overwhelmed by hundreds of mismatched profiles, and students receive binary application outcomes without constructive feedback regarding their technical deficiencies, ATS compatibility, or missing skills."),
        p("To resolve these challenges, this project presents the architectural design and full-stack engineering of the \"Campus Placement Prediction & Skill Gap Analyzer with AI ATS Resume Evaluation and Hiring Companies Portal\". Engineered on Java 21 LTS and Spring Boot 3.3.0, the platform integrates Google Gemini 1.5 Flash through reactive Spring WebClient pipelines. Resumes uploaded in PDF format are ingested via dual storage redundancy—persisting binary payloads securely within MySQL 8.0 LONGBLOB structures while mirroring files on disk. Resumes are parsed using Apache PDFBox 3.0.2 and submitted alongside corporate job specifications to Gemini 1.5 Flash. The AI engine computes an objective ATS match percentage (0–100%), extracts matched vs. missing skills, and delivers tailored interview advice in validated JSON format."),
        p("The platform features an AI-Ranked Job Matching engine (\"Jobs For You\") with asynchronous loading states, an interactive Companies Directory with live open job indicators, Spring Security 6 role-based governance with BCrypt encryption, JavaMailSender SMTP OTP verification, and responsive Bootstrap 5.3 and Chart.js dashboards. Comprehensive testing validates that the platform eliminates manual screening bottlenecks, maintains 100% data integrity, prevents stale AI cache anomalies, and provides automated, transparent career readiness guidance."),
        p("Keywords: Campus Placement Prediction, AI ATS Resume Parsing, Google Gemini 1.5 Flash, Spring Boot 3.3.0, Java 21, Apache PDFBox, Skill Gap Analyzer, Thymeleaf, Spring Security, MySQL 8.0.")
    );

    // ==========================================
    // 6. TABLE OF CONTENTS (Pages 6, 7, 8)
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 300, after: 240 },
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
        }),
        p("The following detailed table of contents outlines the structural hierarchy of this project record, including all chapters, numbered sections, system models, database tables, implementation workflows, and verification artifacts:"),
        p("The following consolidated table of contents outlines the structural hierarchy of this project record, designed for efficient one-page reference:"),
        new Paragraph({ spacing: { before: 120 } })
    );

    const tocHeaders = ["Chapter / Section", "Title of Section / Topic", "Page No."];
    const tocRows = [
        ["—", "Bonafide Certificate", "ii"],
        ["—", "Declaration", "iii"],
        ["—", "Acknowledgement", "iv"],
        ["—", "Abstract", "v"],
        ["—", "Table of Contents", "vi"],
        ["—", "List of Figures & List of Tables", "vii"],
        ["1.", "INTRODUCTION (Project Profile, Organizational Profile)", "1"],
        ["2.", "SYSTEM STUDY (Existing System, Proposed System, Comparison)", "6"],
        ["3.", "SYSTEM DESCRIPTION (Hardware, Software, Project Architecture)", "11"],
        ["4.", "SYSTEM ANALYSIS (Requirements, Feasibility, 10 Modules)", "20"],
        ["5.", "SYSTEM DESIGN (Flow Chart, DFDs, ER Diagram, Forms, DB Schemas)", "32"],
        ["6.", "SYSTEM TESTING (Unit, Integration, Functional, Database, Security)", "54"],
        ["7.", "SYSTEM IMPLEMENTATION (Process, Security, Testing, CI/CD, Challenges)", "62"],
        ["8.", "CONCLUSION (Overview, Achievements, Learnings, Case Studies, ROI)", "70"],
        ["9.", "FUTURE ENHANCEMENT (Paradigms, Functional & Technical Roadmaps)", "76"],
        ["10.", "BIBLIOGRAPHY (Frameworks, AI & Parsing, Databases, Research)", "82"]
    ];

    elements.push(...require('../doc_helper').table(
        tocHeaders,
        tocRows,
        [22, 66, 12],
        "Table T.1: Consolidated Table of Contents"
    ));

    // ==========================================
    // 7. LIST OF FIGURES & LIST OF TABLES
    // ==========================================
    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            pageBreakBefore: true,
            spacing: { before: 240, after: 180 },
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

    const figureHeaders = ["Figure No.", "Figure Title / Caption", "Page No."];
    const figureRows = [
        ["Figure 3.1", "System Architectural Design (3-Tier MVC Architecture with AI Integration)", "14"],
        ["Figure 5.1", "End-to-End Placement & AI ATS Evaluation System Flow Chart", "33"],
        ["Figure 5.2", "Data Flow Diagram (DFD) Level-0 / Context Diagram", "36"],
        ["Figure 5.3", "Data Flow Diagram (DFD) Level-1 (Top-Level Process Decomposition)", "38"],
        ["Figure 5.4", "DFD Level-2 (Process 4.0 - AI ATS Resume Evaluation & Skill Gap Subsystem)", "40"],
        ["Figure 5.5", "DFD Level-3 (Process 5.0 - Job Application & Recruiter Lifecycle Subsystem)", "42"],
        ["Figure 5.6", "Complete Entity-Relationship (E-R) Diagram (10 Entities with Cardinalities)", "45"]
    ];

    elements.push(...require('../doc_helper').table(
        figureHeaders,
        figureRows,
        [22, 66, 12],
        "Table F.1: List of System Figures and Architectural Diagrams"
    ));

    elements.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 140 },
            children: [
                new TextRun({
                    text: "KEY SYSTEM TABLES",
                    font: FONT_FAMILY,
                    size: 22,
                    bold: true,
                    color: "1E3A8A"
                })
            ]
        })
    );

    const tableListHeaders = ["Table No.", "Table Title / Description", "Page No."];
    const tableListRows = [
        ["Table 2.1", "Comparative Evaluation Matrix: Existing vs. Proposed System", "9"],
        ["Table 3.1", "Development Hardware Environment Specifications", "12"],
        ["Table 3.2", "Production Server Infrastructure Specifications", "13"],
        ["Table 3.3", "Software Environment and Technology Stack Components", "16"],
        ["Table 4.1", "Multi-Role Functional Requirements Matrix", "22"],
        ["Table 4.2", "Non-Functional Requirements Specification Matrix", "24"],
        ["Table 4.3", "Feasibility Study Evaluation Matrix", "26"],
        ["Table 4.4", "System Subsystem Decomposition and Module Ownership Matrix", "28"],
        ["Table 5.4 – 5.14", "Complete Relational Database Schemas (All 11 Database Tables)", "47 - 52"],
        ["Table 5.15", "Output Interface Specifications: Dashboards & AI Diagnostic Views", "53"],
        ["Table 6.1 – 6.8", "Comprehensive Test Suites (Unit, Integration, Functional, Security)", "55 - 61"],
        ["Table 7.1 – 7.3", "Implementation Roadmap, Verification Checklist & Challenges Resolved", "63 - 69"],
        ["Table 8.1", "Quantitative Performance Benchmarking: Traditional vs. Proposed Platform", "74"]
    ];

    elements.push(...require('../doc_helper').table(
        tableListHeaders,
        tableListRows,
        [22, 66, 12],
        "Table L.1: Consolidated List of System Tables and Specifications"
    ));

    return elements;
}

module.exports = { getFrontMatter };
