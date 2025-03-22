import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../firebase'; // Include storage in your Firebase import
import { doc, getDoc, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

const Portfolio = () => {
    const [userData, setUserData] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [liveDemoLink, setLiveDemoLink] = useState('');
    const [demoVideoFile, setDemoVideoFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isVideoValid, setIsVideoValid] = useState(false);
    const [submissionLoading, setSubmissionLoading] = useState(false);
    const [userRepos, setUserRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUserData();
        fetchSubmissions();
    }, []);

    const fetchUserData = async () => {
        if (auth.currentUser) {
            const userRef = doc(db, 'applicants', auth.currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                setUserData(userSnap.data());
                fetchUserRepos(userSnap.data().githubLink);
            } else {
                console.log("No such document!");
            }
        }
    };

    const fetchUserRepos = async (githubLink) => {
        if (!githubLink) return;
    
        let username = "";
    
        // Extract username from GitHub profile link (e.g., https://github.com/crajex)
        if (githubLink.includes("github.com")) {
            username = githubLink.split('/').pop();
        }
        // Extract username from GitHub Pages link (e.g., https://crajex.github.io/NewJeans)
        else if (githubLink.includes(".github.io")) {
            username = new URL(githubLink).hostname.split('.')[0];
        }
    
        if (!username) {
            setError("Invalid GitHub link format.");
            return;
        }
    
        try {
            const response = await axios.get(`https://api.github.com/users/${username}/repos`);
            setUserRepos(response.data.map(repo => repo.name));
        } catch (error) {
            console.error("Error fetching user repositories:", error);
            setError("Failed to fetch your GitHub repositories. Please try again later.");
        }
    };

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            if (!auth.currentUser) {
                console.log("User not authenticated");
                return;
            }
            
            const submissionsRef = collection(doc(db, 'applicants', auth.currentUser.uid), 'submissions');
            const snapshot = await getDocs(submissionsRef);
            const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSubmissions(submissionsData);
        } catch (error) {
            console.error("Error fetching submissions:", error);
            setError("Failed to load your previous submissions.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('video/')) {
            setDemoVideoFile(file);
            setIsVideoValid(true);
        } else {
            setDemoVideoFile(null);
            setIsVideoValid(false);
            alert('Please upload a valid video file (e.g., .mp4, .mov).');
        }
    };

    const handleOpenModal = () => {
        if (!liveDemoLink.trim()) {
            alert("Please enter a Live Demo Link first.");
            return;
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDemoVideoFile(null);
        setIsVideoValid(false);
    };

    const handleSubmission = async () => {
        setError("");
        
        if (!liveDemoLink.trim() || !demoVideoFile) {
            alert("Please enter a valid live demo link and upload a video.");
            return;
        }

        // Improved URL validation
        let isValidUrl = false;
        try {
            new URL(liveDemoLink);
            isValidUrl = true;
        } catch (e) {
            alert("Please enter a valid URL.");
            return;
        }

        if (!isValidUrl) {
            alert("Please enter a valid URL including http:// or https://");
            return;
        }

        // Extract repo name from GitHub URL if applicable
        let belongsToUser = true;
        if (liveDemoLink.includes('github.com') || liveDemoLink.includes('.github.io')) {
            let repoName = "";
            
            if (liveDemoLink.includes("github.com")) {
                const urlParts = liveDemoLink.split('/');
                const repoIndex = urlParts.indexOf('github.com') + 2;
                if (repoIndex < urlParts.length) repoName = urlParts[repoIndex].replace('.git', '');
            } else if (liveDemoLink.includes(".github.io")) {
                repoName = new URL(liveDemoLink).pathname.split('/')[1]; // Extract repo from GitHub Pages URL
            }
        
            if (!userRepos.includes(repoName)) 
                alert("Error Repository not Initialized");
                return;{
                if (!window.confirm("This repository doesn't appear to belong to your GitHub account. Do you want to continue?")) {
                    alert("Error repo not owned");
                    return;
                }
            }
        }

        setSubmissionLoading(true);

        try {
            // Upload video to Firebase Storage
            const storageRef = ref(storage, `videos/${auth.currentUser.uid}/${Date.now()}_${demoVideoFile.name}`);
            const uploadTask = await uploadBytes(storageRef, demoVideoFile);
            const videoURL = await getDownloadURL(uploadTask.ref);

            // Analyze live demo link
            const newPayload = { url: liveDemoLink };
            
            // Log request before sending
            console.log("Sending analysis request for:", liveDemoLink);
            
            const response = await axios.post('https://skifolio-main.onrender.com/analyze', newPayload, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 60000 // Increase timeout to 60 seconds for large sites
            });

            // Check if scores exist in the response
            if (response?.data?.scores) {
                console.log("Analysis results received:", response.data);
                
                const newSubmission = {
                    liveDemoLink,
                    demoVideoLink: videoURL,
                    timestamp: new Date(),
                    scores: response.data.scores,
                    feedback: response.data.feedback || {}
                };

                const submissionsRef = collection(doc(db, 'applicants', auth.currentUser.uid), 'submissions');
                await addDoc(submissionsRef, newSubmission);

                fetchSubmissions();
                setLiveDemoLink('');
                handleCloseModal();
                alert("Your project has been successfully submitted and analyzed!");
            } else {
                throw new Error("Invalid response from analysis server. Missing scores data.");
            }
        } catch (error) {
            console.error("Error submitting the demo link:", error);
            setError(`Submission failed: ${error.message || "Unknown error occurred"}`);
            alert(`Failed to analyze your project. ${error.message || "Please try again later."}`);
        } finally {
            setSubmissionLoading(false);
        }
    };

    const handleDeleteSubmission = async (submissionId) => {
        if (window.confirm("Are you sure you want to delete this submission?")) {
            try {
                const submissionRef = doc(db, 'applicants', auth.currentUser.uid, 'submissions', submissionId);
                await deleteDoc(submissionRef);
                fetchSubmissions();
            } catch (error) {
                console.error("Error deleting submission:", error);
                alert("Failed to delete submission. Please try again.");
            }
        }
    };

    return (
        <div className="portfolio-container">
            <h3 className="section-title">Portfolio</h3>
            {userData && (
                <div className="github-link">
                    <p>
                        GitHub: <a href={userData.githubLink} target="_blank" rel="noopener noreferrer">{userData.githubLink}</a>
                    </p>
                </div>
            )}

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Enter Live Demo Link"
                    value={liveDemoLink}
                    onChange={(e) => setLiveDemoLink(e.target.value)}
                />
                <button className="primary-button" onClick={handleOpenModal}>Submit</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showModal && (
                <div className="portfolio-modal-overlay">
                    <div className="portfolio-modal-content">
                        <h4>Upload Demo Video</h4>
                        <p className="modal-instruction">Please upload a short video demonstrating your projects.</p>
                        <input type="file" accept="video/*" onChange={handleFileChange} />
                        <div className="portfolio-modal-actions">
                            <button className="secondary-btn" onClick={handleCloseModal}>Cancel</button>
                            <button
                                disabled={!isVideoValid || submissionLoading}
                                onClick={handleSubmission}
                                className="primary-button"
                            >
                                {submissionLoading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <p>Loading submissions...</p>
            ) : (
                <div className="submissions-grid">
                    {submissions.length === 0 ? (
                        <p>No submissions yet. Submit your first project!</p>
                    ) : (
                        submissions.map((submission, index) => (
                            <div key={submission.id} className="submission-card">
                                <h4>
                                    <a
                                        href={submission.liveDemoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="demo-link"
                                    >
                                        Live Demo [{index + 1}]
                                    </a>
                                </h4>
                                <video width="320" height="240" controls>
                                    <source src={submission.demoVideoLink} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="scores">
                                    <p>Scores:</p>
                                    <ul>
                                        <li>HTML: <span className="score">{submission.scores.html}</span></li>
                                        <li>CSS: <span className="score">{submission.scores.css}</span></li>
                                        <li>JavaScript: <span className="score">{submission.scores.javascript}</span></li>
                                    </ul>
                                </div>
                                <button className="delete-btn" onClick={() => handleDeleteSubmission(submission.id)}>Delete</button>
                        
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Portfolio;