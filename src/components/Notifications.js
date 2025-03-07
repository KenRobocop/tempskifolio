import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Import Firestore

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState({
    news: [],
    application: [],
    interview: [],
  });
  const [activeTab, setActiveTab] = useState("news");

  useEffect(() => {
    // Function to update notifications safely
    const updateNotifications = (type, snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications((prev) => ({
        ...prev,
        [type]: newNotifications, // Update only the specific notification type
      }));
    };

    // Listeners for Firestore
    const unsubscribeJobs = onSnapshot(query(collection(db, "jobNotifications")), (snapshot) => {
      updateNotifications("news", snapshot);
    });

    const unsubscribeApplications = onSnapshot(query(collection(db, "applicationNotifications")), (snapshot) => {
      updateNotifications("application", snapshot);
    });

    const unsubscribeInterviews = onSnapshot(query(collection(db, "interviewNotifications")), (snapshot) => {
      updateNotifications("interview", snapshot);
    });

    // Cleanup Firestore listeners
    return () => {
      unsubscribeJobs();
      unsubscribeApplications();
      unsubscribeInterviews();
    };
  }, []);

  return (
    <div className="notification-page">
      <h2>Notifications</h2>
      <div className="tabs">
        {Object.keys(notifications).map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="notification-content">
        <ul>
          {notifications[activeTab]?.length > 0 ? (
            notifications[activeTab].map((notif) => (
              <li key={notif.id}>
                <Link to={notif.route || "#"}>{notif.message}</Link>
              </li>
            ))
          ) : (
            <li>No new notifications</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationPanel;
