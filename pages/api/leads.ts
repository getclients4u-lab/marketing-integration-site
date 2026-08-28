import { NextApiRequest, NextApiResponse } from 'next';
import { verify } from '../../lib/jwt';
import { readLeads } from '../../lib/github-csv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // JWT auth check (Bearer token from admin login)
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const v = verify(token);
  if (!v.ok || v.payload?.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const leads = await readLeads();
    return res.status(200).json({ ok: true, count: leads.length, leads });
  } catch (err: any) {
    return res.status(500).json({ error: 'Could not read leads', detail: err.message });
  }
}
