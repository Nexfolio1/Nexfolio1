import { useState, useEffect } from 'react'
import './App.css'

const defaultProfile = {
  name: '',
  title: '',
  bio: '',
  location: '',
  skills: '',
  featuredWork: ''
}

function App() {
  const [profile, setProfile] = useState(defaultProfile)
  const [posts, setPosts] = useState([])
  const [caption, setCaption] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [authForm, setAuthForm] = useState({ name: '', email: '' })
  const [authMessage, setAuthMessage] = useState('')

  useEffect(() => {
    const savedProfile = localStorage.getItem('nexfolio-profile-v2')
    const savedPosts = localStorage.getItem('nexfolio-posts-v2')
    const savedAuth = localStorage.getItem('nexfolio-auth-v2')

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }

    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth)
      setIsSignedIn(true)
      setProfile((prev) => ({ ...prev, name: parsedAuth.name }))
      setAuthForm({ name: parsedAuth.name, email: parsedAuth.email })
      setAuthMessage(`Welcome back, ${parsedAuth.name}`)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nexfolio-profile-v2', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('nexfolio-posts-v2', JSON.stringify(posts))
  }, [posts])

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpload = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    const validFiles = selectedFiles.filter((file) => {
      return file.type.startsWith('image/') || file.type.startsWith('video/')
    })

    if (validFiles.length === 0) return

    const newPosts = validFiles.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      caption: caption.trim() || 'New update'
    }))

    setPosts((prev) => [...newPosts, ...prev])
    setCaption('')
    event.target.value = ''
  }

  const handleAuthChange = (event) => {
    const { name, value } = event.target
    setAuthForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAuthSubmit = (event) => {
    event.preventDefault()

    if (!authForm.name.trim() || !authForm.email.trim()) {
      setAuthMessage('Please enter both your name and email.')
      return
    }

    const authData = {
      name: authForm.name.trim(),
      email: authForm.email.trim()
    }

    localStorage.setItem('nexfolio-auth-v2', JSON.stringify(authData))
    setProfile((prev) => ({ ...prev, name: authData.name }))
    setIsSignedIn(true)
    setAuthMessage(`Signed in as ${authData.name}`)
  }

  const handleSignOut = () => {
    localStorage.removeItem('nexfolio-auth-v2')
    setIsSignedIn(false)
    setAuthMessage('Signed out')
  }

  const skillList = profile.skills
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)

  return (
    <>
      <nav className="navbar">
        <div className="logo">Nexfolio</div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#profile">Sign up</a>
          <button className="login-btn">Recruiter Login</button>
        </div>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Showcase Your Talent.</h1>
          <h2>Get Discovered.</h2>

          <p>
            Nexfolio connects talented professionals with recruiters through
            beautiful digital portfolios.
          </p>

          <div className="buttons">
            <a href="#profile" className="primary">Create Profile</a>
            <a href="#features" className="secondary">Learn More</a>
          </div>
        </div>
      </section>

      <section className="features" id="features">
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

      <section className="social-profile" id="profile">
        <div className="social-shell">
          <div className="profile-card">
            <h2>Create your profile</h2>

            {!isSignedIn ? (
              <form className="profile-form auth-form" onSubmit={handleAuthSubmit}>
                <label>
                  Your name
                  <input name="name" value={authForm.name} onChange={handleAuthChange} />
                </label>

                <label>
                  Email
                  <input name="email" value={authForm.email} onChange={handleAuthChange} />
                </label>

                <button className="primary auth-btn" type="submit">Sign in</button>
                {authMessage ? <p className="auth-message">{authMessage}</p> : null}
              </form>
            ) : (
              <div className="signed-in-card">
                <p className="auth-message">{authMessage}</p>
                <button className="secondary auth-btn" type="button" onClick={handleSignOut}>Sign out</button>
              </div>
            )}

            <form className="profile-form">
              <label>
                Name
                <input name="name" value={profile.name} onChange={handleProfileChange} placeholder="Your full name" />
              </label>

              <label>
                Title
                <input name="title" value={profile.title} onChange={handleProfileChange} placeholder="e.g. Senior Product Designer" />
              </label>

              <label>
                Bio
                <textarea name="bio" rows="3" value={profile.bio} onChange={handleProfileChange} placeholder="Tell recruiters about your experience" />
              </label>

              <label>
                Location
                <input name="location" value={profile.location} onChange={handleProfileChange} placeholder="City, Country" />
              </label>

              <label>
                Skills
                <input name="skills" value={profile.skills} onChange={handleProfileChange} placeholder="React, Design, Strategy" />
              </label>

              <label>
                Featured work
                <input name="featuredWork" value={profile.featuredWork} onChange={handleProfileChange} placeholder="Your standout project" />
              </label>
            </form>
          </div>

          <div className="feed-card">
            <div className="profile-hero">
              <div className="avatar large-avatar">{profile.name ? profile.name.charAt(0) : 'U'}</div>
              <div className="profile-header">
                <div>
                  <h3>{profile.name || 'Your Name'}</h3>
                  <p>{profile.title || 'Your headline'}</p>
                </div>
              </div>
            </div>

            <p className="profile-bio">{profile.bio || 'Add a short bio to tell recruiters who you are.'}</p>
            <p className="profile-location">📍 {profile.location || 'Location'}</p>

            <div className="profile-highlights">
              <div className="highlight-card">
                <h4>Skills</h4>
                <div className="skill-tags">
                  {skillList.length > 0 ? (
                    skillList.map((skill) => <span key={skill}>{skill}</span>)
                  ) : (
                    <span>Add your skills</span>
                  )}
                </div>
              </div>

              <div className="highlight-card">
                <h4>Featured work</h4>
                <p>{profile.featuredWork || 'Add a featured project or achievement'}</p>
              </div>
            </div>

            <div className="composer">
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                rows="3"
                placeholder="Share a quick update, photo, or video"
              />

              <label className="upload-btn">
                Upload photos & videos
                <input type="file" accept="image/*,video/*" multiple onChange={handleUpload} />
              </label>
            </div>

            <div className="feed-list">
              {posts.length === 0 ? (
                <div className="empty-state">
                  Your profile is ready. Upload your first photo or video to start building your feed.
                </div>
              ) : (
                posts.map((post) => (
                  <article className="feed-item" key={post.id}>
                    {post.type === 'image' ? (
                      <img src={post.url} alt={post.caption} />
                    ) : (
                      <video controls src={post.url} />
                    )}
                    <p>{post.caption}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default App