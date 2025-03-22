// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles.css";


// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState({
//     news: [],
//     application: [],
//   });
//   const [activeTab, setActiveTab] = useState("news");


//   useEffect(() => {
//     setNotifications({
//       news: [
//         { id: 1, message: "New job posting available!", route: "/applicant/search-jobs" },
//         { id: 4, message: "Visit Ski-Folio", route: "/" }
//       ],
//       application: [
//         { id: 2, message: "Your application has been viewed!", route: "/applicant/profile" }
//       ],
//     });
//   }, []);


//   return (
//     <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
//       <h2>Notifications</h2>
//       <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
//         {Object.keys(notifications).map((tab) => (
//           <button
//             key={tab}
//             className={`tab-button ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//             style={{ flex: "1", textAlign: "center", padding: "10px", border: "1px", background: "#4ad4d4", cursor: "pointer" }}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="notification-content">
//         <ul>
//           {notifications[activeTab].length > 0 ? (
//             notifications[activeTab].map((notif) => (
//               <li key={notif.id} className="notification-item">
//                 <Link to={notif.route}>{notif.message}</Link>
//               </li>
//             ))
//           ) : (
//             <li>
//               {activeTab === "application"? (
//                 "They are still currently reviewing your application."
//               ) : (
//                 "No new notifications"
//               )}
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };


// export default NotificationPanel;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { db, auth } from "../firebase"; // Import Firestore & Auth
// import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles.css";

// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState({
//     news: [],
//     application: [],
//   });
//   const [activeTab, setActiveTab] = useState("news");
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const fetchUserType = async () => {
//       if (auth.currentUser) {
//         const userRef = doc(db, "applicants", auth.currentUser.uid);
//         const employerRef = doc(db, "employers", auth.currentUser.uid);

//         const userSnap = await getDoc(userRef);
//         const employerSnap = await getDoc(employerRef);

//         if (userSnap.exists()) {
//           setUserType("applicant");
//         } else if (employerSnap.exists()) {
//           setUserType("employer");
//         }
//       }
//     };

//     const fetchNotifications = async () => {
//       const newsCollection = collection(db, "news");
//       const querySnapshot = await getDocs(newsCollection);
//       const fetchedNews = querySnapshot.docs.map((doc) => doc.data());

//       if (userType === "applicant") {
//         setNotifications({
//           news: fetchedNews,
//           application: [
//             { id: 1, message: "Your application has been viewed!", route: "/applicant/profile" },
//           ],
//         });
//       } else if (userType === "employer") {
//         // Fetch job applications linked to this employer's job posts
//         const employerJobPostsQuery = query(collection(db, "jobs"), where("employerId", "==", auth.currentUser.uid));
//         const jobPostsSnapshot = await getDocs(employerJobPostsQuery);
//         const jobPosts = jobPostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

//         let applications = [];
//         for (const job of jobPosts) {
//           const applicationsQuery = collection(db, "jobs", job.id, "applications");
//           const applicationsSnapshot = await getDocs(applicationsQuery);

//           applications = applicationsSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             message: `New applicant for ${job.title}!`,
//             route: "/employer/profile",
//           }));
//         }

//         setNotifications({
//           news: fetchedNews,
//           application: applications.length > 0 ? applications : [{ id: 2, message: "No new applications.", route: "#" }],
//         });
//       }
//     };

//     fetchUserType().then(fetchNotifications);
//   }, [userType]);

//   return (
//     <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
//       <h2>Notifications</h2>
//       <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
//         {Object.keys(notifications).map((tab) => (
//           <button
//             key={tab}
//             className={`tab-button ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//             style={{ flex: "1", textAlign: "center", padding: "10px", background: "#4ad4d4", cursor: "pointer" }}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="notification-content">
//         <ul>
//           {notifications[activeTab].length > 0 ? (
//             notifications[activeTab].map((notif, index) => (
//               <li key={index} className="notification-item">
//                 <Link to={notif.route}>{notif.message}</Link>
//               </li>
//             ))
//           ) : (
//             <li>
//               {activeTab === "application" ? "No new application updates." : "No new notifications."}
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default NotificationPanel;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { db, auth } from "../firebase";
// import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles.css";

// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState({
//     news: [],
//     application: [],
//   });
//   const [activeTab, setActiveTab] = useState("news");
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const fetchUserType = async () => {
//       if (auth.currentUser) {
//         const userRef = doc(db, "applicants", auth.currentUser.uid);
//         const employerRef = doc(db, "employers", auth.currentUser.uid);

//         const userSnap = await getDoc(userRef);
//         const employerSnap = await getDoc(employerRef);

//         if (userSnap.exists()) {
//           setUserType("applicant");
//         } else if (employerSnap.exists()) {
//           setUserType("employer");
//         }
//       }
//     };

//     const fetchNotifications = async () => {
//       const newsCollection = collection(db, "news");
//       const querySnapshot = await getDocs(newsCollection);
//       const fetchedNews = querySnapshot.docs.map((doc) => doc.data());

//       if (userType === "applicant") {
//         setNotifications({
//           news: fetchedNews,
//           application: [
//             { id: 1, message: "Your application has been viewed!", route: "/applicant/profile" },
//           ],
//         });
//       } else if (userType === "employer") {
//         // Fetch job applications for employer's job posts
//         const employerJobPostsQuery = query(collection(db, "jobs"), where("employerId", "==", auth.currentUser.uid));
//         const jobPostsSnapshot = await getDocs(employerJobPostsQuery);
//         const jobPosts = jobPostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

//         let jobNotifications = [];
//         for (const job of jobPosts) {
//           const applicationsQuery = collection(db, "jobs", job.id, "applications");
//           const applicationsSnapshot = await getDocs(applicationsQuery);

//           const applicationCount = applicationsSnapshot.docs.length;
//           if (applicationCount > 0) {
//             jobNotifications.push({
//               id: job.id,
//               message: `${applicationCount} new applicant(s) for ${job.title}!`,
//               route: "/employer/profile",
//             });
//           }
//         }

//         setNotifications({
//           news: fetchedNews,
//           jobPost: jobNotifications.length > 0 ? jobNotifications : [{ id: "empty", message: "No new applications.", route: "#" }],
//         });
//       }
//     };

//     fetchUserType().then(fetchNotifications);
//   }, [userType]);

//   return (
//     <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
//       <h2>Notifications</h2>
//       <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
//         {Object.keys(notifications).map((tab) => (
//           <button
//             key={tab}
//             className={`tab-button ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//             style={{ flex: "1", textAlign: "center", padding: "10px", background: "#4ad4d4", cursor: "pointer" }}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="notification-content">
//         <ul>
//           {notifications[activeTab].length > 0 ? (
//             notifications[activeTab].map((notif, index) => (
//               <li key={index} className="notification-item">
//                 <Link to={notif.route}>{notif.message}</Link>
//               </li>
//             ))
//           ) : (
//             <li>
//               {activeTab === "jobPost" ? "No new applications for your job posts." : "No new notifications."}
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default NotificationPanel;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { db, auth } from "../firebase";
// import { collection, getDocs, doc, getDoc, query, where,deleteDoc } from "firebase/firestore";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles.css";

// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState({
//     news: [],
//     application: [],
//   });
//   const [activeTab, setActiveTab] = useState("news");
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const fetchUserType = async () => {
//       if (auth.currentUser) {
//         const userRef = doc(db, "applicants", auth.currentUser.uid);
//         const employerRef = doc(db, "employers", auth.currentUser.uid);

//         const userSnap = await getDoc(userRef);
//         const employerSnap = await getDoc(employerRef);

//         if (userSnap.exists()) {
//           setUserType("applicant");
//         } else if (employerSnap.exists()) {
//           setUserType("employer");
//         }
//       }
//     };

//     const fetchNotifications = async () => {
//       if (!auth.currentUser) return;
  
//       try {
//           // Reference to the current user's notifications subcollection
//           const notificationsRef = collection(db, "applicants", auth.currentUser.uid, "notifications");
  
//           // Query to fetch only "unread" notifications
//           const q = query(notificationsRef, where("status", "==", "unread"));
//           const querySnapshot = await getDocs(q);
  
//           // Store notifications along with document ID for deletion
//           const fetchedNotifications = querySnapshot.docs.map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//           }));
  
//           setNotifications((prev) => ({
//               ...prev,
//               application: fetchedNotifications,
//           }));
//       } catch (error) {
//           console.error("Error fetching notifications:", error);
//       }
//   };
  

//     fetchUserType().then(fetchNotifications);
//   }, [userType]);
//   const handleNotificationClick = async (notifId) => {
//     if (!auth.currentUser) return;

//     try {
//         // Reference to the notification document
//         const notifDocRef = doc(db, "applicants", auth.currentUser.uid, "notifications", notifId);

//         // Delete the notification after clicking
//         await deleteDoc(notifDocRef);

//         // Remove it from state
//         setNotifications((prev) => ({
//             ...prev,
//             application: prev.application.filter((notif) => notif.id !== notifId),
//         }));
//     } catch (error) {
//         console.error("Error updating notification status:", error);
//     }
// };

//   return (
//     <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
//       <h2>Notifications</h2>
//       <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
//         {Object.keys(notifications).map((tab) => (
//           <button
//             key={tab}
//             className={`tab-button ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//             style={{ flex: "1", textAlign: "center", padding: "10px", background: "#4ad4d4", cursor: "pointer" }}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="notification-content">
//         <ul>
//           {notifications[activeTab].length > 0 ? (
//             notifications[activeTab].map((notif, index) => (
//               <li key={index} className="notification-item">
//                 <Link to={notif.route}>{notif.message}</Link>
//               </li>
//             ))
//           ) : (
//             <li>
//               {activeTab === "jobPost" ? "No new applications for your job posts." : "No new notifications."}
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default NotificationPanel;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles.css";


// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState({
//     news: [],
//     application: [],
//   });
//   const [activeTab, setActiveTab] = useState("news");


//   useEffect(() => {
//     setNotifications({
//       news: [
//         { id: 1, message: "New job posting available!", route: "/applicant/search-jobs" },
//         { id: 4, message: "Visit Ski-Folio", route: "/" }
//       ],
//       application: [
//         { id: 2, message: "Your application has been viewed!", route: "/applicant/profile" }
//       ],
//     });
//   }, []);


//   return (
//     <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
//       <h2>Notifications</h2>
//       <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
//         {Object.keys(notifications).map((tab) => (
//           <button
//             key={tab}
//             className={`tab-button ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//             style={{ flex: "1", textAlign: "center", padding: "10px", border: "1px", background: "#4ad4d4", cursor: "pointer" }}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="notification-content">
//         <ul>
//           {notifications[activeTab].length > 0 ? (
//             notifications[activeTab].map((notif) => (
//               <li key={notif.id} className="notification-item">
//                 <Link to={notif.route}>{notif.message}</Link>
//               </li>
//             ))
//           ) : (
//             <li>
//               {activeTab === "application"? (
//                 "They are still currently reviewing your application."
//               ) : (
//                 "No new notifications"
//               )}
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };


// export default NotificationPanel;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { db, auth } from "../firebase"; // Import Firestore & Auth
// import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles.css";

// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState({
//     news: [],
//     application: [],
//   });
//   const [activeTab, setActiveTab] = useState("news");
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const fetchUserType = async () => {
//       if (auth.currentUser) {
//         const userRef = doc(db, "applicants", auth.currentUser.uid);
//         const employerRef = doc(db, "employers", auth.currentUser.uid);

//         const userSnap = await getDoc(userRef);
//         const employerSnap = await getDoc(employerRef);

//         if (userSnap.exists()) {
//           setUserType("applicant");
//         } else if (employerSnap.exists()) {
//           setUserType("employer");
//         }
//       }
//     };

//     const fetchNotifications = async () => {
//       const newsCollection = collection(db, "news");
//       const querySnapshot = await getDocs(newsCollection);
//       const fetchedNews = querySnapshot.docs.map((doc) => doc.data());

//       if (userType === "applicant") {
//         setNotifications({
//           news: fetchedNews,
//           application: [
//             { id: 1, message: "Your application has been viewed!", route: "/applicant/profile" },
//           ],
//         });
//       } else if (userType === "employer") {
//         // Fetch job applications linked to this employer's job posts
//         const employerJobPostsQuery = query(collection(db, "jobs"), where("employerId", "==", auth.currentUser.uid));
//         const jobPostsSnapshot = await getDocs(employerJobPostsQuery);
//         const jobPosts = jobPostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

//         let applications = [];
//         for (const job of jobPosts) {
//           const applicationsQuery = collection(db, "jobs", job.id, "applications");
//           const applicationsSnapshot = await getDocs(applicationsQuery);

//           applications = applicationsSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             message: `New applicant for ${job.title}!`,
//             route: "/employer/profile",
//           }));
//         }

//         setNotifications({
//           news: fetchedNews,
//           application: applications.length > 0 ? applications : [{ id: 2, message: "No new applications.", route: "#" }],
//         });
//       }
//     };

//     fetchUserType().then(fetchNotifications);
//   }, [userType]);

//   return (
//     <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
//       <h2>Notifications</h2>
//       <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
//         {Object.keys(notifications).map((tab) => (
//           <button
//             key={tab}
//             className={`tab-button ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//             style={{ flex: "1", textAlign: "center", padding: "10px", background: "#4ad4d4", cursor: "pointer" }}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="notification-content">
//         <ul>
//           {notifications[activeTab].length > 0 ? (
//             notifications[activeTab].map((notif, index) => (
//               <li key={index} className="notification-item">
//                 <Link to={notif.route}>{notif.message}</Link>
//               </li>
//             ))
//           ) : (
//             <li>
//               {activeTab === "application" ? "No new application updates." : "No new notifications."}
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default NotificationPanel;


// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { db, auth } from "../firebase";
// import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles.css";

// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState({
//     news: [],
//     application: [],
//   });
//   const [activeTab, setActiveTab] = useState("news");
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const fetchUserType = async () => {
//       if (auth.currentUser) {
//         const userRef = doc(db, "applicants", auth.currentUser.uid);
//         const employerRef = doc(db, "employers", auth.currentUser.uid);

//         const userSnap = await getDoc(userRef);
//         const employerSnap = await getDoc(employerRef);

//         if (userSnap.exists()) {
//           setUserType("applicant");
//         } else if (employerSnap.exists()) {
//           setUserType("employer");
//         }
//       }
//     };

//     const fetchNotifications = async () => {
//       const newsCollection = collection(db, "news");
//       const querySnapshot = await getDocs(newsCollection);
//       const fetchedNews = querySnapshot.docs.map((doc) => doc.data());

//       if (userType === "applicant") {
//         setNotifications({
//           news: fetchedNews,
//           application: [
//             { id: 1, message: "Your application has been viewed!", route: "/applicant/profile" },
//           ],
//         });
//       } else if (userType === "employer") {
//         // Fetch job applications for employer's job posts
//         const employerJobPostsQuery = query(collection(db, "jobs"), where("employerId", "==", auth.currentUser.uid));
//         const jobPostsSnapshot = await getDocs(employerJobPostsQuery);
//         const jobPosts = jobPostsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

//         let jobNotifications = [];
//         for (const job of jobPosts) {
//           const applicationsQuery = collection(db, "jobs", job.id, "applications");
//           const applicationsSnapshot = await getDocs(applicationsQuery);

//           const applicationCount = applicationsSnapshot.docs.length;
//           if (applicationCount > 0) {
//             jobNotifications.push({
//               id: job.id,
//               message: `${applicationCount} new applicant(s) for ${job.title}!`,
//               route: "/employer/profile",
//             });
//           }
//         }

//         setNotifications({
//           news: fetchedNews,
//           jobPost: jobNotifications.length > 0 ? jobNotifications : [{ id: "empty", message: "No new applications.", route: "#" }],
//         });
//       }
//     };

//     fetchUserType().then(fetchNotifications);
//   }, [userType]);

//   return (
//     <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
//       <h2>Notifications</h2>
//       <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
//         {Object.keys(notifications).map((tab) => (
//           <button
//             key={tab}
//             className={`tab-button ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//             style={{ flex: "1", textAlign: "center", padding: "10px", background: "#4ad4d4", cursor: "pointer" }}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="notification-content">
//         <ul>
//           {notifications[activeTab].length > 0 ? (
//             notifications[activeTab].map((notif, index) => (
//               <li key={index} className="notification-item">
//                 <Link to={notif.route}>{notif.message}</Link>
//               </li>
//             ))
//           ) : (
//             <li>
//               {activeTab === "jobPost" ? "No new applications for your job posts." : "No new notifications."}
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default NotificationPanel;

// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { db, auth } from "../firebase";
// import { collection, getDocs, doc, getDoc, query, where,deleteDoc } from "firebase/firestore";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "../styles.css";

// const NotificationPanel = () => {
//   const [notifications, setNotifications] = useState({
//     news: [],
//     application: [],
//   });
//   const [activeTab, setActiveTab] = useState("news");
//   const [userType, setUserType] = useState(null);

//   useEffect(() => {
//     const fetchUserType = async () => {
//       if (auth.currentUser) {
//         const userRef = doc(db, "applicants", auth.currentUser.uid);
//         const employerRef = doc(db, "employers", auth.currentUser.uid);

//         const userSnap = await getDoc(userRef);
//         const employerSnap = await getDoc(employerRef);

//         if (userSnap.exists()) {
//           setUserType("applicant");
//         } else if (employerSnap.exists()) {
//           setUserType("employer");
//         }
//       }
//     };

//     const fetchNotifications = async () => {
//       if (!auth.currentUser) return;
  
//       try {
//           // Reference to the current user's notifications subcollection
//           const notificationsRef = collection(db, "applicants", auth.currentUser.uid, "notifications");
  
//           // Query to fetch only "unread" notifications
//           const q = query(notificationsRef, where("status", "==", "unread"));
//           const querySnapshot = await getDocs(q);
  
//           // Store notifications along with document ID for deletion
//           const fetchedNotifications = querySnapshot.docs.map((doc) => ({
//               id: doc.id,
//               ...doc.data(),
//           }));
  
//           setNotifications((prev) => ({
//               ...prev,
//               application: fetchedNotifications,
//           }));
//       } catch (error) {
//           console.error("Error fetching notifications:", error);
//       }
//   };
  

//     fetchUserType().then(fetchNotifications);
//   }, [userType]);
//   const handleNotificationClick = async (notifId) => {
//     if (!auth.currentUser) return;

//     try {
//         // Reference to the notification document
//         const notifDocRef = doc(db, "applicants", auth.currentUser.uid, "notifications", notifId);

//         // Delete the notification after clicking
//         await deleteDoc(notifDocRef);

//         // Remove it from state
//         setNotifications((prev) => ({
//             ...prev,
//             application: prev.application.filter((notif) => notif.id !== notifId),
//         }));
//     } catch (error) {
//         console.error("Error updating notification status:", error);
//     }
// };

//   return (
//     <div className="notification-page" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", width: "80%" }}>
//       <h2>Notifications</h2>
//       <div className="tabs" style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>
//         {Object.keys(notifications).map((tab) => (
//           <button
//             key={tab}
//             className={`tab-button ${activeTab === tab ? "active" : ""}`}
//             onClick={() => setActiveTab(tab)}
//             style={{ flex: "1", textAlign: "center", padding: "10px", background: "#4ad4d4", cursor: "pointer" }}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>
//       <div className="notification-content">
//         <ul>
//           {notifications[activeTab].length > 0 ? (
//             notifications[activeTab].map((notif, index) => (
//               <li key={index} className="notification-item">
//                 <Link to={notif.route}>{notif.message}</Link>
//               </li>
//             ))
//           ) : (
//             <li>
//               {activeTab === "jobPost" ? "No new applications for your job posts." : "No new notifications."}
//             </li>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default NotificationPanel;

import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, query, updateDoc, orderBy } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles.css";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState({
    news: [],
    application: [],
  });
  const [activeTab, setActiveTab] = useState("news");
  const [expandedNotif, setExpandedNotif] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!auth.currentUser) return;

      try {
        const notificationsRef = collection(
          db,
          "applicants",
          auth.currentUser.uid,
          "notifications"
        );

        const q = query(notificationsRef);
        const querySnapshot = await getDocs(q);

        // Sort by timestamp (newest first)
        const fetchedNotifications = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());

        setNotifications((prev) => ({
          ...prev,
          application: fetchedNotifications,
        }));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!auth.currentUser) return;

    try {
      const notifDocRef = doc(db, "applicants", auth.currentUser.uid, "notifications", notif.id);

      // Update notification status to "read"
      await updateDoc(notifDocRef, { status: "read" });

      setExpandedNotif(expandedNotif === notif.id ? null : notif.id);

      // Update state to reflect status change
      setNotifications((prev) => ({
        ...prev,
        application: prev.application.map((n) =>
          n.id === notif.id ? { ...n, status: "read" } : n
        ),
      }));
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  return (
    <div className="notification-page">
      <div className="notification-top">
        <h2 style={{margin: "25px"}}>Notifications</h2>

        <div className="tabs">
          {Object.keys(notifications).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="notification-content">
          <ul>
            {notifications[activeTab].length > 0 ? (
              notifications[activeTab].map((notif) => (
                <li
                  key={notif.id}
                  className={`notification-item ${notif.status === "unread" ? "unread" : "read"}`}
                  onClick={() => handleNotificationClick(notif)}
                >
                  <div className="notif-header">
                    <strong>{notif.companyName}</strong>
                    {notif.status === "unread" && (
                      <span className="badge">New 🔥</span>
                    )}
                  </div>

                  {expandedNotif === notif.id && (
                    <div className="notif-details">
                      <p><strong>Subject:</strong> {notif.subject}</p>
                      <p>{notif.message}</p>
                      <p className="timestamp">
                        <strong>Received:</strong> {notif.timestamp?.toDate().toLocaleString()}
                      </p>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="empty">No new notifications.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;

