import { useState } from 'react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Login failed');
    setToken(data.token);
    await loadLeads(data.token);
  }

  async function loadLeads(tok: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/leads', { headers: { Authorization: `Bearer ${tok}` } });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Failed to load leads');
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div style={{ maxWidth: 380, margin: '80px auto', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Admin Dashboard</h1>
        <p style={{ color: '#666', marginBottom: 20 }}>Marketing Integration LLC — lead management</p>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 16 }}
          />
          <button type="submit" style={{ padding: '12px', background: '#0b1f3a', color: '#fff', border: 0, borderRadius: 8, fontSize: 16, cursor: 'pointer' }}>
            Sign In
          </button>
        </form>
        {error && <p style={{ color: '#c00', marginTop: 12 }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24 }}>Lead Submissions ({leads.length})</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => loadLeads(token)} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
            Refresh
          </button>
          <button onClick={() => { setToken(null); setLeads([]); }} style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
            Log Out
          </button>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {!loading && leads.length === 0 && <p style={{ color: '#666' }}>No leads yet. Submissions from the site contact form will appear here.</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #0b1f3a' }}>
            <th style={{ padding: '10px 8px' }}>Date</th>
            <th style={{ padding: '10px 8px' }}>Name</th>
            <th style={{ padding: '10px 8px' }}>Email</th>
            <th style={{ padding: '10px 8px' }}>Phone</th>
            <th style={{ padding: '10px 8px' }}>Company</th>
            <th style={{ padding: '10px 8px' }}>Interest</th>
            <th style={{ padding: '10px 8px' }}>Message</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} style={{ borderBottom: '1px solid #eee', verticalAlign: 'top' }}>
              <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>{new Date(l.ts).toLocaleString()}</td>
              <td style={{ padding: '10px 8px' }}>{l.name}</td>
              <td style={{ padding: '10px 8px' }}>{l.email}</td>
              <td style={{ padding: '10px 8px' }}>{l.phone}</td>
              <td style={{ padding: '10px 8px' }}>{l.company}</td>
              <td style={{ padding: '10px 8px' }}>{l.interest}</td>
              <td style={{ padding: '10px 8px', maxWidth: 240 }}>{l.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
