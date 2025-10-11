// Debug server to help identify issues
import { spawn } from 'child_process';
import { join } from 'path';
import { cwd } from 'process';

console.log('Starting debug server...');
console.log('Working directory:', cwd());
console.log('Node version:', process.version);

// Set environment variable
process.env.NODE_ENV = 'development';

// Path to tsx and server file  
const tsxPath = join(cwd(), 'node_modules', '.bin', 'tsx.cmd');
const serverPath = join(cwd(), 'server', 'index.ts');

console.log('TSX path:', tsxPath);
console.log('Server path:', serverPath);

const server = spawn(tsxPath, [serverPath], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' },
  shell: true
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.on('close', (code, signal) => {
  console.log(`Server process exited with code ${code} and signal ${signal}`);
});

server.on('exit', (code, signal) => {
  console.log(`Server process exit with code ${code} and signal ${signal}`);
});

console.log('Server process started with PID:', server.pid);