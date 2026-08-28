/**
 * GitHub CSV lead storage — the missing implementation behind api/contact.ts
 * Stores contact form submissions as rows in leads.csv committed to a GitHub repo.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'getclients4u-lab';
const GITHUB_REPO = process.env.GITHUB_REPO || 'marketing-integration-site';
const CSV_PATH = 'data/leads.csv';
const API = 'https://api.github.com';

export interface Lead {
  id: string;
  ts: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  message: string;
}

function esc(v: string): string {
  return `"${(v || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
}

/** Fetch current leads.csv content (or create header if missing) */
async function fetchCsv(shaRef?: { sha: string }): Promise<{ content: string; sha: string | null }> {
  const url = `${API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CSV_PATH}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (res.status === 404) {
    return { content: 'id,ts,name,email,phone,company,interest,message\n', sha: null };
  }
  if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
  const d = await res.json();
  const content = Buffer.from(d.content, 'base64').toString('utf-8');
  return { content, sha: d.sha };
}

/** Append a lead row and commit to GitHub */
export async function appendLead(lead: Omit<Lead, 'id' | 'ts'>): Promise<{ ok: boolean; row: Lead }> {
  const row: Lead = { id: crypto.randomUUID().slice(0, 8), ts: new Date().toISOString(), ...lead };
  const { content, sha } = await fetchCsv();
  const newContent = content.endsWith('\n') ? content : content + '\n';
  const updated = newContent + [row.id, row.ts, esc(row.name), esc(row.email), esc(row.phone), esc(row.company), esc(row.interest), esc(row.message)].join(',') + '\n';

  const body: any = {
    message: `Lead: ${row.name} (${row.email})`,
    content: Buffer.from(updated).toString('base64'),
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${CSV_PATH}`, {
    method: 'PUT',
    headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub commit failed: ${res.status} ${await res.text()}`);
  return { ok: true, row };
}

/** Read all leads (for admin dashboard) */
export async function readLeads(): Promise<Lead[]> {
  const { content } = await fetchCsv();
  const lines = content.trim().split('\n').slice(1); // drop header
  return lines.filter(Boolean).map((line) => {
    const [id, ts, name, email, phone, company, interest, message] = parseCsvLine(line);
    return { id, ts, name, email, phone, company, interest, message };
  });
}

/** Minimal CSV line parser (handles quoted fields) */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else inQ = false;
      } else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}
