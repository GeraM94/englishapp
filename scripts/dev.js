import { spawn } from 'node:child_process';

const processes = [];

function start(command, args, name) {
  const child = spawn(command, args, { stdio: 'inherit', shell: true });
  processes.push(child);
  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`${name} finalizó con código ${code}`);
      cleanup();
      process.exit(code ?? 1);
    }
  });
}

function cleanup() {
  processes.forEach((child) => {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  });
}

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});

start('npm', ['run', 'dev:server'], 'Servidor');
start('npm', ['run', 'dev:client'], 'Cliente');
