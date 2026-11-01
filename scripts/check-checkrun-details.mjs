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
  const checkRun = await getJson('/repos/deswanth12/hobby-/check-runs/124634416004');
  console.log('Check Run output:');
  console.log(JSON.stringify(checkRun.data?.output, null, 2));

  // Check commit comments or PRs
  const commitComments = await getJson('/repos/deswanth12/hobby-/commits/1e2200851bbbb980fbb3ec16c7e7a625260296ef/comments');
  console.log('Commit comments count:', commitComments.data?.length);
  if (Array.isArray(commitComments.data)) {
    for (const c of commitComments.data) {
      console.log('Comment body:\n', c.body);
    }
  }

  // Check pull requests associated with commit or branch
  const prs = await getJson('/repos/deswanth12/hobby-/pulls?head=deswanth12:maintenance/dead-code-cleanup&state=all');
  console.log('PRs count:', prs.data?.length);
  if (Array.isArray(prs.data)) {
    for (const pr of prs.data) {
      console.log(`PR #${pr.number}: ${pr.title} (state=${pr.state})`);
    }
  }
}

run().catch(console.error);
