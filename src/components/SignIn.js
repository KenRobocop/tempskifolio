import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const applicantDoc = await getDoc(doc(db, 'applicants', user.uid));
            const employerDoc = await getDoc(doc(db, 'employers', user.uid));
            const userDocToBeApproved = await getDoc(doc(db, 'userAccountsToBeApproved', user.uid));

            if (userDocToBeApproved.exists()) {
                alert('Your account is pending approval. Please wait for admin approval.');
                await signOut(auth);
                navigate('/');
                return;
            }

            if (applicantDoc.exists()) {
                navigate('/applicant/profile');
            } else if (employerDoc.exists()) {
                navigate('/employer/profile');
            } else {
                console.error('User type not found in database.');
            }
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert('Please enter your email to reset your password.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent. Please check your inbox.');
        } catch (error) {
            console.error('Error sending password reset email:', error);
        }
    };

    return (
        <div className='hero' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className='choicecontainer' style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                {/*START OF FORM CHANGES*/}
                <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
                <h2 style={{fontFamily: "times new roman"}}>Sign In</h2>
                    <input
                        id='email'
                        className='input'
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ marginBottom: '10px', width: '100%' }}
                    />
                    <div style={{ position: 'relative', width: '100%', marginBottom: '10px' }}>
                        <input
                            className='input'
                            id='password'
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', marginLeft: '-2px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'black',
                            }}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <button className="input submit" type="submit">Sign In</button>
                    {/* Changed forgot password from button to clickable text inside the form */}
                    <p onClick={handleForgotPassword} style={{ marginTop: '10px', cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>Forgot Password?</p>
                </form>
                {/*END OF FORM CHANGES*/}
            </div>
        </div>
    );
};

export default SignIn;
