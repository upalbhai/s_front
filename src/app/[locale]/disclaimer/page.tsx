export default function DisclaimerPage() {
  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Disclaimer</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Last Updated: April 2026</p>

      <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2>General Disclaimer</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            The content provided on Sound Buttons Max is for informational and entertainment purposes only. We do not guarantee the accuracy or reliability of any content.
          </p>
        </section>
        <section>
          <h2>External Links</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            Our site may contain links to external websites. We are not responsible for the content or privacy practices of these sites.
          </p>
        </section>
      </div>
    </div>
  );
}
