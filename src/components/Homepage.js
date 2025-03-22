// import React from "react";
// import { Link } from "react-router-dom";
// import '../styles.css';

// const Homepage = () => {
//   return (
//     <div className="homepage-container">
      
//       {/* Navbar */}
//       <header className="navbar">
//         <h1 className="logo">Ski-Folio</h1>

//         <div className="nav-buttons">
//           <Link to="/signin">
//             <button className="btn login-btn">Log In</button>
//           </Link>
//           <Link to="/select-account"> 
//             <button className="btn signup-btn">Sign Up</button>
//           </Link>
//         </div>
//       </header>

//       {/* Main Section */}
//       <main className="main-content">
//         <h2>Welcome to Ski-Folio</h2>
//         <p>
//           Ski-Folio is your personalized platform for finding jobs and building your professional portfolio. 
//           Whether you're an applicant looking for opportunities or an employer seeking top talent, 
//           Ski-Folio connects you with the right match.
//         </p>

//         <div className="cta-buttons">
//           <Link to="/select-account">  
//             <button className="btn primary-btn">Get Started</button>
//           </Link>
//           <Link to="/home">
//             <button className="btn secondary-btn">Learn More</button>
//           </Link>
//         </div>
//       </main>

//       {/* Description Section */}
//       <section className="description-section">
//         <div className="description-content">
//           <h3>Why Choose Ski-Folio?</h3>
//           <p>
//             - Showcase your skills and experience with a dynamic portfolio.<br />
//             - Find and apply for jobs that match your expertise.<br />
//             - Employers can post jobs and connect with qualified applicants.<br />
//             - Enhance your career with a professional, easy-to-use platform.
//           </p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="footer">
//         © {new Date().getFullYear()} Ski-Folio. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Homepage;

/*START OF HOMEPAGE*/

// .homepage-container {
//     min-height: 100vh;
//     display: flex;
//     flex-direction: column;
//     background: linear-gradient(135deg, #f0f0f0, #e6efff);
//     font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//     color: #333;
//     margin: 0;
//     padding: 0;
//   }
  
//   /* Header styling */
//   header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 25px 80px;
//     background: #ffffff;
//     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
//     transition: all 0.3s ease-in-out;
//   }
  
//   header:hover {
//     box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
//   }
  
//   /* Logo */
//   h1 {
//     font-size: 36px;
//     color: #2c3e50;
//     margin: 0;
//     font-weight: bold;
//     letter-spacing: 1px;
//   }
  
//   /* Navigation buttons */
//   .nav-buttons {
//     display: flex;
//     gap: 18px;
//   }
  
//   /* Button styling */
//   button {
//     padding: 14px 34px;
//     border: none;
//     border-radius: 30px;
//     font-size: 16px;
//     cursor: pointer;
//     transition: all 0.3s;
//     font-weight: bold;
//     box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
//   }
  
//   button:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
//   }
  
//   /* Log In Button */
//   button.bg-blue {
//     background: #3498db;
//     color: white;
//   }
  
//   button.bg-blue:hover {
//     background: #2980b9;
//   }
  
//   /* Sign Up Button */
//   button.bg-green {
//     background: #2ecc71;
//     color: white;
//   }
  
//   button.bg-green:hover {
//     background: #27ae60;
//   }
  
//   /* Main section styling */
//   main {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     text-align: center;
//     padding: 80px 20px;
//     background: linear-gradient(135deg, #ffffff, #f5f5f5);
//   }
  
//   /* Main heading */
//   h2 {
//     font-size: 56px;
//     color: #2c3e50;
//     margin-bottom: 24px;
//     font-weight: bold;
//     line-height: 1.2;
//     letter-spacing: 1px;
//   }
  
//   /* Main paragraph */
//   p {
//     font-size: 20px;
//     color: #555;
//     max-width: 1000px;
//     line-height: 1.8;
//     margin-bottom: 40px;
//   }
  
//   /* CTA buttons */
//   .cta-buttons {
//     display: flex;
//     gap: 24px;
//     margin-top: 20px;
//   }
  
//   .cta-btn {
//     background: #f39c12;
//     color: white;
//     padding: 16px 40px;
//     border-radius: 30px;
//     font-size: 18px;
//     font-weight: bold;
//     transition: all 0.3s;
//     box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
//   }
  
//   .cta-btn:hover {
//     background: #e67e22;
//     transform: translateY(-4px);
//     box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
//   }
  
//   /* Description section */
//   section {
//     background: #ffffff;
//     padding: 100px 20px;
//     text-align: center;
//     box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
//     transition: all 0.3s;
//   }
  
//   section:hover {
//     box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
//   }
  
//   section h3 {
//     font-size: 44px;
//     color: #3498db;
//     margin-bottom: 24px;
//     font-weight: bold;
//     letter-spacing: 1px;
//   }
  
//   section p {
//     font-size: 20px;
//     color: #555;
//     line-height: 1.8;
//     max-width: 1100px;
//     margin: 0 auto;
//   }
  
//   /* Footer */
//   footer {
//     text-align: center;
//     padding: 30px;
//     background: #f1f1f1;
//     color: #555;
//     font-size: 16px;
//     transition: all 0.3s;
//   }
  
//   footer:hover {
//     background: #e0e0e0;
//   }
  
//   /* Responsive design */
//   @media (max-width: 992px) {
//     header {
//         flex-direction: column;
//         text-align: center;
//         padding: 20px 30px;
//     }
  
//     .nav-buttons {
//         margin-top: 20px;
//     }
  
//     main {
//         padding: 60px 15px;
//     }
  
//     section {
//         padding: 60px 15px;
//     }
  
//     button, .cta-btn {
//         width: 100%;
//         padding: 14px 28px;
//     }
  
//     h2 {
//         font-size: 42px;
//     }
  
//     p {
//         font-size: 18px;
//     }
  
//     section h3 {
//         font-size: 36px;
//     }
//   }
  
//   /*END OF HOMEPAGE*/