export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '4rem 0', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>About Us</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>The team behind the world's largest free meme soundboard.</p>
      </div>

      <div className="glass-card" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h2>Our Mission</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '1.1rem' }}>
          Sound Buttons Max was built with a simple goal: to provide free, unrestricted access to the internet's most iconic audio clips. We believe that creativity and humor should be accessible to everyone, regardless of their location or network restrictions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 className="text-gradient" style={{ fontSize: '2.5rem' }}>100,000+</h3>
          <p style={{ color: 'var(--text-muted)' }}>Sounds Library</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 className="text-gradient" style={{ fontSize: '2.5rem' }}>Millions</h3>
          <p style={{ color: 'var(--text-muted)' }}>Monthly Users</p>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <h3 className="text-gradient" style={{ fontSize: '2.5rem' }}>12+</h3>
          <p style={{ color: 'var(--text-muted)' }}>Languages Supported</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '3rem' }}>
        <h2>Meet the Team</h2>
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', marginBottom: '1rem' }}></div>
            <h4 style={{ fontSize: '1.25rem' }}>Alex Sounder</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Founder & Lead Developer</p>
          </div>
          <div>
            <div style={{ width: '80px', height: '80px', background: 'var(--secondary)', borderRadius: '50%', marginBottom: '1rem' }}></div>
            <h4 style={{ fontSize: '1.25rem' }}>Jamie Meme</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Content Curator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
