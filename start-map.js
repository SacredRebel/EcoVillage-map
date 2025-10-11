// Direct startup for the interactive map server (server-complete.js)
// This bypasses tsx and runs the standalone map server directly
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, 'server-complete.js');

console.log('🗺️ Starting EcoVillageBuilder Interactive Map Server...');
console.log('Server Path:', serverPath);

// Run server-complete.js directly with node
const child = spawn('node', [serverPath], {
  stdio: 'inherit',
  shell: false,
  windowsHide: false
});

child.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code || 0);
});
