const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const diagDir = 'C:\\1 . project\\Placement Prediction\\diagrams';
const checkDir = path.join(diagDir, 'zoom_check_400');
if (!fs.existsSync(checkDir)) {
    fs.mkdirSync(checkDir, { recursive: true });
}

const svgFiles = [
    'DFD_Level_0.svg',
    'DFD_Level_1.svg',
    'DFD_Level_2_AI_Analysis.svg',
    'DFD_Level_3_Application_Process.svg',
    'DFD_Level_3_Resume_Analysis.svg',
    'DFD_Report_Page_1.svg',
    'DFD_Report_Page_2.svg',
    'DFD_Main_Flowchart.svg',
    'Main_DFD.svg',
    'ER_Diagram.svg'
];

for (const file of svgFiles) {
    const svgPath = path.join(diagDir, file);
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    // Check that SVG has no <image> raster tag
    if (svgContent.includes('<image')) {
        throw new Error(`Raster image found inside ${file}!`);
    }
    // Render at 400% zoom (4400px width)
    const resvg = new Resvg(svgContent, {
        fitTo: { mode: 'width', value: 4400 }
    });
    const pngData = resvg.render();
    const outPng = path.join(checkDir, file.replace('.svg', '_400pct.png'));
    fs.writeFileSync(outPng, pngData.asPng());
    console.log(`Rendered 400% zoom check: ${outPng} (${pngData.width}x${pngData.height})`);
}

// Verify EMF binary records for all EMF files
const emfFiles = svgFiles.map(f => f.replace('.svg', '.emf'));
const EMR_TYPES = {
    1: 'EMR_HEADER',
    14: 'EMR_EOF',
    17: 'EMR_MAPMODE',
    9: 'EMR_SETWINDOWEXTEX',
    11: 'EMR_SETVIEWPORTEXTEX',
    18: 'EMR_SETBKMODE',
    22: 'EMR_SETTEXTALIGN',
    24: 'EMR_SETTEXTCOLOR',
    27: 'EMR_MOVETOEX',
    37: 'EMR_SELECTOBJECT',
    38: 'EMR_CREATEPEN',
    39: 'EMR_CREATEBRUSHINDIRECT',
    40: 'EMR_DELETEOBJECT',
    42: 'EMR_ELLIPSE',
    43: 'EMR_RECTANGLE',
    44: 'EMR_ROUNDRECT',
    54: 'EMR_LINETO',
    82: 'EMR_EXTCreateFontIndirectW',
    84: 'EMR_EXTTEXTOUTW',
    86: 'EMR_POLYGON16',
    87: 'EMR_POLYLINE16',
    3: 'EMR_POLYGON',
    4: 'EMR_POLYLINE',
    76: 'EMR_BITBLT',
    81: 'EMR_STRETCHDIBITS'
};

for (const file of emfFiles) {
    const emfPath = path.join(diagDir, file);
    const buf = fs.readFileSync(emfPath);
    const recType = buf.readUInt32LE(0);
    const sig = buf.toString('ascii', 40, 44);
    let offset = 0;
    let totalRecords = 0;
    let vectorShapeRecords = 0;
    let textRecords = 0;
    let rasterRecords = 0;
    while (offset + 8 <= buf.length) {
        const iType = buf.readUInt32LE(offset);
        const nSize = buf.readUInt32LE(offset + 4);
        if (nSize < 8) break;
        totalRecords++;
        if ([3, 4, 27, 42, 43, 44, 54, 86, 87].includes(iType)) vectorShapeRecords++;
        if (iType === 84) textRecords++;
        if ([76, 77, 78, 79, 80, 81].includes(iType)) rasterRecords++;
        if (iType === 14) break; // EMR_EOF
        offset += nSize;
    }
    console.log(`EMF Check [${file}]: Size=${buf.length}B, HeaderType=${recType}, Sig="${sig.trim()}", TotalRecords=${totalRecords}, VectorShapes=${vectorShapeRecords}, VectorText=${textRecords}, RasterBitmaps=${rasterRecords}`);
}
