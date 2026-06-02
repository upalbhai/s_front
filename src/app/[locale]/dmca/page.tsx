import { getRequestSite } from '@/lib/site';

export default async function DMCAPage() {
  const site = await getRequestSite();

  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>DMCA Policy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Last Updated: April 2026</p>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>
          {site.siteName} respects the intellectual property rights of others. If you believe that any
          content on our site infringes your copyright, please follow our takedown procedure.
        </p>
        <section>
          <h2>Submit a Takedown Request</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            Please email {site.dmcaEmail} with the following information:
          </p>
          <ul style={{ color: 'var(--text-muted)', marginLeft: '1.5rem', marginTop: '1rem' }}>
            <li>Link to the infringing content</li>
            <li>Description of your copyrighted work</li>
            <li>Your contact information</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
