import './App.css'

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">Nexfolio</div>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#">Features</a>
          <a href="#">About</a>
          <button className="login-btn">Recruiter Login</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Showcase Your Talent.</h1>
          <h2>Get Discovered.</h2>

          <p>
            Nexfolio connects talented professionals with recruiters through
            beautiful digital portfolios.
          </p>

          <div className="buttons">
            <button className="primary">Upload Portfolio</button>
            <button className="secondary">Learn More</button>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Nexfolio?</h2>

        <div className="feature-container">
          <div className="feature-card">
            <h3>🧑‍💻 Build Your Portfolio</h3>
            <p>
              Create a professional digital portfolio that showcases your skills,
              experience, and achievements.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔍 Get Discovered</h3>
            <p>
              Recruiters can discover talented professionals based on real skills
              and experience.
            </p>
          </div>

          <div className="feature-card">
            <h3>🚀 Find Opportunities</h3>
            <p>
              Connect with companies searching for your unique talents.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export default App