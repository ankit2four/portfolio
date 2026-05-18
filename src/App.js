import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AutoChatWidget from './components/AutoChatWidget';

gsap.registerPlugin(ScrollTrigger);

const asset = (path) => `${process.env.PUBLIC_URL}${path}`;

function App() {
  const cursorRef = useRef(null);
  const [avatarOpen, setAvatarOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ smooth: true });
    const progressEl = document.querySelector('.progress');
    const root = document.documentElement;
    let orbitAngle = 0;

    const onScroll = ({ scroll, limit, velocity }) => {
      if (progressEl) progressEl.style.width = `${(scroll / limit) * 100}%`;
      if (typeof velocity === 'number') {
        orbitAngle += velocity * 0.08; // slower scroll-driven rotation; down = clockwise, up = anticlockwise
        root.style.setProperty('--orbit-rotation', `${orbitAngle}deg`);
      }
    };

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    lenis.on('scroll', onScroll);
    requestAnimationFrame(raf);

    const cursor = cursorRef.current;
    const handleMove = (e) => {
      if (!cursor) return;
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    window.addEventListener('mousemove', handleMove);

    const magnets = document.querySelectorAll('.magnetic');
    const magnetMove = (btn) => (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) / 5}px, ${(e.clientY - r.top - r.height / 2) / 5}px)`;
    };
    const magnetLeave = (btn) => () => {
      btn.style.transform = 'translate(0,0)';
    };
    magnets.forEach((btn) => {
      btn.addEventListener('mousemove', magnetMove(btn));
      btn.addEventListener('mouseleave', magnetLeave(btn));
    });

    gsap.fromTo(
      '.reveal',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 1.1,
        ease: 'power3.out',
        clearProps: 'all', // remove inline styles after anim so elements stay clean
      }
    );

    gsap.utils.toArray('section').forEach((sec) => {
      gsap.fromTo(
        sec,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
            once: true,
          },
          clearProps: 'all',
        }
      );
    });

    return () => {
      lenis.destroy();
      window.removeEventListener('mousemove', handleMove);
      magnets.forEach((btn) => {
        btn.removeEventListener('mousemove', magnetMove(btn));
        btn.removeEventListener('mouseleave', magnetLeave(btn));
      });
    };
  }, []);

  return (
    <div className="App">
      <div className="progress" />
      <div className="cursor" ref={cursorRef} />
      <header>
        <strong>Ankit Singh</strong>
        <nav>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="hero">
        <div className="hero-variants">
          <div className="hero-card hero-opt2">
            <div className="hero-top">
              <div>
                <p className="eyebrow">SDE · Full-stack</p>
                <h1 className="reveal">Hi, I’m Ankit</h1>
                <p className="subtext">I ship secure, scalable web experiences with strong UI foundations and reliable backends.</p>
              </div>
              <a href="#projects" className="btn ghost magnetic hero-badge">5+ Projects</a>
            </div>
            <div className="hero-actions">
              <a href="mailto:mmail2ankit1234@gmail.com" className="btn primary magnetic">Let’s Talk</a>
              <a
                className="btn ghost magnetic"
                href={asset('/ResumeAnkit.pdf')}
                download="Ankit-Singh-Resume.pdf"
              >
                Download Resume
              </a>
              <a href="#experience" className="btn ghost magnetic">Experience</a>
              <a href="https://github.com/ankit2four" className="btn ghost magnetic" target="_blank" rel="noreferrer">GitHub</a>
            </div>
            <button
              type="button"
              className="hero-avatar"
              aria-label="View profile photo"
              onClick={() => setAvatarOpen(true)}
            >
              <img src={asset('/Profile.jpg')} alt="Ankit Singh" />
            </button>
          </div>
        </div>
      </section>

      {avatarOpen && (
        <div
          className="avatar-overlay"
          onMouseLeave={() => setAvatarOpen(false)}
          onClick={() => setAvatarOpen(false)}
        >
          <div className="avatar-overlay-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="avatar-overlay-close"
              aria-label="Close profile photo"
              onClick={() => setAvatarOpen(false)}
            >
              ×
            </button>
            <img src={asset('/Profile.jpg')} alt="Ankit Singh" />
          </div>
        </div>
      )}

      <section id="about">
        <h3 className="section-title">About</h3>
        <div className="about-card about-opt1">
          <h4>Building scalable, secure products</h4>
          <p className="subtext">Software Development Engineer experienced in full-stack development, REST APIs, authentication, and scalable architectures. Focused on performant, resilient products with clean, maintainable code.</p>
          <div className="stat-row">
            <div className="stat">
              <div className="stat-value">5+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat">
              <div className="stat-value">Full-stack</div>
              <div className="stat-label">SDE</div>
            </div>
            <div className="stat">
              <div className="stat-value">Secure</div>
              <div className="stat-label">Auth / APIs</div>
            </div>
          </div>
        </div>
      </section>

      <section id="experience">
        <h3 className="section-title">Experience</h3>
        <div className="experience-variants">
          <div className="exp-card exp-opt2">
            <div className="exp-grid">
              <div className="exp-tile">
                <strong>LTIMindtree · SDE</strong>
                <p className="muted">Dec 2024 – Present</p>
                <p>Enterprise apps, APIs, JWT auth, scalable UI modules; SDLC + reviews.</p>
              </div>
              <div className="exp-tile">
                <strong>Deloitte · Virtual Experience</strong>
                <p className="muted">Sep 2022 – Oct 2022</p>
                <p>Software, security, and data simulations; structured workflows.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects">
        <h3 className="section-title">Projects</h3>
        <div className="projects">
          <div className="card">
            <div className="project-head">
              <strong>Bakery Management Web Application</strong>
              <span className="project-date">May 2026</span>
            </div>

            <p className="project-desc">
              Production-oriented full-stack bakery management PWA with role-based access,
              scalable REST APIs, JWT authentication, Cloudinary uploads, analytics,
              and order management workflows for customers, admins, and staff.
            </p>

            <div className="project-preview">
              <iframe
                title="Bakery Management App live preview"
                src="https://store-client-theta.vercel.app/"
                loading="lazy"
                allow="clipboard-write; clipboard-read"
              />
            </div>

            <div className="chips">
              <span className="chip">React</span>
              <span className="chip">Node.js</span>
              <span className="chip">MongoDB</span>
              <span className="chip">JWT</span>
              <span className="chip">Cloudinary</span>
              <span className="chip">PWA</span>
            </div>

            <div className="project-actions">
              <a
                className="btn primary magnetic"
                href="https://store-client-theta.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Live demo
              </a>
            </div>
          </div>
          <div className="card">
            <div className="project-head">
              <strong>Intellichat – AI-Powered Full-Stack Application</strong>
              <span className="project-date">June 2024</span>
            </div>
            <p className="project-desc">AI chat platform for brainstorming, learning support, and translation. Secure auth, session management, and scalable UX-focused architecture.</p>
            <div className="project-preview">
              <iframe
                title="Intellichat live preview"
                src="https://intelli-chat-1-0-68aw.vercel.app/"
                loading="lazy"
                allow="clipboard-write; clipboard-read; microphone; camera; geolocation"
              />
            </div>
            <div className="chips">
              <span className="chip">React</span>
              <span className="chip">Node</span>
              <span className="chip">Auth</span>
            </div>
            <div className="project-actions">
              <a
                className="btn primary magnetic"
                href="https://intelli-chat-1-0-68aw.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                Live demo
              </a>
            </div>
          </div>
          <div className="card">
            <div className="project-head">
              <strong>Hand Gesture-Based Volume & Brightness Controller</strong>
              <span className="project-date">April 2022</span>
            </div>
            <p className="project-desc">Computer-vision system enabling touchless volume and brightness control with real-time gesture recognition and visual feedback.</p>
            <div className="project-preview">
              <a
                href="https://github.com/ankit2four/projects"
                target="_blank"
                rel="noreferrer"
                aria-label="Open GitHub project repository"
              >
                <img src={asset('/Github.png')} alt="GitHub project cover" />
              </a>
            </div>
            <div className="chips">
              <span className="chip">OpenCV</span>
              <span className="chip">Python</span>
              <span className="chip">Real-time</span>
            </div>
            <div className="project-actions">
              <a
                className="btn primary magnetic"
                href="https://github.com/ankit2four/projects"
                target="_blank"
                rel="noreferrer"
              >
                View repo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <h3 className="section-title">Skills</h3>
        <div className="skills-radial">
          <div className="radial-core reveal">
            <span className="pill">Toolkit</span>
            <p className="muted">Frontend · Backend · Cloud</p>
          </div>

          <div className="orbit orbit-inner">
            <div className="orbit-item" style={{ '--i': 0, '--angle': '0deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/icons8-react-100.png')} alt="React logo" />
                <span className="orbit-label">React</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.88 }} />
                  </div>
                  <span className="orbit-meter-label">88%</span>
                </div>
              </div>
            </div>
            <div className="orbit-item" style={{ '--i': 1, '--angle': '72deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/node-js.png')} alt="Node.js logo" />
                <span className="orbit-label">Node.js</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.83 }} />
                  </div>
                  <span className="orbit-meter-label">83%</span>
                </div>
              </div>
            </div>
            <div className="orbit-item" style={{ '--i': 2, '--angle': '144deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/mongodb.png')} alt="MongoDB logo" />
                <span className="orbit-label">MongoDB</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.81 }} />
                  </div>
                  <span className="orbit-meter-label">81%</span>
                </div>
              </div>
            </div>
            <div className="orbit-item" style={{ '--i': 3, '--angle': '216deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/typescript.png')} alt="TypeScript logo" />
                <span className="orbit-label">TypeScript</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.86 }} />
                  </div>
                  <span className="orbit-meter-label">86%</span>
                </div>
              </div>
            </div>
            <div className="orbit-item" style={{ '--i': 4, '--angle': '288deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/tailwind-css.png')} alt="Tailwind CSS logo" />
                <span className="orbit-label">Tailwind CSS</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.84 }} />
                  </div>
                  <span className="orbit-meter-label">84%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="orbit orbit-outer">
            <div className="orbit-item" style={{ '--i': 0, '--angle': '36deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/javascript (1).png')} alt="JavaScript logo" />
                <span className="orbit-label">JavaScript</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.9 }} />
                  </div>
                  <span className="orbit-meter-label">90%</span>
                </div>
              </div>
            </div>
            <div className="orbit-item" style={{ '--i': 1, '--angle': '108deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/python.png')} alt="Python logo" />
                <span className="orbit-label">Python</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.82 }} />
                  </div>
                  <span className="orbit-meter-label">82%</span>
                </div>
              </div>
            </div>
            <div className="orbit-item" style={{ '--i': 2, '--angle': '180deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/git.png')} alt="Git logo" />
                <span className="orbit-label">Git</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.85 }} />
                  </div>
                  <span className="orbit-meter-label">85%</span>
                </div>
              </div>
            </div>
            <div className="orbit-item" style={{ '--i': 3, '--angle': '252deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/github-logo.png')} alt="GitHub logo" />
                <span className="orbit-label">GitHub</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.87 }} />
                  </div>
                  <span className="orbit-meter-label">87%</span>
                </div>
              </div>
            </div>
            <div className="orbit-item" style={{ '--i': 4, '--angle': '324deg' }}>
              <div className="orbit-item-content">
                <img className="orbit-icon" src={asset('/icons8-jwt-color/icons8-jwt-48.png')} alt="JWT logo" />
                <span className="orbit-label">JWT</span>
                <div className="orbit-meter" aria-hidden="true">
                  <div className="orbit-meter-bar">
                    <div className="orbit-meter-fill" style={{ '--meter': 0.8 }} />
                  </div>
                  <span className="orbit-meter-label">80%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="skills-list" aria-label="Skills proficiency (mobile)">
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/icons8-react-100.png')} alt="React logo" />
                React
              </span>
              <span className="skill-row-value">88%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.88 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/node-js.png')} alt="Node.js logo" />
                Node.js
              </span>
              <span className="skill-row-value">83%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.83 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/mongodb.png')} alt="MongoDB logo" />
                MongoDB
              </span>
              <span className="skill-row-value">81%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.81 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/typescript.png')} alt="TypeScript logo" />
                TypeScript
              </span>
              <span className="skill-row-value">86%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.86 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/tailwind-css.png')} alt="Tailwind CSS logo" />
                Tailwind CSS
              </span>
              <span className="skill-row-value">84%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.84 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/javascript (1).png')} alt="JavaScript logo" />
                JavaScript
              </span>
              <span className="skill-row-value">90%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.9 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/python.png')} alt="Python logo" />
                Python
              </span>
              <span className="skill-row-value">82%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.82 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/git.png')} alt="Git logo" />
                Git
              </span>
              <span className="skill-row-value">85%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.85 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/github-logo.png')} alt="GitHub logo" />
                GitHub
              </span>
              <span className="skill-row-value">87%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.87 }} />
            </div>
          </div>
          <div className="skill-row">
            <div className="skill-row-head">
              <span className="skill-row-name">
                <img className="skill-row-icon" src={asset('/icons8-jwt-color/icons8-jwt-48.png')} alt="JWT logo" />
                JWT
              </span>
              <span className="skill-row-value">80%</span>
            </div>
            <div className="skill-row-bar">
              <div className="skill-row-fill" style={{ '--meter': 0.8 }} />
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <h3 className="section-title">Contact</h3>
        <div className="contact-cta">
          <div className="cta-box">
            <div>
              <p className="eyebrow">Let’s build something</p>
              <h3>Open to SDE roles & collabs</h3>
              <p className="subtext">Quick responses on email or LinkedIn.</p>
            </div>
            <div className="cta-actions">
              <a className="btn primary magnetic" href="mailto:mail2ankit1234@gmail.com">Email</a>
              <a className="btn ghost magnetic" href="https://linkedin.com/in/ankit-singh-638733243">LinkedIn</a>
              <a className="btn ghost magnetic" href="https://github.com/ankit2four">GitHub</a>
            </div>
          </div>
        </div>
      </section>
      <footer>© 2025 Ankit Singh</footer>
      <AutoChatWidget />
    </div>
  );
}

export default App;
