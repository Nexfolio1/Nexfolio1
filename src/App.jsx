import { useEffect, useState } from 'react'
import './App.css'

const defaultProfile = {
  name: '',
  title: '',
  bio: '',
  location: '',
  skills: '',
  featuredWork: ''
}

const defaultCreatorForm = { name: '', email: '' }
const defaultRecruiterForm = {
  companyName: '',
  contactName: '',
  email: '',
  hiringFocus: '',
  location: '',
  companySize: '',
  website: '',
  about: ''
}

const defaultJobForm = {
  title: '',
  location: '',
  type: 'Full-time',
  experience: '',
  salary: '',
  hybrid: 'Hybrid',
  description: '',
  perks: ''
}

const availablePages = ['home', 'creator', 'recruiter', 'post-work', 'post-job', 'dashboard']

function App() {
  const [profile, setProfile] = useState(defaultProfile)
  const [posts, setPosts] = useState([])
  const [caption, setCaption] = useState('')
  const [isCreatorSignedIn, setIsCreatorSignedIn] = useState(false)
  const [creatorForm, setCreatorForm] = useState(defaultCreatorForm)
  const [creatorMessage, setCreatorMessage] = useState('')
  const [recruiterForm, setRecruiterForm] = useState(defaultRecruiterForm)
  const [recruiterMessage, setRecruiterMessage] = useState('')
  const [isRecruiterSignedIn, setIsRecruiterSignedIn] = useState(false)
  const [jobForm, setJobForm] = useState(defaultJobForm)
  const [jobMessage, setJobMessage] = useState('')
  const [jobs, setJobs] = useState([])
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const savedProfile = localStorage.getItem('nexfolio-profile-v2')
    const savedPosts = localStorage.getItem('nexfolio-posts-v2')
    const savedCreatorAuth = localStorage.getItem('nexfolio-creator-auth-v3') || localStorage.getItem('nexfolio-auth-v2')
    const savedRecruiterAuth = localStorage.getItem('nexfolio-recruiter-auth-v3')
    const savedJobs = localStorage.getItem('nexfolio-jobs-v1')
    const savedPage = localStorage.getItem('nexfolio-page-v5')
    const hashPage = window.location.hash.replace('#', '').trim()

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs))
    }

    if (savedCreatorAuth) {
      const parsedAuth = JSON.parse(savedCreatorAuth)
      setIsCreatorSignedIn(true)
      setProfile((prev) => ({ ...prev, name: parsedAuth.name }))
      setCreatorForm({ name: parsedAuth.name, email: parsedAuth.email })
      setCreatorMessage(`Welcome back, ${parsedAuth.name}`)
    }

    if (savedRecruiterAuth) {
      const parsedAuth = JSON.parse(savedRecruiterAuth)
      setIsRecruiterSignedIn(true)
      setRecruiterForm(parsedAuth)
      setRecruiterMessage(`Welcome back, ${parsedAuth.contactName}`)
    }

    const initialPage = savedPage || hashPage || 'home'
    if (availablePages.includes(initialPage)) {
      setCurrentPage(initialPage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nexfolio-profile-v2', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('nexfolio-posts-v2', JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    localStorage.setItem('nexfolio-page-v5', currentPage)
    const nextHash = currentPage === 'home' ? '' : `#${currentPage}`
    window.history.replaceState(null, '', `${window.location.pathname}${nextHash}`)
  }, [currentPage])

  useEffect(() => {
    localStorage.setItem('nexfolio-jobs-v1', JSON.stringify(jobs))
  }, [jobs])

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

  const handleCreatorChange = (event) => {
    const { name, value } = event.target
    setCreatorForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreatorSubmit = (event) => {
    event.preventDefault()

    if (!creatorForm.name.trim() || !creatorForm.email.trim()) {
      setCreatorMessage('Please enter both your name and email.')
      return
    }

    const authData = {
      name: creatorForm.name.trim(),
      email: creatorForm.email.trim()
    }

    localStorage.setItem('nexfolio-creator-auth-v3', JSON.stringify(authData))
    setProfile((prev) => ({ ...prev, name: authData.name }))
    setIsCreatorSignedIn(true)
    setCurrentPage('home')
    setCreatorMessage(`Signed in as ${authData.name}`)
  }

  const handleCreatorSignOut = () => {
    localStorage.removeItem('nexfolio-creator-auth-v3')
    setIsCreatorSignedIn(false)
    setCreatorMessage('Signed out')
    setCurrentPage('home')
    setCreatorForm(defaultCreatorForm)
  }

  const handleRecruiterChange = (event) => {
    const { name, value } = event.target
    setRecruiterForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRecruiterSubmit = (event) => {
    event.preventDefault()

    if (!recruiterForm.companyName.trim() || !recruiterForm.contactName.trim() || !recruiterForm.email.trim()) {
      setRecruiterMessage('Please enter your company name, your name, and email.')
      return
    }

    const authData = {
      companyName: recruiterForm.companyName.trim(),
      contactName: recruiterForm.contactName.trim(),
      email: recruiterForm.email.trim(),
      hiringFocus: recruiterForm.hiringFocus.trim(),
      location: recruiterForm.location.trim(),
      companySize: recruiterForm.companySize.trim(),
      website: recruiterForm.website.trim(),
      about: recruiterForm.about.trim()
    }

    localStorage.setItem('nexfolio-recruiter-auth-v3', JSON.stringify(authData))
    setIsRecruiterSignedIn(true)
    setCurrentPage('home')
    setRecruiterMessage(`Welcome aboard, ${authData.contactName}. ${authData.companyName} is ready to hire.`)
  }

  const handleRecruiterSignOut = () => {
    localStorage.removeItem('nexfolio-recruiter-auth-v3')
    setIsRecruiterSignedIn(false)
    setRecruiterMessage('Signed out')
    setCurrentPage('home')
    setRecruiterForm(defaultRecruiterForm)
  }

  const handleJobChange = (event) => {
    const { name, value } = event.target
    setJobForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleJobSubmit = (event) => {
    event.preventDefault()

    if (!jobForm.title.trim() || !jobForm.location.trim() || !jobForm.description.trim()) {
      setJobMessage('Please add a title, location, and job description.')
      return
    }

    const newJob = {
      id: `${Date.now()}`,
      title: jobForm.title.trim(),
      location: jobForm.location.trim(),
      type: jobForm.type,
      experience: jobForm.experience.trim() || 'Flexible',
      salary: jobForm.salary.trim() || 'Competitive',
      hybrid: jobForm.hybrid,
      description: jobForm.description.trim(),
      perks: jobForm.perks.trim() || 'Great team, strong growth opportunity'
    }

    setJobs((prev) => [newJob, ...prev])
    setJobForm(defaultJobForm)
    setJobMessage('Job posted successfully')
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
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
          <button type="button" className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => handleNavigate('home')}>Home</button>
          {isCreatorSignedIn ? (
            <button type="button" className={`nav-link ${currentPage === 'post-work' ? 'active' : ''}`} onClick={() => handleNavigate('post-work')}>Post Work</button>
          ) : (
            <button type="button" className={`nav-link ${currentPage === 'creator' ? 'active' : ''}`} onClick={() => handleNavigate('creator')}>Creator Sign up</button>
          )}
          {isRecruiterSignedIn ? (
            <button type="button" className={`nav-link ${currentPage === 'post-job' ? 'active' : ''}`} onClick={() => handleNavigate('post-job')}>Post Job</button>
          ) : (
            <button type="button" className={`nav-link ${currentPage === 'recruiter' ? 'active' : ''}`} onClick={() => handleNavigate('recruiter')}>Recruiter Sign up</button>
          )}
        </div>
      </nav>

      {currentPage === 'home' && !isCreatorSignedIn && !isRecruiterSignedIn && (
        <>
          <section className="hero">
            <div className="hero-content">
              <h1>Showcase Your Talent.</h1>
              <h2>Get Discovered.</h2>

              <p>
                Nexfolio connects creative professionals with recruiters through
                beautiful digital portfolios.
              </p>

              <div className="buttons">
                <button type="button" className="primary" onClick={() => handleNavigate('creator')}>Create Profile</button>
                <button type="button" className="secondary" onClick={() => handleNavigate('recruiter')}>Join as Recruiter</button>
              </div>
            </div>
          </section>

          <section className="features">
            <h2>Why Nexfolio?</h2>

            <div className="feature-container">
              <div className="feature-card">
                <h3>🧑‍💻 Build Your Portfolio</h3>
                <p>
                  Creatives can feature their best work, experience, and achievements in one polished profile.
                </p>
              </div>

              <div className="feature-card">
                <h3>🔍 Discover Talent</h3>
                <p>
                  Recruiters can browse strong candidates, view portfolios, and shortlist people quickly.
                </p>
              </div>

              <div className="feature-card">
                <h3>🚀 Apply and Hire</h3>
                <p>
                  Candidates can apply for roles while businesses post jobs and track talent in one place.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {currentPage === 'home' && (isCreatorSignedIn || isRecruiterSignedIn) && (
        <section className="social-profile">
          <div className="social-shell">
            <div className="profile-card">
              <h2>{isRecruiterSignedIn ? 'Your recruiter home' : 'Your creative home'}</h2>
              <p className="page-intro">
                {isRecruiterSignedIn
                  ? 'Share your company story, post opportunities, and keep your hiring momentum moving.'
                  : 'Share your latest work, stay visible, and keep your profile fresh for recruiters.'}
              </p>

              <div className="profile-hero">
                <div className="avatar large-avatar">
                  {(isRecruiterSignedIn ? recruiterForm.contactName : profile.name).charAt(0) || 'N'}
                </div>
                <div className="profile-header">
                  <h3>{isRecruiterSignedIn ? recruiterForm.contactName || 'Recruiter' : profile.name || 'Creator'}</h3>
                  <p>{isRecruiterSignedIn ? recruiterForm.companyName || 'Hiring team' : profile.title || 'Creative professional'}</p>
                </div>
              </div>

              <div className="profile-highlights">
                <div className="highlight-card">
                  <h4>Quick actions</h4>
                  <div className="buttons" style={{ justifyContent: 'flex-start', marginTop: '8px' }}>
                    {isRecruiterSignedIn ? (
                      <button type="button" className="primary" onClick={() => handleNavigate('post-job')}>Post a job</button>
                    ) : (
                      <button type="button" className="primary" onClick={() => handleNavigate('post-work')}>Post your work</button>
                    )}
                    <button type="button" className="secondary" onClick={() => handleNavigate('home')}>Refresh feed</button>
                    <button type="button" className="secondary" onClick={isRecruiterSignedIn ? handleRecruiterSignOut : handleCreatorSignOut}>Sign out</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="feed-card">
              <div className="composer">
                <textarea
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  rows="3"
                  placeholder={isRecruiterSignedIn ? 'Share a hiring update or company milestone' : 'Share a quick update, project, or milestone'}
                />
                <label className="upload-btn">
                  Upload photos & videos
                  <input type="file" accept="image/*,video/*" multiple onChange={handleUpload} />
                </label>
              </div>

              <div className="feed-list">
                {posts.length === 0 ? (
                  <div className="empty-state">
                    {isRecruiterSignedIn
                      ? 'Your social home is ready. Share your company story and keep candidates engaged.'
                      : 'Your profile is ready. Upload your first post to start building your presence.'}
                  </div>
                ) : (
                  posts.map((post) => (
                    <article className="feed-item" key={post.id}>
                      {post.type === 'image' ? <img src={post.url} alt={post.caption} /> : <video controls src={post.url} />}
                      <p>{post.caption}</p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'creator' && (
        <section className="social-profile">
          <div className="social-shell">
            <div className="profile-card">
              <h2>Create your creative profile</h2>
              <p className="page-intro">Showcase your previous work, build a profile, and apply to jobs.</p>

              {!isCreatorSignedIn ? (
                <form className="profile-form auth-form" onSubmit={handleCreatorSubmit}>
                  <label>
                    Your name
                    <input name="name" value={creatorForm.name} onChange={handleCreatorChange} />
                  </label>

                  <label>
                    Email
                    <input name="email" value={creatorForm.email} onChange={handleCreatorChange} />
                  </label>

                  <button className="primary auth-btn" type="submit">Create account</button>
                  {creatorMessage ? <p className="auth-message">{creatorMessage}</p> : null}
                </form>
              ) : (
                <div className="signed-in-card">
                  <p className="auth-message">{creatorMessage}</p>
                  <button className="secondary auth-btn" type="button" onClick={handleCreatorSignOut}>Sign out</button>
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
      )}

      {currentPage === 'post-job' && isRecruiterSignedIn && (
        <section className="page-shell dashboard-shell">
          <div className="page-card page-hero-card">
            <div className="page-badge">Recruiter Dashboard</div>
            <h2>Welcome back to your hiring workspace</h2>
            <p>
              Post new roles, manage openings, and connect with creators from one professional dashboard.
            </p>
          </div>

          <div className="dashboard-grid">
            <div className="page-card">
              <h3>Post a new job</h3>
              <form className="profile-form" onSubmit={handleJobSubmit}>
                <label>
                  Job title
                  <input name="title" value={jobForm.title} onChange={handleJobChange} placeholder="Senior Product Designer" />
                </label>

                <label>
                  Location
                  <input name="location" value={jobForm.location} onChange={handleJobChange} placeholder="London, Hybrid" />
                </label>

                <label>
                  Job type
                  <select name="type" value={jobForm.type} onChange={handleJobChange}>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </label>

                <label>
                  Years of experience
                  <input name="experience" value={jobForm.experience} onChange={handleJobChange} placeholder="3+ years" />
                </label>

                <label>
                  Salary / package
                  <input name="salary" value={jobForm.salary} onChange={handleJobChange} placeholder="£80k - £95k" />
                </label>

                <label>
                  Working style
                  <select name="hybrid" value={jobForm.hybrid} onChange={handleJobChange}>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </label>

                <label>
                  Job description
                  <textarea name="description" rows="4" value={jobForm.description} onChange={handleJobChange} placeholder="Describe the role, responsibilities, and ideal profile" />
                </label>

                <label>
                  Perks / benefits
                  <textarea name="perks" rows="2" value={jobForm.perks} onChange={handleJobChange} placeholder="Bonus, learning budget, health cover" />
                </label>

                <button className="primary auth-btn" type="submit">Publish job</button>
                {jobMessage ? <p className="auth-message">{jobMessage}</p> : null}
              </form>
            </div>

            <div className="page-card">
              <h3>Live jobs board</h3>
              {jobs.length === 0 ? (
                <div className="empty-state">No jobs posted yet. Create your first opportunity to attract talent.</div>
              ) : (
                <div className="job-list">
                  {jobs.map((job) => (
                    <article className="job-card" key={job.id}>
                      <div className="job-card-top">
                        <h4>{job.title}</h4>
                        <span>{job.type}</span>
                      </div>
                      <p>{job.location}</p>
                      <p>{job.hybrid} • {job.experience}</p>
                      <p>{job.description}</p>
                      <div className="job-meta">
                        <span>{job.salary}</span>
                        <span>{job.perks}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {currentPage === 'post-work' && isCreatorSignedIn && (
        <section className="social-profile">
          <div className="social-shell">
            <div className="profile-card">
              <h2>Post your work</h2>
              <p className="page-intro">Showcase your projects, add a polished profile, and share updates with recruiters.</p>

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
                  <h3>{profile.name || 'Your Name'}</h3>
                  <p>{profile.title || 'Your headline'}</p>
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
                  <div className="empty-state">Your profile is ready. Upload your first photo or video to start building your feed.</div>
                ) : (
                  posts.map((post) => (
                    <article className="feed-item" key={post.id}>
                      {post.type === 'image' ? <img src={post.url} alt={post.caption} /> : <video controls src={post.url} />}
                      <p>{post.caption}</p>
                    </article>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {currentPage === 'recruiter' && (
        <section className="page-shell recruiter-page">
          <div className="page-card page-hero-card">
            <div className="page-badge">Executive Hiring</div>
            <h2>Give your team access to elite creative talent</h2>
            <p>
              Recruiters and founders can create a premium business profile, discover curated portfolios, and build high-quality teams with confidence.
            </p>
          </div>

          <div className="recruiter-shell">
            <div className="page-card recruiter-card">
              <h3>Company profile</h3>
              {!isRecruiterSignedIn ? (
                <form className="profile-form" onSubmit={handleRecruiterSubmit}>
                  <label>
                    Company name
                    <input name="companyName" value={recruiterForm.companyName} onChange={handleRecruiterChange} />
                  </label>

                  <label>
                    Your name
                    <input name="contactName" value={recruiterForm.contactName} onChange={handleRecruiterChange} />
                  </label>

                  <label>
                    Email
                    <input name="email" value={recruiterForm.email} onChange={handleRecruiterChange} />
                  </label>

                  <label>
                    Company size
                    <input name="companySize" value={recruiterForm.companySize} onChange={handleRecruiterChange} placeholder="1-10, 11-50, 50+" />
                  </label>

                  <label>
                    Hiring focus
                    <input name="hiringFocus" value={recruiterForm.hiringFocus} onChange={handleRecruiterChange} placeholder="Design, Marketing, Product" />
                  </label>

                  <label>
                    Location
                    <input name="location" value={recruiterForm.location} onChange={handleRecruiterChange} placeholder="London, Remote, UK" />
                  </label>

                  <label>
                    Website
                    <input name="website" value={recruiterForm.website} onChange={handleRecruiterChange} placeholder="https://yourcompany.com" />
                  </label>

                  <label>
                    About your company
                    <textarea name="about" rows="3" value={recruiterForm.about} onChange={handleRecruiterChange} placeholder="Tell creatives why your company is a great place to work" />
                  </label>

                  <button className="primary auth-btn" type="submit">Create recruiter account</button>
                  {recruiterMessage ? <p className="auth-message">{recruiterMessage}</p> : null}
                </form>
              ) : (
                <div className="signed-in-card">
                  <p className="auth-message">{recruiterMessage}</p>
                  <button className="secondary auth-btn" type="button" onClick={() => handleNavigate('dashboard')}>Open dashboard</button>
                  <button className="secondary auth-btn" type="button" onClick={handleRecruiterSignOut}>Sign out</button>
                </div>
              )}
            </div>

            <div className="page-grid">
              <div className="page-card">
                <h3>Access premium talent</h3>
                <p>Unlock curated portfolios and discover standout candidates before the market catches up.</p>
              </div>
              <div className="page-card">
                <h3>Build a trusted brand</h3>
                <p>Present your company professionally and attract the right creatives to your mission.</p>
              </div>
              <div className="page-card">
                <h3>Move faster</h3>
                <p>Review portfolios, shortlist candidates, and connect with top talent from one elevated workspace.</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default App