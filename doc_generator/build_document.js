const { Document, Packer, Footer, PageNumber, AlignmentType, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const path = require('path');

const { getFrontMatter } = require('./content/front_matter');
const { getChapter1 } = require('./content/chapter1_introduction');
const { getChapter2 } = require('./content/chapter2_system_study');
const { getChapter3 } = require('./content/chapter3_system_description');
const { getChapter4 } = require('./content/chapter4_system_analysis');
const { getChapter5 } = require('./content/chapter5_system_design');
const { getChapter6 } = require('./content/chapter6_system_testing');
const { getChapter7 } = require('./content/chapter7_system_implementation');
const { getChapter8 } = require('./content/chapter8_conclusion');
const { getChapter9 } = require('./content/chapter9_future_enhancement');
const { getChapter10 } = require('./content/chapter10_bibliography');

async function buildProjectRecord() {
    console.log("Starting compilation of Project Record...");

    const allChildren = [];

    console.log("1. Adding Front Matter (Title, Certificate, Declaration, Acknowledgement, Abstract, TOC, Lists)...");
    allChildren.push(...getFrontMatter());

    console.log("2. Adding Chapter 1: Introduction...");
    allChildren.push(...getChapter1());

    console.log("3. Adding Chapter 2: System Study...");
    allChildren.push(...getChapter2());

    console.log("4. Adding Chapter 3: System Description...");
    allChildren.push(...getChapter3());

    console.log("5. Adding Chapter 4: System Analysis...");
    allChildren.push(...getChapter4());

    console.log("6. Adding Chapter 5: System Design...");
    allChildren.push(...getChapter5());

    console.log("7. Adding Chapter 6: System Testing...");
    allChildren.push(...getChapter6());

    console.log("8. Adding Chapter 7: System Implementation...");
    allChildren.push(...getChapter7());

    console.log("9. Adding Chapter 8: Conclusion...");
    allChildren.push(...getChapter8());

    console.log("10. Adding Chapter 9: Future Enhancement...");
    allChildren.push(...getChapter9());

    console.log("11. Adding Chapter 10: Bibliography...");
    allChildren.push(...getChapter10());

    console.log(`Total assembled document elements: ${allChildren.length}`);

    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Times New Roman",
                        size: 24, // 12pt
                        color: "111827"
                    },
                    paragraph: {
                        spacing: { line: 360, after: 40 } // 1.5 line spacing, 2pt after
                    }
                }
            }
        },
        sections: [
            {
                properties: {
                    page: {
                        size: {
                            width: 11906,  // A4 width in twips (210mm)
                            height: 16838  // A4 height in twips (297mm)
                        },
                        margin: {
                            top: 1440,     // 1 inch (72 pt = 1440 twips)
                            bottom: 1440,  // 1 inch
                            left: 1440,    // 1 inch
                            right: 1440    // 1 inch
                        }
                    }
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 100, after: 0 },
                                children: [
                                    new TextRun({
                                        children: [PageNumber.CURRENT],
                                        font: "Times New Roman",
                                        size: 22,
                                        color: "475569"
                                    })
                                ]
                            })
                        ]
                    })
                },
                children: allChildren
            }
        ]
    });

    const outputDir = path.resolve(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const docxPath = path.join(outputDir, 'Project_Record_Placement_Prediction.docx');
    console.log(`Generating DOCX binary buffer...`);
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(docxPath, buffer);
    console.log(`DOCX written successfully to: ${docxPath} (${buffer.length} bytes)`);

    return docxPath;
}

buildProjectRecord().catch(err => {
    console.error("Fatal Error during document compilation:", err);
    process.exit(1);
});
