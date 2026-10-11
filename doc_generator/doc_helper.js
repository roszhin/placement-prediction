const { Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType, ImageRun } = require('docx');
const fs = require('fs');

const FONT_FAMILY = "Times New Roman";
const MONO_FONT = "Consolas";

// Paragraph styles
function p(text, bold = false, italic = false) {
    return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 360, after: 40 }, // 1.5 line spacing, 2pt after
        children: [
            new TextRun({
                text: text,
                font: FONT_FAMILY,
                size: 24, // 12pt
                bold: bold,
                italics: italic,
                color: "111827"
            })
        ]
    });
}

function pMulti(runs, alignment = AlignmentType.JUSTIFIED) {
    return new Paragraph({
        alignment: alignment,
        spacing: { line: 360, after: 40 },
        children: runs.map(r => new TextRun({
            text: r.text,
            font: r.font || FONT_FAMILY,
            size: r.size || 24,
            bold: !!r.bold,
            italics: !!r.italics,
            color: r.color || "111827"
        }))
    });
}

function bullet(text, boldPrefix = "") {
    const children = [];
    if (boldPrefix) {
        children.push(new TextRun({
            text: boldPrefix + " ",
            font: FONT_FAMILY,
            size: 24,
            bold: true,
            color: "1e293b"
        }));
    }
    children.push(new TextRun({
        text: text,
        font: FONT_FAMILY,
        size: 24,
        color: "334155"
    }));

    return new Paragraph({
        bullet: { level: 0 },
        alignment: AlignmentType.JUSTIFIED,
        spacing: { line: 360, after: 40 },
        children: children
    });
}

function chapterHeading(title) {
    return new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        spacing: { before: 200, after: 160 },
        children: [
            new TextRun({
                text: title.toUpperCase(),
                font: FONT_FAMILY,
                size: 32, // 16pt
                bold: true,
                color: "0f172a"
            })
        ]
    });
}

function sectionHeading(title) {
    return new Paragraph({
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 100 },
        children: [
            new TextRun({
                text: title,
                font: FONT_FAMILY,
                size: 27, // 13.5pt
                bold: true,
                color: "1e3a8a"
            })
        ]
    });
}

function subSectionHeading(title) {
    return new Paragraph({
        alignment: AlignmentType.LEFT,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 140, after: 80 },
        children: [
            new TextRun({
                text: title,
                font: FONT_FAMILY,
                size: 24, // 12pt
                bold: true,
                color: "0f172a"
            })
        ]
    });
}


function figure(imagePath, caption, width = 480, height = 250) {
    const imgData = fs.readFileSync(imagePath);
    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60 },
            children: [
                new ImageRun({
                    data: imgData,
                    transformation: { width: width, height: height },
                    type: "png"
                })
            ]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 140 },
            children: [
                new TextRun({
                    text: caption,
                    font: FONT_FAMILY,
                    size: 21, // 10.5pt
                    bold: true,
                    color: "334155"
                })
            ]
        })
    ];
}

function table(headers, rows, colWidths, caption) {
    const tableBorder = {
        style: BorderStyle.SINGLE,
        size: 4,
        color: "94a3b8"
    };
    const borders = {
        top: tableBorder,
        bottom: tableBorder,
        left: tableBorder,
        right: tableBorder,
        insideHorizontal: tableBorder,
        insideVertical: tableBorder
    };

    const headerCells = headers.map((h, i) => new TableCell({
        width: { size: colWidths[i], type: WidthType.PERCENTAGE },
        shading: { fill: "1E3A8A", type: ShadingType.CLEAR },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { line: 200, after: 0 },
                children: [
                    new TextRun({
                        text: h,
                        font: FONT_FAMILY,
                        size: 19, // 9.5pt
                        bold: true,
                        color: "FFFFFF"
                    })
                ]
            })
        ]
    }));

    const dataRows = rows.map((r, rIdx) => {
        const bg = (rIdx % 2 === 1) ? "F8FAFC" : "FFFFFF";
        return new TableRow({
            cantSplit: true,
            children: r.map((cellText, i) => new TableCell({
                width: { size: colWidths[i], type: WidthType.PERCENTAGE },
                shading: { fill: bg, type: ShadingType.CLEAR },
                margins: { top: 30, bottom: 30, left: 60, right: 60 },
                children: [
                    new Paragraph({
                        alignment: (i === 0 && colWidths[i] < 15) ? AlignmentType.CENTER : AlignmentType.LEFT,
                        spacing: { line: 200, after: 0 },
                        children: [
                            new TextRun({
                                text: String(cellText),
                                font: FONT_FAMILY,
                                size: 18, // 9pt
                                color: "1E293B"
                            })
                        ]
                    })
                ]
            }))
        });
    });

    const docTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: borders,
        rows: [
            new TableRow({ children: headerCells, tableHeader: true, cantSplit: true }),
            ...dataRows
        ]
    });

    const elements = [
        docTable
    ];

    if (caption) {
        elements.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 120 },
            children: [
                new TextRun({
                    text: caption,
                    font: FONT_FAMILY,
                    size: 20, // 10pt
                    bold: true,
                    color: "475569"
                })
            ]
        }));
    }

    return elements;
}



function codeBlock(codeLines, caption) {
    const codeBorder = {
        style: BorderStyle.SINGLE,
        size: 4,
        color: "cbd5e1"
    };
    const borders = {
        top: codeBorder,
        bottom: codeBorder,
        left: codeBorder,
        right: codeBorder
    };

    const paragraphs = codeLines.map(line => new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { line: 220, after: 20 },
        children: [
            new TextRun({
                text: line,
                font: MONO_FONT,
                size: 18, // 9pt
                color: "0f172a"
            })
        ]
    }));

    const tableBlock = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: borders,
        rows: [
            new TableRow({
                cantSplit: true,
                children: [
                    new TableCell({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
                        margins: { top: 80, bottom: 80, left: 140, right: 140 },
                        children: paragraphs
                    })
                ]
            })
        ]
    });

    const elements = [
        tableBlock
    ];

    if (caption) {
        elements.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 200 },
            children: [
                new TextRun({
                    text: caption,
                    font: FONT_FAMILY,
                    size: 20, // 10pt
                    italics: true,
                    bold: true,
                    color: "475569"
                })
            ]
        }));
    }

    return elements;
}

module.exports = {
    FONT_FAMILY,
    MONO_FONT,
    Paragraph,
    TextRun,
    p,
    pMulti,
    bullet,
    chapterHeading,
    sectionHeading,
    subSectionHeading,
    figure,
    table,
    codeBlock
};

