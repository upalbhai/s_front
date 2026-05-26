export default function TermsPage() {
  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Terms & Conditions</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Last Updated: April 2026</p>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2>1. Use of Service</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            By using Sound Buttons Max, you agree to use our content for personal and non-commercial purposes.
          </p>
        </section>
        <section>
          <h2>2. Intellectual Property</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            All sound clips are the property of their respective owners. We provide them for entertainment purposes.
          </p>
        </section>
      </div>
    </div>
  );
}
