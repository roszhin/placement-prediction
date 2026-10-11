const fs = require("fs");
const { PDFParse } = require("pdf-parse");

async function run() {
    const pdfPath = "C:/Users/Roshi/.gemini/antigravity/brain/d03be525-8c0f-4a31-847b-51cf6d379b45/.user_uploaded/media_1789972380360.pdf";
    const dataBuffer = fs.readFileSync(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    const textResult = await parser.getText();
    const info = await parser.getInfo();
    console.log("Pages:", textResult.total);
    console.log("Info:", JSON.stringify(info, null, 2));
    
    // Save extracted text to inspect structure
    fs.writeFileSync("ref_extracted_text.txt", textResult.text);
    console.log("Extracted text saved. Total characters:", textResult.text.length);
    
    const lines = textResult.text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    console.log("Total lines:", lines.length);
    console.log("--- FIRST 80 LINES ---");
    console.log(lines.slice(0, 80).join("\n"));
}

run().catch(console.error);
