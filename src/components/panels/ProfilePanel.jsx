export function ProfilePanel({ user }) {
  return (
    <section className="panel" id="profile">
      <p className="eyebrow">Profile</p>
      <h2>{user.name}</h2>
      <div className="profile-card">
        <div className="avatar-upload">Photo</div>
        <div>
          <strong>{user.id}</strong>
          <p className="muted">{user.program || user.department}</p>
          <p className="muted">Contact: {user.email || "student@leapstart.in"}</p>
          <button className="secondary-btn">Upload Photo</button>
        </div>
      </div>
    </section>
  );
}
