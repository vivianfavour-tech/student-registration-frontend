import React, { useState } from "react";

const studentsApiUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/students").replace(/\/+$/, "");

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function Brand() {
  return (
    <a className="brand" href="#" aria-label="Vivian University home">
      <svg className="brand-mark" viewBox="0 0 48 52" fill="none" aria-hidden="true">
        <path d="M7.5 5.5h33v22.1c0 10.1-7.3 16.3-16.5 20.8C14.8 43.9 7.5 37.7 7.5 27.6V5.5Z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11.5 9.5h25v18.1c0 7.6-5.2 12.8-12.5 16.6-7.3-3.8-12.5-9-12.5-16.6V9.5Z" stroke="currentColor" strokeWidth=".7" opacity=".65" />
        <path d="m16.5 17 7.5 18 7.5-18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m24 3 .8 1.7 1.7.3-1.3 1.2.3 1.8L24 7.2l-1.5.8.3-1.8-1.3-1.2 1.7-.3L24 3Z" fill="#B78651" />
      </svg>
      <span className="brand-name">Vivian <span>UNIVERSITY</span></span>
    </a>
  );
}

function Field({ label, required, children, className = "" }) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">{label}{required && <span className="required"> *</span>}</span>
      {children}
    </label>
  );
}

function Input({ value, onChange, ...props }) {
  return <input value={value} onChange={onChange} {...props} />;
}

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState({});
  const [submittedStudent, setSubmittedStudent] = useState(null);
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeView, setActiveView] = useState("register");
  const [applications, setApplications] = useState([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");

  const showApplications = async () => {
    setActiveView("applications");
    setApplicationsError("");
    setIsLoadingApplications(true);

    try {
      const response = await fetch(studentsApiUrl);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not load applications.");
      }

      setApplications(result);
    } catch (error) {
      setApplicationsError(error.message || "Could not connect to the registration service.");
    } finally {
      setIsLoadingApplications(false);
    }
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Please enter your name.";
    if (!course) nextErrors.course = "Please select a course.";
    setErrors(nextErrors);
    setApiError("");
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${studentsApiUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), course }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not submit your application.");
      }

      setSubmittedStudent(result.student);
    } catch (error) {
      setApiError(error.message || "Could not connect to the registration service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <Brand />
        <div className="topbar-right">
          <button
            className="view-applications-button"
            type="button"
            onClick={() => {
              if (activeView === "applications") {
                setActiveView("register");
              } else {
                showApplications();
              }
            }}
          >
            {activeView === "applications" ? "New application" : "View applications"}
          </button>
        </div>
      </header>

      <main className="main-layout">
        <aside className="intro-panel">
          <div className="intro-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR FUTURE, IN FOCUS</div>
            <h1>Make room<br />for <em>what's next.</em></h1>
            <p className="intro-description">A great education is the beginning of something bigger. Tell us a little about yourself, and let’s get you there.</p>
            <div className="campus-image" role="img" aria-label="Students walking through a university campus">
              <div className="image-caption">
                <span className="caption-dot" />
                <span>Find your place at Vivian</span>
                <span className="caption-count">01 — 03</span>
              </div>
            </div>
            <div className="quote-block">
              <span className="quote-mark">“</span>
              <p>At Vivian, I found more than a degree. I found the confidence to build my own path.</p>
              <div className="quote-person"><span className="avatar">JM</span><span><strong>Jordan M.</strong><small>Class of 2025 · School of Design</small></span></div>
            </div>
          </div>
          <div className="aside-footer"><span>LEARN WITH PURPOSE.</span><span>LEAD WITH HEART.</span></div>
        </aside>

        <section className="form-panel" aria-label="Student application">
          {activeView === "applications" ? (
            <div className="form-content applications-content">
              <div className="form-heading">
                <div className="form-kicker">STUDENT RECORDS</div>
                <h2>Applications received.</h2>
                <p>Registrations submitted to Vivian University.</p>
              </div>

              {isLoadingApplications ? (
                <p className="applications-status" role="status">Loading applications...</p>
              ) : applicationsError ? (
                <p className="api-error" role="alert">{applicationsError}</p>
              ) : applications.length === 0 ? (
                <p className="applications-status">No applications have been submitted yet.</p>
              ) : (
                <div className="applications-list">
                  <div className="applications-summary">
                    <span>ALL APPLICATIONS</span>
                    <strong>{applications.length}</strong>
                  </div>
                  <div className="applications-table-wrap">
                    <table className="applications-table">
                      <thead>
                        <tr>
                          <th scope="col">Application</th>
                          <th scope="col">Student name</th>
                          <th scope="col">Course</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((student) => (
                          <tr key={student.id}>
                            <td>VU-{String(student.id).padStart(6, "0")}</td>
                            <td>{student.name}</td>
                            <td>{student.course}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <button className="refresh-applications-button" type="button" onClick={showApplications} disabled={isLoadingApplications}>
                Refresh applications
              </button>
            </div>
          ) : !submittedStudent ? (
            <div className="form-content">
              <div className="form-heading">
                <div className="form-kicker">UNDERGRADUATE APPLICATION <span>·</span> FALL 2026</div>
                <h2>Let's get to know you.</h2>
                <p>Enter your name and choose the course you’re interested in.</p>
              </div>

              <form onSubmit={submitApplication} noValidate>
                <div className="section-title"><span>01</span><h3>Application details</h3></div>
                <div className="form-grid">
                  <Field label="Name" required className={`field-full ${errors.name ? "has-error" : ""}`}>
                    <Input
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setErrors((current) => ({ ...current, name: "" }));
                      }}
                      placeholder="Your full name"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && <span className="error-message" id="name-error">{errors.name}</span>}
                  </Field>
                  <Field label="Course" required className={`field-full ${errors.course ? "has-error" : ""}`}>
                    <select
                      value={course}
                      onChange={(event) => {
                        setCourse(event.target.value);
                        setErrors((current) => ({ ...current, course: "" }));
                      }}
                      aria-invalid={Boolean(errors.course)}
                      aria-describedby={errors.course ? "course-error" : undefined}
                    >
                      <option value="">Choose your course</option>
                      <option>Arts &amp; Humanities</option>
                      <option>Business &amp; Economics</option>
                      <option>Computer Science &amp; Technology</option>
                      <option>Education</option>
                      <option>Health &amp; Life Sciences</option>
                      <option>Social Sciences</option>
                    </select>
                    {errors.course && <span className="error-message" id="course-error">{errors.course}</span>}
                  </Field>
                </div>
                <div className="form-actions">
                  <span className="save-note"><Icon name="lock" size={14} /> Your information is secure</span>
                  <button className="primary-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit application"} <Icon name="arrow" size={17} />
                  </button>
                </div>
                {apiError && <p className="api-error" role="alert">{apiError}</p>}
              </form>

              <div className="form-bottom"><span>Need a hand? <a href="mailto:admissions@vivian.edu">Talk to admissions</a></span><span>APPLICATION · 2026</span></div>
            </div>
          ) : (
            <div className="success-content">
              <div className="success-icon"><Icon name="check" size={30} /></div>
              <span className="success-kicker">APPLICATION RECEIVED</span>
              <h2>You're on your way,<br /><em>{submittedStudent.name}.</em></h2>
              <p>Thanks for your interest in <strong>{submittedStudent.course}</strong>. Your application details have been recorded.</p>
              <div className="application-number"><span>YOUR APPLICATION</span><strong>VU-{String(submittedStudent.id).padStart(6, "0")}</strong></div>
              <a className="success-link" href="mailto:admissions@vivian.edu">Questions? We’re here to help <Icon name="arrow" size={16} /></a>
              <div className="success-footer"><Icon name="spark" size={18} /><span>We can’t wait to see what you’ll make of this.</span></div>
            </div>
          )}
        </section>
      </main>
      <footer className="mobile-footer">© 2026 Vivian University <span>·</span> A place to become.</footer>
    </div>
  );
}

export default App;
