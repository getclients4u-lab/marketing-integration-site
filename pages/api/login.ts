import { NextApiRequest, NextApiResponse } from 'next';
import { checkPassword, sign } from '../../lib/jwt';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { password } = req.body || {};
  if (!checkPassword(password || '')) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = sign({ role: 'admin' });
  return res.status(200).json({ ok: true, token });
}
