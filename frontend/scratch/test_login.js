const http = require('http');

function checkSeed() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/seed',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          contentType: res.headers['content-type'],
          body: body
        });
      });
    });

    req.on('error', (e) => {
      resolve({ error: e.message });
    });

    req.end();
  });
}

async function run() {
  const res = await checkSeed();
  if (res.error) {
    console.log(`ERROR: ${res.error}`);
  } else {
    console.log(`STATUS: ${res.status}`);
    console.log(`CONTENT-TYPE: ${res.contentType}`);
    console.log(`BODY SNIPPET:\n${res.body.substring(0, 1000)}`);
  }
}

run();
