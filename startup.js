// Simple startup script that avoids cross-env issues
process.env.NODE_ENV = 'development';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the local tsx binary - properly quoted for paths with spaces
const tsxPath = path.join(__dirname, 'node_modules', '.bin', 'tsx.cmd');
const serverPath = path.join(__dirname, 'server', 'index.ts');

console.log('Starting server with tsx...');
console.log('TSX Path:', tsxPath);
console.log('Server Path:', serverPath);

// Use spawn with proper path handling for Windows paths with spaces
const child = spawn(`"${tsxPath}"`, [`"${serverPath}"`], {
  stdio: 'inherit',
  shell: true,
  windowsHide: false
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});