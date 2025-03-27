// start-expo.js
const { spawn } = require('child_process');
const path = require('path');

// Use the @expo/cli package instead
const expoCliPath = path.join(__dirname, 'node_modules', '@expo', 'cli');
const args = process.argv.slice(2); // Get any arguments passed to this script

console.log('Starting Expo...');
console.log(`Using Expo CLI from: ${expoCliPath}`);

// Spawn the node process to run the Expo CLI
const expo = spawn('node', [
    '-e',
    `require('${expoCliPath}').run(['start', ...${JSON.stringify(args)}])`
], {
    stdio: 'inherit',
    shell: true
});

// Handle process events
expo.on('error', (err) => {
    console.error('Failed to start Expo:', err);
});

expo.on('close', (code) => {
    if (code !== 0) {
        console.log(`Expo process exited with code ${code}`);
    }
}); 