const fs = require('fs');
const path = require('path');

try {
  const filePath = path.join(__dirname, '../dev_output.txt');
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf16le');
    const lines = content.split('\n');
    console.log(`Total lines: ${lines.length}`);
    console.log("LAST 100 LINES OF LOG:");
    console.log(lines.slice(-100).join('\n'));
  } else {
    console.log("dev_output.txt does not exist!");
  }
} catch (e) {
  console.error("Error reading file:", e);
}
