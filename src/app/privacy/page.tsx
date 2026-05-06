export default function PrivacyPage() {
  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Last Updated: April 2026</p>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2>1. Information We Collect</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            We do not collect personal information unless you create an account or use our contact form. We may collect anonymous usage data to improve our service.
          </p>
        </section>
        <section>
          <h2>2. How We Use Data</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            Usage data is used to rank popular sounds and analyze site performance.
          </p>
        </section>
        <section>
          <h2>3. Cookies</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            We use cookies to remember your preferences and favorites.
          </p>
        </section>
      </div>
    </div>
  );
}
