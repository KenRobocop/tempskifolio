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

    //START OF SORTING BUTTON

    const [sortOrder, setSortOrder] = useState("ascending"); // Default sort order
    const [sortType, setSortType] = useState("date"); // Default sorting by date (or any criteria like title, location, etc.)

    const handleSort = () => {
        let sortedJobs = [...filteredJobs]; // Copy the jobs to avoid mutating the original array
        
        if (sortType === "title") {
          // Alphabetical sorting by job title
          sortedJobs.sort((a, b) => {
            if (sortOrder === "ascending") {
              return a.title.localeCompare(b.title); // Ascending alphabetical
            } else if (sortOrder === "descending") {
              return b.title.localeCompare(a.title); // Descending alphabetical
            }
            return 0;
          });
        } else if (sortType === "date") {
          // Sorting by job posting date (you can adjust this if you have a date property)
          sortedJobs.sort((a, b) => {
            const dateA = new Date(a.postingDate); // Assuming jobs have a postingDate property
            const dateB = new Date(b.postingDate);
            return sortOrder === "ascending" ? dateA - dateB : dateB - dateA; // Ascending or Descending by date
          });
        }
      
        setFilteredJobs(sortedJobs); // Set the sorted jobs to state
      };

        //END OF SORTING BUTTON
      
      


    const highestEligibleJobs = filteredJobs.filter((job) => {
        const jobAvgScore = job.averageScore;
        const userAvgScore = userAverage;
        return userAvgScore !== null && userAvgScore >= jobAvgScore;
    });
    

            const handleApply = async (jobId,jobTitle, e) => {
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

                        // Fetch user submissions
                        const submissionsRef = collection(db, 'applicants', userId, 'submissions');
                        const submissionSnapshot = await getDocs(submissionsRef);

                        const submissions = submissionSnapshot.docs.map((doc) => ({
                            id: doc.id, // The unique submission ID
                            demoVideoLink: doc.data().demoVideoLink || "",
                            liveDemoLink: doc.data().liveDemoLink || "",
                            scores: doc.data().scores || { css: 0, html: 0, javascript: 0 },
                            timestamp: doc.data().timestamp || null,
                        }));

                        // Save application data
                        const applicationRef = doc(db, 'jobs', jobId, 'applications', userId);
                        const applicationData = {
                            userId,
                            jobId,
                            appliedAt: Timestamp.now(),
                            name, // User's name
                            resumeURL, // Resume link
                            certifications, // User's certificates
                            githubLink, // GitHub profile link
                            email, // User's email
                            submissions, // Submissions fetched
                        };

                       
                        if (resumeURL == null){
                            alert("No Resume Applied");
                        }
                        else{
                            await setDoc(applicationRef, applicationData);
                            // console.log(`Applied to job with ID: ${jobId} successfully.`);
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
        /**START OF CHANGING THE SEARCH JOB PAGE */
        <div style={{ position: "relative" }}>
            <div
                id="job-search-container"
                style={{
                    padding: "20px",
                    filter: expandedJob ? "blur(4px)" : "none", // Blur background only
                    transition: "filter 0.3s ease-in-out",
                }}
            >
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
                {/*START OF SORT BUTTON*/}
                <button
                onClick={() => {
                    // Toggle between ascending and descending order
                    setSortOrder((prevOrder) => (prevOrder === "ascending" ? "descending" : "ascending"));
                    handleSort(); // Call the sorting function after toggling
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
                    setSortType(e.target.value); // Change sort type (e.g., title, date)
                    handleSort(); // Apply sorting
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
                {/*END OF SORT BUTTON*/}
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
                            transition: "transform 0.3s ease, box-shadow 0.3s ease", // Adding transition for smooth effect
                        }}
                        onClick={() => setExpandedJob(job)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)"; // Scale up slightly on hover
                            e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)"; // Enhance shadow
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"; // Reset to original size
                            e.currentTarget.style.boxShadow = "0 0 10px black"; // Reset shadow
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
                            transition: "transform 0.3s ease, box-shadow 0.3s ease", // Adding transition for smooth effect
                        }}
                        onClick={() => setExpandedJob(job)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)"; // Scale up slightly on hover
                            e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.3)"; // Enhance shadow
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)"; // Reset to original size
                            e.currentTarget.style.boxShadow = "0 0 10px black"; // Reset shadow
                        }}
                        >
                        <h4>{job.title}</h4>
                        <p><strong>Company:</strong> {job.companyName}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        </div>
                    ))}
                    </div>
                </div>
                {/**END OF CHANGING THE SEARCH JOB PAGE */}
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
                        overflowY: "auto", // Scroll for overflow
                    }}
                >
                    <h3>{expandedJob.title}</h3>
                    <p><strong>Company:</strong> {expandedJob.companyName}</p>
                    <p>{expandedJob.description}</p>
                    <button
                        onClick={(e) => handleApply(expandedJob.id,expandedJob.title, e)}
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
