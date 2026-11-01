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
  const commit = '1e2200851bbbb980fbb3ec16c7e7a625260296ef';
  console.log(`Checking GitHub repo & commit: ${commit}`);
  
  // 1. Repo info (default branch, etc.)
  const repo = await getJson('/repos/deswanth12/hobby-');
  console.log(`Repository Default Branch: ${repo.data?.default_branch}`);

  // 2. Commit Check Runs (Vercel bot runs here!)
  const checkRuns = await getJson(`/repos/deswanth12/hobby-/commits/${commit}/check-runs`);
  console.log(`\nCheck Runs (${checkRuns.data?.total_count || 0}):`);
  if (checkRuns.data?.check_runs) {
    for (const cr of checkRuns.data.check_runs) {
      console.log(`  * ${cr.name}: status=${cr.status}, conclusion=${cr.conclusion}`);
      console.log(`    URL: ${cr.details_url}`);
      console.log(`    HTML URL: ${cr.html_url}`);
    }
  }

  // 3. Commit Combined Status
  const status = await getJson(`/repos/deswanth12/hobby-/commits/${commit}/status`);
  console.log(`\nCombined Status State: ${status.data?.state}`);
  if (status.data?.statuses) {
    for (const s of status.data.statuses) {
      console.log(`  * Context: ${s.context}, state=${s.state}, target_url=${s.target_url}`);
      console.log(`    Description: ${s.description}`);
    }
  }

  // 4. Deployments API
  const deployments = await getJson('/repos/deswanth12/hobby-/deployments');
  console.log(`\nRecent Deployments (${deployments.data?.length || 0}):`);
  if (Array.isArray(deployments.data)) {
    for (const d of deployments.data.slice(0, 5)) {
      console.log(`  * ID: ${d.id}, ref: ${d.ref}, environment: ${d.environment}, created_at: ${d.created_at}`);
      const depStatus = await getJson(`/repos/deswanth12/hobby-/deployments/${d.id}/statuses`);
      if (Array.isArray(depStatus.data) && depStatus.data.length > 0) {
        console.log(`    Status: ${depStatus.data[0].state}, target_url: ${depStatus.data[0].target_url}`);
      }
    }
  }
}

run().catch(console.error);
