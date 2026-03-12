const http = require('http');

const data = JSON.stringify({
  email: 'test4@example.com',
  password: 'password123'
});

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let responseData = '';
  res.on('data', chunk => { responseData += chunk; });
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${responseData}`);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
