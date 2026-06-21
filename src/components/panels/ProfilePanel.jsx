import { useState } from "react";

export function ProfilePanel({ user, roleLabel = "Student" }) {
  const [photo, setPhoto] = useState("");
  const [profile, setProfile] = useState({
    subjects: user.role === "faculty" ? "AI Foundations, Data Wrangling, Model Evaluation" : "Linux, Networking, Database, Frontend",
    status: user.role === "faculty" ? "Available for doubt sessions and rubric review." : "Preparing for upcoming lab assessments.",
    bio: user.role === "faculty"
      ? "Project-first educator focused on practical AI, data science, and exam readiness."
      : "Computer Science learner building strong fundamentals through hands-on assessments.",
  });

  function handlePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  }

  function updateProfile(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="panel wide" id="profile">
      <p className="eyebrow">Profile</p>
      <div className="profile-editor-head">
        <h2>{user.name}</h2>
        <span className="course-tag">{roleLabel}</span>
      </div>

      <div className="profile-editor">
        <label className="profile-photo-picker">
          {photo ? <img src={photo} alt={`${user.name} profile`} /> : <span>Photo</span>}
          <input accept="image/*" type="file" onChange={handlePhotoChange} />
          <b>Upload Photo</b>
        </label>

        <div>
          <strong>{user.id}</strong>
          <p className="muted">{user.program || user.department}</p>
          <p className="muted">Contact: {user.email || "student@leapstart.in"}</p>
        </div>
      </div>

      <div className="profile-form-grid">
        <label>
          Subjects
          <input value={profile.subjects} onChange={(event) => updateProfile("subjects", event.target.value)} />
        </label>
        <label>
          Status
          <input value={profile.status} onChange={(event) => updateProfile("status", event.target.value)} />
        </label>
        <label className="wide-field">
          Short description
          <textarea value={profile.bio} onChange={(event) => updateProfile("bio", event.target.value)} />
        </label>
      </div>
    </section>
  );
}
