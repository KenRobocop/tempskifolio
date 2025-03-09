import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [expandedJob, setExpandedJob] = useState(null);
    const [userAverage, setUserAverage] = useState(null);

    useEffect(() => {
        const fetchUserAverageScore = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, "applicants", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    setUserAverage(parseFloat(userData.skills?.average || 0));
                }
            }
        };
        
        const fetchJobs = async () => {
            const jobsCollection = collection(db, "jobs");
            const jobSnapshot = await getDocs(jobsCollection);

            const jobList = jobSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                averageScore: parseFloat(doc.data().averageScore || 0),
            }));

            setJobs(jobList);
            setFilteredJobs(jobList);
        };

        fetchUserAverageScore();
        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = jobs.filter((job) =>
            job.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
            job.description.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredJobs(filtered);
    };

    const [sortOrder, setSortOrder] = useState("ascending");
    const [sortType, setSortType] = useState("date");

    const handleSort = () => {
        let sortedJobs = [...filteredJobs];
        
        if (sortType === "title") {
          sortedJobs.sort((a, b) => {
            if (sortOrder === "ascending") {
              return a.title.localeCompare(b.title);
            } else {
              return b.title.localeCompare(a.title);
            }
            return 0;
          });
        } else if (sortType === "date") {
          sortedJobs.sort((a, b) => {
            const dateA = new Date(a.postingDate);
            const dateB = new Date(b.postingDate);
            return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
          });
        }
      
        setFilteredJobs(sortedJobs);
    };

    const highestEligibleJobs = filteredJobs.filter((job) => {
        const jobAvgScore = job.averageScore;
        const userAvgScore = userAverage;
        return userAvgScore !== null && userAvgScore >= jobAvgScore;
    });

    const handleApply = async (jobId, jobTitle, e) => {
        e.stopPropagation();
        if (auth.currentUser) {
            try {
                const userId = auth.currentUser.uid;
                const userRef = doc(db, 'applicants', userId);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    console.error("User data not found!");
                    return;
                }

                const userData = userSnap.data();
                const { name, resumeURL, certifications = [], githubLink, email } = userData;

                const submissionsRef = collection(db, 'applicants', userId, 'submissions');
                const submissionSnapshot = await getDocs(submissionsRef);

                const submissions = submissionSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    demoVideoLink: doc.data().demoVideoLink || "",
                    liveDemoLink: doc.data().liveDemoLink || "",
                    scores: doc.data().scores || { css: 0, html: 0, javascript: 0 },
                    timestamp: doc.data().timestamp || null,
                }));

                const applicationRef = doc(db, 'jobs', jobId, 'applications', userId);
                const applicationData = {
                    userId,
                    jobId,
                    appliedAt: Timestamp.now(),
                    name,
                    resumeURL,
                    certifications,
                    githubLink,
                    email,
                    submissions,
                };

                if (resumeURL == null) {
                    alert("No Resume Applied");
                } else {
                    await setDoc(applicationRef, applicationData);
                    alert('Applied to job: ' + jobTitle);
                }
            } catch (error) {
                console.error("Error applying to job:", error);
            }
        } else {
            console.log("No user logged in");
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <div id="job-search-container" style={{ padding: "20px", filter: expandedJob ? "blur(4px)" : "none", transition: "filter 0.3s ease-in-out" }}>
                <h2 style={{marginTop: "25px"}}>Search Jobs</h2>
                <input
                    type="text"
                    placeholder="Search for jobs..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        marginBottom: "20px",
                        marginTop:"20px",
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                    }}
                />

                <div>
                    <button
                        onClick={() => {
                            setSortOrder((prevOrder) => (prevOrder === "ascending" ? "descending" : "ascending"));
                            handleSort();
                        }}
                        style={{
                            padding: "8px 16px",
                            fontSize: "16px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginBottom: "20px",
                            marginRight: "10px",
                        }}
                    >
                        Sort by {sortOrder === "ascending" ? "Descending" : "Ascending"}
                    </button>

                    <select
                        onChange={(e) => {
                            setSortType(e.target.value);
                            handleSort();
                        }}
                        value={sortType}
                        style={{
                            padding: "8px 16px",
                            fontSize: "16px",
                            borderRadius: "5px",
                            border: "1px solid #ddd",
                            marginBottom: "20px",
                            backgroundColor: "#fff",
                        }}
                    >
                        <option value="date">Sort by Date</option>
                        <option value="title">Sort by Title</option>
                    </select>

                    <h3>Highest Eligible Jobs</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                        {highestEligibleJobs.map((job) => (
                            <div
                                key={job.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 0 10px black",
                                    padding: "10px",
                                    width: "200px",
                                    cursor: "pointer",
                                    background: "#a6faf6",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                }}
                                onClick={() => setExpandedJob(job)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                    e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 0 10px black";
                                }}
                            >
                                <h4>{job.title}</h4>
                                <p><strong>Company:</strong> {job.companyName}</p>
                                <p><strong>Location:</strong> {job.location}</p>
                            </div>
                        ))}
                    </div>

                    <h3>All Jobs</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                style={{
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    boxShadow: "0 0 10px black",
                                    padding: "10px",
                                    width: "200px",
                                    cursor: "pointer",
                                    background: "#a6faf6",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                }}
                                onClick={() => setExpandedJob(job)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                    e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 0 10px black";
                                }}
                            >
                                <h4>{job.title}</h4>
                                <p><strong>Company:</strong> {job.companyName}</p>
                                <p><strong>Location:</strong> {job.location}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {expandedJob && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        width: "80%",
                        maxHeight: "80%",
                        padding: "20px",
                        zIndex: 1000,
                        overflowY: "auto",
                    }}
                >
                    <h3>{expandedJob.title}</h3>
                    <p><strong>Company:</strong> {expandedJob.companyName}</p>
                    <p>{expandedJob.description}</p>
                    <button
                        onClick={(e) => handleApply(expandedJob.id, expandedJob.title, e)}
                        style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginRight: "10px",
                        }}
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => setExpandedJob(null)}
                        style={{
                            backgroundColor: "#ccc",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobSearch;
