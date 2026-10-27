const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('🚀 Starting ShopNova Mini E-Commerce System...');
console.log('📡 Starting Backend Server & Frontend Client...');
console.log('====================================================\n');

// Start Express Backend
const server = spawn('npm run dev', {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

// Start Vite React Frontend
const client = spawn('npm run dev', {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
});

function handleExit(code) {
  try {
    server.kill();
    client.kill();
  } catch (e) {}
  process.exit(code || 0);
}

process.on('SIGINT', () => handleExit(0));
process.on('SIGTERM', () => handleExit(0));

server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Backend process exited with code ${code}`);
  }
});

client.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Frontend process exited with code ${code}`);
  }
});
