package com.roshin.placement;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts.FontName;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;

public class GeneratePdfTest {
    
    @Test
    public void generateSampleResume() {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                PDType1Font fontBold = new PDType1Font(FontName.HELVETICA_BOLD);
                PDType1Font fontRegular = new PDType1Font(FontName.HELVETICA);

                contentStream.beginText();
                contentStream.setFont(fontBold, 20);
                contentStream.setLeading(14.5f);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("John Doe - Software Engineer");
                contentStream.newLine();
                contentStream.newLine();
                
                contentStream.setFont(fontRegular, 12);
                contentStream.showText("Email: john.doe@example.com | Phone: 9876543210");
                contentStream.newLine();
                contentStream.newLine();

                contentStream.setFont(fontBold, 14);
                contentStream.showText("Professional Summary");
                contentStream.newLine();
                contentStream.setFont(fontRegular, 12);
                contentStream.showText("Highly motivated software engineer with experience in developing scalable web applications.");
                contentStream.newLine();
                contentStream.showText("Proficient in modern backend and frontend technologies.");
                contentStream.newLine();
                contentStream.newLine();

                contentStream.setFont(fontBold, 14);
                contentStream.showText("Technical Skills");
                contentStream.newLine();
                contentStream.setFont(fontRegular, 12);
                contentStream.showText("- Languages: Java, Python, JavaScript, SQL");
                contentStream.newLine();
                contentStream.showText("- Frameworks: Spring Boot, React, Node.js");
                contentStream.newLine();
                contentStream.showText("- Tools & Cloud: Docker, AWS, Git, Jenkins");
                contentStream.newLine();
                contentStream.newLine();

                contentStream.setFont(fontBold, 14);
                contentStream.showText("Education");
                contentStream.newLine();
                contentStream.setFont(fontRegular, 12);
                contentStream.showText("Master of Computer Applications (MCA)");
                contentStream.newLine();
                contentStream.showText("XYZ University | CGPA: 8.5 | Graduating: 2026");
                contentStream.newLine();
                contentStream.newLine();

                contentStream.setFont(fontBold, 14);
                contentStream.showText("Projects");
                contentStream.newLine();
                contentStream.setFont(fontRegular, 12);
                contentStream.showText("1. AI Placement Prediction Platform: Built using Spring Boot and Gemini AI.");
                contentStream.newLine();
                contentStream.showText("2. E-Commerce Backend: Designed microservices architecture with Spring Cloud.");
                
                contentStream.endText();
            }

            File dir = new File("src/main/resources/static");
            if (!dir.exists()) dir.mkdirs();

            document.save("src/main/resources/static/sample_resume.pdf");
            System.out.println("PDF created successfully!");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
