const http = require('http');

function checkPort(port) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/auth/me',
      method: 'GET',
      timeout: 1500
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({ port, status: res.statusCode, contentType: res.headers['content-type'], body });
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ port, error: 'TIMEOUT' });
    });
    
    req.on('error', (e) => {
      resolve({ port, error: e.message });
    });
    
    req.end();
  });
}

async function run() {
  const ports = [3000, 3001, 3002, 3003, 3004, 3005];
  for (const p of ports) {
    const res = await checkPort(p);
    if (res.error) {
      console.log(`Port ${p}: Inactive (${res.error})`);
    } else {
      console.log(`Port ${p}: Active! Status: ${res.status}, Type: ${res.contentType}`);
      if (res.body) {
        console.log(`Body snippet: ${res.body.substring(0, 150)}`);
      } else {
        console.log(`Body is empty/undefined`);
      }
    }
  }
}

run();
