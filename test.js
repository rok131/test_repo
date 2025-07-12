import http from 'http';
import assert from 'assert';
import server from './server.js';

const PORT = 3000;

function request(method, path, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = token;
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null });
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

(async () => {
  try {
    let res = await request('POST', '/register', { email: 'a@a.com', password: 'pw' });
    assert.strictEqual(res.status, 200);

    res = await request('POST', '/login', { email: 'a@a.com', password: 'pw' });
    assert.strictEqual(res.status, 200);
    const token = res.body.token;

    res = await request('POST', '/deposit', { amount: 20 }, token);
    assert.strictEqual(res.status, 200);

    res = await request('POST', '/party', { name: 'Test Party', serviceName: 'Netflix', deposit: 10 }, token);
    assert.strictEqual(res.status, 200);
    const partyId = res.body.id;

    res = await request('POST', `/party/${partyId}/join`, null, token);
    assert.strictEqual(res.status, 200);

    res = await request('GET', '/me', null, token);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.balance, 10);

    res = await request('GET', '/parties');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));

    console.log('All tests passed');
  } catch (err) {
    console.error('Test failed', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
