import { useState } from "react";
import { notifications } from "../data/mockData";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div className="notification-wrap">
      <button className="icon-btn" onClick={() => setOpen((value) => !value)} aria-label="Notifications">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="topbar-icon">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      {open && (
        <div className="notification-popover">
          <strong>Notifications</strong>
          {notifications.map((item) => (
            <div className="notification-item" key={item.id}>
              <span>{item.title}</span>
              <small>{item.time}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
