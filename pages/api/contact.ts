import { NextApiRequest, NextApiResponse } from 'next';
import { appendLead } from '../../lib/github-csv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone = '', company = '', interest = '', message = '' } = req.body || {};

  // 1. Validate input
  const nameOk = typeof name === 'string' && name.trim().length >= 2;
  const emailOk = typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (!nameOk || !emailOk) {
    return res.status(400).json({ error: 'Valid name and email are required' });
  }

  try {
    // 2. Append row + commit to GitHub CSV
    const { row } = await appendLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim(),
      interest,
      message: message.trim(),
    });

    return res.status(200).json({ success: true, message: 'Lead captured successfully', id: row.id });
  } catch (err: any) {
    console.error('lead capture error:', err.message);
    return res.status(500).json({ error: 'Could not store lead', detail: err.message });
  }
}
