import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { setDoc} from "firebase/firestore";
const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApplicant, setIsApplicant] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [employers, setEmployers] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState("Applicants");
  const [selectedUser, setSelectedUser] = useState(null);
  const [employerJobs, setEmployerJobs] = useState([]);
  const [jobApplicants, setJobApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [isUserClassVisible, setIsUserClassVisible] = useState(true)
  const [isUserApproval, setUserApproval] = useState(true)
  // Fetch Applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const applicantsSnapshot = await getDocs(collection(db, "applicants"));
        const applicantsData = await Promise.all(
          applicantsSnapshot.docs.map(async (doc) => {
            const userId = doc.id;
            const applicantData = doc.data();

            // Fetch submissions
            const submissionsRef = collection(db, "applicants", userId, "submissions");
            const submissionsSnapshot = await getDocs(submissionsRef);
            const submissions = submissionsSnapshot.docs.map((subDoc) => subDoc.data());

            // Fetch applied jobs
            const appliedJobsRef = collection(db, "applicants", userId, "appliedJobs");
            const appliedJobsSnapshot = await getDocs(appliedJobsRef);
            const appliedJobs = appliedJobsSnapshot.docs.map((jobDoc) => jobDoc.data());
            
            return {
              ...applicantData,
              userId,
              submissions,
              appliedJobs,
            };
          })
        );
        setApplicants(applicantsData);
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };

    fetchApplicants();
  }, []);
  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        const jobsSnapshot = await getDocs(collection(db, "jobs-to-be-approved"));
        const jobsData = jobsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingJobs(jobsData);
      } catch (error) {
        console.error("Error fetching pending jobs:", error);
      }
    };

    fetchPendingJobs();
  }, []);
  const handleToggleClass = () => {
    // // Only toggle visibility if selectedUserType is "Applicants" or "Employers"
    // if (selectedUserType !== "Applicants" || selectedUserType !== "Employers") {
    //   // Set the selectedUserType to "JobsToBeApproved"
    //   setSelectedUserType("JobsToBeApproved");
  
    // // Find the element with the "JobsToBeApproved" class or ID
    // const jobsToBeApprovedElement = document.querySelector(".JobsToBeApproved");

    //   // Check if the element exists before toggling visibility
    //   if (jobsToBeApprovedElement) {
    //     setIsUserClassVisible(true); // Show the JobsToBeApproved content
    //   }
    // }
    setIsUserClassVisible(true);
    setUserApproval(false);
  };
  const handleToggleApproval = () => {
    // // Only toggle visibility if selectedUserType is "Applicants" or "Employers"
    // if (selectedUserType !== "Applicants" || selectedUserType !== "Employers") {
    //   // Set the selectedUserType to "JobsToBeApproved"
    //   setSelectedUserType("JobsToBeApproved");
  
    // // Find the element with the "JobsToBeApproved" class or ID
    // const jobsToBeApprovedElement = document.querySelector(".JobsToBeApproved");

    //   // Check if the element exists before toggling visibility
    //   if (jobsToBeApprovedElement) {
    //     setIsUserClassVisible(true); // Show the JobsToBeApproved content
    //   }
    // }
    setUserApproval(true);
  };
  // Fetch Users to Approve
const [usersToApprove, setUsersToApprove] = useState([]);
const [deletedFiles, setDeletedFiles] = useState([]);
const [showDeletedFiles, setShowDeletedFiles] = useState(false); // Toggle for deleted files view

useEffect(() => {
    const fetchUsersToApprove = async () => {
        try {
            const snapshot = await getDocs(collection(db, "userAccountsToBeApproved"));
            const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUsersToApprove(users);
        } catch (error) {
            console.error("Error fetching users to approve:", error);
        }
    };

    fetchUsersToApprove();
}, [showDeletedFiles]);

useEffect(() => {
  const fetchUsersToApprove = async () => {
    try {
      const snapshot = await getDocs(collection(db, "userAccountsToBeApproved"));
      const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsersToApprove(users);
    } catch (error) {
      console.error("Error fetching users to approve:", error);
    }
  };
  const fetchDeletedFiles = async () => {
    try {
        const snapshot = await getDocs(collection(db, "deletedFiles"));
        const files = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDeletedFiles(files);
    } catch (error) {
        console.error("Error fetching deleted files:", error);
    }
};
if (showDeletedFiles) fetchDeletedFiles();
  fetchUsersToApprove();
}, [showDeletedFiles]); 


// Approve User
const handleApproveUser = async (user) => {
    try {
        const targetCollection = user.type === "applicant" ? "applicants" : "employers";

        // Add user to the target collection
        await setDoc(doc(db, targetCollection, user.id), { ...user, status: "approved" });

        // Remove user from the approval collection
        await deleteDoc(doc(db, "userAccountsToBeApproved", user.id));

        // Update local state
        setUsersToApprove(usersToApprove.filter((u) => u.id !== user.id));
        alert("User approved successfully.");
    } catch (error) {
        console.error("Error approving user:", error);
        alert("Failed to approve user. Please try again.");
    }
};

// Reject User
const handleRejectUser = async (user) => {
    try {
        // Move user data to the `deletedFiles` collection
        await setDoc(doc(db, "deletedFiles", user.id), user);

        // Remove user from the approval collection
        await deleteDoc(doc(db, "userAccountsToBeApproved", user.id));

        // Update local state
        setUsersToApprove(usersToApprove.filter((u) => u.id !== user.id));
        alert("User rejected and moved to deleted files.");
    } catch (error) {
        console.error("Error rejecting user:", error);
        alert("Failed to reject user. Please try again.");
    }
};

  // Fetch Employers
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const employersSnapshot = await getDocs(collection(db, "employers"));
        const employersData = employersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployers(employersData);
      } catch (error) {
        console.error("Error fetching employers:", error);
      }
    };

    fetchEmployers();
  }, []);

  const handleLogin = () => {
    // Hardcoded Admin Credentials
    if (username === "admin" && password === "admin123") {
      setIsAdmin(true);
    } else {
      alert("Invalid credentials");
    }
  };
  // Handle Applicant Click
  const handleUserClick = async (user) => {
    if (selectedUserType === "Applicants") {
      // If the user is an applicant, set the user data with submissions and applied jobs
      setSelectedUser({
        ...user,
        submissions: user.submissions || [],
        appliedJobs: user.appliedJobs || [],
      });
    } else {
      // If the user is an employer, set the employer data and fetch the posted jobs
      setSelectedUser(user);
  
      // Fetch the jobs posted by the employer
      const employerJobsQuery = query(collection(db, "jobs"), where("employerId", "==", user.id));
      const employerJobsSnapshot = await getDocs(employerJobsQuery);
      const jobs = employerJobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      
      setEmployerJobs(jobs);  // Update the state with the employer's jobs
      setSelectedJob(null);    // Reset the selected job
      setJobApplicants([]);   // Clear applicants for the selected job
    }
  };
  
  // Handle Employer Click: Fetch jobs posted by employer
  const handleEmployerClick = async (employer) => {
    setSelectedUser(employer);
    const employerJobsQuery = query(collection(db, "jobs"), where("employerId", "==", employer.id));
    const employerJobsSnapshot = await getDocs(employerJobsQuery);
  
    const jobs = employerJobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched Jobs for Employer:", jobs);  // Debugging log
  
    setEmployerJobs(jobs);
  
    if (jobs.length === 0) {
      console.log("No jobs found for this employer.");  // Debugging log if no jobs are found
    }
  
    setSelectedJob(null);
    setJobApplicants([]);
  };
  
  

  // Handle Job Click: Fetch applicants for the selected job
  const handleJobClick = async (jobId) => {
    setSelectedJob(jobId);
    const applicantsRef = collection(db, "jobs", jobId, "applications");
    const applicantsSnapshot = await getDocs(applicantsRef);
    const applicants = applicantsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setJobApplicants(applicants);
  };
  

  // Handle Applicant Click (from employer's job applicants)
  const handleApplicantClick = (applicant) => {
    setSelectedApplicant(applicant);
    setIsApplicant(true);
  };

  // Close Modals
  const handleCloseUserModal = () => {
    setSelectedUser(null);
    setEmployerJobs([]);
    setSelectedJob(null);
    setJobApplicants([]);
  };

  const handleCloseApplicantModal = () => {
    setSelectedApplicant(null);
  };
  const handlePublishJob = async (job) => {
    try {
      // Add job to the 'jobs' collection
      await setDoc(doc(db, "jobs", job.id), job);

      // Delete job from 'jobs-to-be-approved'
      await deleteDoc(doc(db, "jobs-to-be-approved", job.id));

      // Update local state
      setPendingJobs(pendingJobs.filter((j) => j.id !== job.id));
      setSelectedJob(null);
      alert("Job published successfully.");
    } catch (error) {
      console.error("Error publishing job:", error);
      alert("Failed to publish job. Please try again.");
    }
  };
  const handleRejectJob = async (jobId) => {
    try {
      setIsApplicant(true)
      // Delete job from 'jobs-to-be-approved'
      await deleteDoc(doc(db, "jobs-to-be-approved", jobId));

      // Update local state
      setPendingJobs(pendingJobs.filter((j) => j.id !== jobId));
      setSelectedJob(null);
      alert("Job rejected successfully.");
    } catch (error) {
      console.error("Error rejecting job:", error);
      alert("Failed to reject job. Please try again.");
    }
  };
  useEffect(() => {
    const userDiv = document.querySelector(".user");
    if (userDiv) {
      if (selectedUserType === "JobsToBeApproved") {
        userDiv.classList.add("user");
      } else {
        userDiv.classList.remove("user");
      }
    }
  }, [selectedUserType]);

  const toggleUserDivClass = () => {
    setSelectedUserType(selectedUserType === "JobsToBeApproved" ? "Applicants" : "JobsToBeApproved");
  };
  
  
  if (!isAdmin) {
    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "80vh",  // Adjusted height
            fontFamily: "Arial, sans-serif"
        }}>
            <form onSubmit={handleLogin} style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                width: "100%", 
                maxWidth: "600px", 
                padding: "60px 40px", // More compact
                borderRadius: "10px", 
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", 
                background: "white",
                textAlign: "center"
            }}>
                <h2 style={{ marginBottom: "15px", fontFamily: "Times New Roman" }}>Admin Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ 
                        width: "100%", 
                        padding: "10px", 
                        marginBottom: "10px", 
                        borderRadius: "5px", 
                        border: "1px solid #ccc", 
                        fontSize: "16px", 
                        textAlign: "center"
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ 
                        width: "100%", 
                        padding: "10px", 
                        marginBottom: "10px", 
                        borderRadius: "5px", 
                        border: "1px solid #ccc", 
                        fontSize: "16px", 
                        textAlign: "center"
                    }}
                />
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px", 
                        backgroundColor: "#007bff", 
                        color: "#fff", 
                        border: "none", 
                        borderRadius: "5px", 
                        cursor: "pointer",
                        fontSize: "16px",
                        transition: "0.3s"
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                    onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                >
                    Login
                </button>
            </form>
        </div>
    );
}

  return (
    <><div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Admin Page</h2>

      <button
      onClick={() => {
        // Example log-out logic: remove user data or session
        localStorage.removeItem("authToken"); // Adjust according to your auth mechanism
        window.location.href = "/"; // Redirect to login page after logout
      }}
      style={{
        position: "absolute", // Absolute positioning to place it at the top right
        top: "20px",
        right: "20px",
        padding: "10px 20px",
        backgroundColor: "#f44336", // Red background for logout
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background-color 0.3s",
      }}
      onMouseEnter={(e) => e.target.style.backgroundColor = "#d32f2f"} // Darker red on hover
      onMouseLeave={(e) => e.target.style.backgroundColor = "#f44336"} // Revert on leave
    >
      Log Out
    </button>

      {/* User Type Toggle */}
      <div style={{ marginBottom: "20px" }}>
        <button
         onClick={() => {
            setSelectedUserType("Applicants");
            setIsUserClassVisible(false);
            setUserApproval(false);
          }}
          
          style={{
            marginRight: "10px",
            padding: "10px 15px",
            backgroundColor: selectedUserType === "Applicants" && !isUserClassVisible ? "#007bff" : "#ddd",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View Applicants
        </button>
        <button
          onClick={() => {
            setSelectedUserType("Employers")
            setIsUserClassVisible(false)
            setUserApproval(false);
        }}
          style={{
            padding: "10px 15px",
            backgroundColor: selectedUserType === "Employers" && !isUserClassVisible ? "#007bff" : "#ddd",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View Employers
        </button>
        <button
               onClick={handleToggleClass}
               style={{
                 marginRight: "10px",
                 padding: "10px 15px",
                 backgroundColor: isUserClassVisible ? "#007bff" : "#ddd",
                 color: "#fff",
                 border: "none",
                 borderRadius: "5px",
                 cursor: "pointer",
               }}
        //   {/* style={{
        //     marginRight: "10px",
        //     padding: "10px 15px",
        //     backgroundColor: selectedUserType === "JobsToBeApproved" ? "#007bff" : "#ddd",
        //     color: "#fff",
        //     border: "none",
        //     borderRadius: "5px",
        //     cursor: "pointer",
        //   }} */}
        >
          Jobs to Be Approved
       
        </button>
        <button
      id="approve"
      onClick={() => {

        setUserApproval(true);
        setShowDeletedFiles(!showDeletedFiles);
        setIsUserClassVisible(false);
      }}
      style={{
        padding: "10px 15px",
        backgroundColor: selectedUserType === "Employers" && !isUserClassVisible ? "#007bff" : "#ddd",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      >
      {showDeletedFiles
        ? "Deleted Files"
        : `View User Accounts (${usersToApprove.length || 0} Waiting)`}
    </button>
      </div>

      {/* User Table */}
      {!isUserClassVisible && (
  <div
    className="user"
    style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    }}
  >
    <h3 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.5rem" }}>
      {selectedUserType}
    </h3>
    <table style={{ width: "100%", borderCollapse: "collapse",boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <thead>
        <tr style={{ backgroundColor: "#007bff", color: "white" }}>
          <th style={{ padding: "12px 20px", border: "1px solid #ddd" }}>
            {selectedUserType === "Applicants" ? "Name" : "Company Name"}
          </th>
          <th style={{ padding: "12px 20px", border: "1px solid #ddd" }}>Email</th>
          <th style={{ padding: "12px 20px", border: "1px solid #ddd" }}>Details</th>
        </tr>
      </thead>
      <tbody>
        {(selectedUserType === "Applicants" ? applicants : employers).map((user) => (
          <tr
            key={user.id || user.userId}
            style={{
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f8ff"} // Hover effect
            onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
          >
            <td style={{ padding: "12px 20px", border: "1px solid #ddd" }}>
              {user.name || user.companyName}
            </td>
            <td style={{ padding: "12px 20px", border: "1px solid #ddd" }}>
              {user.email}
            </td>
            <td
              style={{
                padding: "12px 20px",
                border: "1px solid #ddd",
                textAlign: "center",
              }}
            >
              <button
                onClick={() => handleUserClick(user)}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"} // Hover effect
                onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{/* Detailed Applicant Modal */}
{selectedUser && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "80%",
        overflowY: "auto",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h4 style={{ textAlign: "center" }}>
        {selectedUserType === "Applicants"
          ? "Applicant Details"
          : "Employer Details"}
      </h4>

      {selectedUserType === "Applicants" && !isUserClassVisible ? (
        <>
          <p>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Resume:</strong>{" "}
            <a
              href={selectedUser.resumeURL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#007bff",
                textDecoration: "underline",
              }}
            >
              View Resume
            </a>
          </p>
          <h5>Submissions</h5>
          <ul>
            {selectedUser.submissions?.map((submission, index) => (
              <li key={index}>
                <strong>Live Demo:</strong>{" "}
                <a
                  href={submission.liveDemoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007bff",
                    textDecoration: "underline",
                  }}
                >
                  View
                </a>{" "}
                | <strong>Demo Video:</strong>{" "}
                <a
                  href={submission.demoVideoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007bff",
                    textDecoration: "underline",
                  }}
                >
                  Watch
                </a>
              </li>
            ))}
          </ul>
          <h5>Applied Jobs</h5>
          <ul>
            {selectedUser.appliedJobs?.map((job, index) => (
              <li key={index}>
                <p>
                  <strong>Job Title:</strong> {job.title}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Applied At:</strong>{" "}
                  {job.appliedAt?.toDate().toLocaleString() || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : selectedUserType !== "Applicants" && !isUserClassVisible ? (
        <>
          <p>
            <strong>Company Name:</strong> {selectedUser.companyName}
          </p>
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <h5>Posted Jobs</h5>
          <ul>
            {employerJobs.map((job, index) => (
              <li key={index}>
                <p>
                  <strong>Job Title:</strong> {job.title}
                </p>
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <button
                    onClick={() => handleJobClick(job.id)}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"} // Hover effect
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
                  >
                    View Applicants
                  </button>
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <button
        onClick={handleCloseUserModal}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          width: "100%",
          transition: "background-color 0.3s",
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = "#0056b3"} // Hover effect
        onMouseLeave={(e) => e.target.style.backgroundColor = "#007bff"}
      >
        Close
      </button>
    </div>
  </div>
)}


      {/* Job Applicants Modal */}
      {selectedJob && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80%",
              overflowY: "auto",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h4 style={{ textAlign: "center" }}>Job Applicants</h4>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {jobApplicants.map((applicant, index) => (
                <li key={index} style={{ marginBottom: "15px", padding: "10px", borderBottom: "1px solid #ddd" }}>
                  <p>
                    <strong>Name:</strong> {applicant.name}
                  </p>
                  <button
                    onClick={() => handleApplicantClick(applicant)}
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
                  >
                    View Applicant
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedJob(null)}
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Applicant Detailed View */}
      {selectedApplicant && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80%",
              overflowY: "auto",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h4 style={{ textAlign: "center" }}>Applicant Details</h4>
            <p><strong>Name:</strong> {selectedApplicant.name}</p>
            <p><strong>Email:</strong> {selectedApplicant.email}</p>
            <p>
              <strong>Resume:</strong>{" "}
              <a
                href={selectedApplicant.resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff", textDecoration: "underline" }}
              >
                View Resume
              </a>
            </p>
            <button
              onClick={handleCloseApplicantModal}
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Jobs to Be Approved */}
      {isUserClassVisible && (
        <div style={{       
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}>
          <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.5rem" }}>Jobs to Be Approved</h2>

          {/* Pending Jobs Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
            <thead>
              <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                <th style={{ padding: "12px 20px", border: "1px solid #ddd" }}>Job Title</th>
                <th style={{ padding: "12px 20px", border: "1px solid #ddd" }}>Company Name</th>
                <th style={{ padding: "12px 20px", border: "1px solid #ddd" }}>Location</th>
                <th style={{ padding: "12px 20px", border: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingJobs.map((job) => (
                <tr key={job.id} style={{ transition: "background-color 0.3s" }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f8ff")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
                >
                  <td style={{ padding: "12px 20px", border: "1px solid #ddd" }}>{job.title}</td>
                  <td style={{ padding: "12px 20px", border: "1px solid #ddd" }}>{job.companyName}</td>
                  <td style={{ padding: "12px 20px", border: "1px solid #ddd" }}>{job.location}</td>
                  <td style={{ padding: "12px 20px", border: "1px solid #ddd", textAlign: "center" }}>
                    <button
                      onClick={() => { setSelectedJob(job); setIsApplicant(false); }}
                      style={{
                        padding: "8px 15px",
                        marginRight: "5px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRejectJob(job.id)}
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#ff4d4d",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#cc0000")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4d4d")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Job Details Modal */}
      {selectedJob && !isApplicant && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80%",
              overflowY: "auto",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h4 style={{ textAlign: "center" }}>Job Details</h4>
            <p><strong>Title:</strong> {selectedJob.title}</p>
            <p><strong>Company Name:</strong> {selectedJob.companyName}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Description:</strong> {selectedJob.description || "No description provided."}</p>

            {/* Publish Button */}
            <button
              onClick={() => {
                handlePublishJob(selectedJob);
                setSelectedJob(null);
              }}
              style={{
                marginTop: "20px",
                padding: "12px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
              Publish
            </button>

            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              style={{
                marginTop: "10px",
                padding: "12px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
              Close
            </button>
          </div>
        </div>
      )}

        </div>
        
      {!showDeletedFiles && (
        <div>
            <h2>Users Pending Approval</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name/Company</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {usersToApprove.map((user) => (
                        <tr key={user.id}>
                            <td>{user.type === "applicant" ? user.name : user.companyName}</td>
                            <td>{user.email}</td>
                            <td>{user.type}</td>
                            <td>
                                <button onClick={() => handleApproveUser(user)}>Approve</button>
                                <button onClick={() => handleRejectUser(user)}>Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )}
      {/* <div style={{ marginTop: "20px" }}>
   
</div> */}

{showDeletedFiles && (
  <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "24px", color: "#333" }}>Deleted Files</h2>
    <div
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: "12px",
                backgroundColor: "#007bff",
                color: "#fff",
                textAlign: "left",
                fontSize: "16px",
              }}
            >
              Name/Company
            </th>
            <th
              style={{
                padding: "12px",
                backgroundColor: "#007bff",
                color: "#fff",
                textAlign: "left",
                fontSize: "16px",
              }}
            >
              Email
            </th>
            <th
              style={{
                padding: "12px",
                backgroundColor: "#007bff",
                color: "#fff",
                textAlign: "left",
                fontSize: "16px",
              }}
            >
              Type
            </th>
            <th
              style={{
                padding: "12px",
                backgroundColor: "#007bff",
                color: "#fff",
                textAlign: "left",
                fontSize: "16px",
              }}
            >
              Reason
            </th>
          </tr>
        </thead>
        <tbody>
          {deletedFiles.map((file) => (
            <tr
              key={file.id}
              style={{
                borderBottom: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
            >
              <td style={{ padding: "12px", fontSize: "14px" }}>
                {file.type === "applicant" ? file.name : file.companyName}
              </td>
              <td style={{ padding: "12px", fontSize: "14px" }}>{file.email}</td>
              <td style={{ padding: "12px", fontSize: "14px" }}>{file.type}</td>
              <td style={{ padding: "12px", fontSize: "14px" }}>
                {file.reason || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


    </>
  );
};

export default AdminPage;