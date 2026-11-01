import https from 'https';

function getJson(path) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'api.github.com',
      path,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const comments = await getJson('/repos/deswanth12/hobby-/issues/1/comments');
  if (Array.isArray(comments.data)) {
    for (const c of comments.data) {
      console.log(`=== Comment by ${c.user.login} at ${c.created_at} ===`);
      console.log(c.body);
    }
  }
}

run().catch(console.error);
