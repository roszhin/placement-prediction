const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');

const svg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="100" fill="#2563eb" rx="10"/>
  <text x="100" y="55" font-family="Arial" font-size="18" fill="white" text-anchor="middle" font-weight="bold">Hello Resvg</text>
</svg>
`;

const resvg = new Resvg(svg);
const pngData = resvg.render();
fs.writeFileSync('test.png', pngData.asPng());
console.log('Test PNG rendered successfully! Size:', fs.statSync('test.png').size);
