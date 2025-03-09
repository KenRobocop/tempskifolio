import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";


const NotificationPanel = () => {
  const [notifications, setNotifications] = useState({
    news: [],
    application: [],
  });
  const [activeTab, setActiveTab] = useState("news");


  useEffect(() => {
    setNotifications({
      news: [
        { id: 1, message: "New job posting available!", route: "/applicant/search-jobs" },
        { id: 4, message: "Visit Ski-Folio", route: "/" }
      ],
      application: [
        { id: 2, message: "Your application has been viewed!", route: "/applicant/profile" }
      ],
    });
  }, []);


  return (
    <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
      <h2>Notifications</h2>
      <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
        {Object.keys(notifications).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            style={{ flex: "1", textAlign: "center", padding: "10px", border: "1px", background: "#4ad4d4", cursor: "pointer" }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="notification-content">
        <ul>
          {notifications[activeTab].length > 0 ? (
            notifications[activeTab].map((notif) => (
              <li key={notif.id} className="notification-item">
                <Link to={notif.route}>{notif.message}</Link>
              </li>
            ))
          ) : (
            <li>
              {activeTab === "application"? (
                "They are still currently reviewing your application."
              ) : (
                "No new notifications"
              )}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};


export default NotificationPanel;