const fs = require('fs');

console.log('Reading server-complete-broken.js...');
let content;
try {
  content = fs.readFileSync('server-complete-broken.js', 'utf8');
  console.log(`File size: ${content.length} bytes`);
} catch (err) {
  console.log('ERROR reading file:', err.message);
  process.exit(1);
}

// Find the main HTML template literal
console.log('Finding template start...');
const templateStart = content.indexOf('const htmlContent = `');
if (templateStart === -1) {
  console.log('ERROR: Could not find template start');
  process.exit(1);
}
console.log(`Template starts at position ${templateStart}`);

// Find where the template ends (look for </html>\` pattern - note the escaped backtick)
const searchFrom = templateStart + 21;
const htmlEndPattern = '</html>\\`';
const templateEnd = content.indexOf(htmlEndPattern, searchFrom);
if (templateEnd === -1) {
  console.log('ERROR: Could not find template end');
  process.exit(1);
}
console.log(`Template ends at position ${templateEnd}`);

// Extract the template content
let before = content.substring(0, templateStart + 21);
let template = content.substring(templateStart + 21, templateEnd + 7); // Include </html>
let after = content.substring(templateEnd + 8); // Skip past closing `

console.log(`Template length: ${template.length} characters`);

// Count unescaped ${ patterns (simple count of all ${)
const totalCount = (template.match(/\$\{/g) || []).length;
const escapedCount = (template.match(/\\\$\{/g) || []).length;
const unescapedCount = totalCount - escapedCount;
console.log(`Found ${totalCount} total, ${escapedCount} escaped, ${unescapedCount} unescaped`);

// Replace all ${ with \${ then fix double escaping
template = template.replace(/\$\{/g, '\\${');
template = template.replace(/\\\\\$\{/g, '\\${');

// Verify
const afterTotal = (template.match(/\$\{/g) || []).length;
const afterEscaped = (template.match(/\\\$\{/g) || []).length;
console.log(`After fix: ${afterTotal} total, ${afterEscaped} escaped`);

// Reconstruct the file
const fixed = before + template + after;

// Write the fixed content
fs.writeFileSync('server-complete-broken.js', fixed, 'utf8');
console.log('SUCCESS: Fixed all template literals in server-complete-broken.js');
