import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ScoutVisibility = () => {
    const [scoutVisibility, setScoutVisibility] = useState(false);
    const [desiredPosition, setDesiredPosition] = useState('');

    useEffect(() => {
        const loadScoutData = async () => {
            if (!auth.currentUser) {
                console.error("User is not signed in.");
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'applicants', auth.currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setScoutVisibility(data.scoutVisibility || false);
                    setDesiredPosition(data.desiredPosition || '');
                }
            } catch (error) {
                console.error("Error fetching scout data:", error);
            }
        };
        loadScoutData();
    }, []);

    const toggleScoutVisibility = async () => {
        try {
            const newVisibility = !scoutVisibility;
            setScoutVisibility(newVisibility);
            await updateDoc(doc(db, 'applicants', auth.currentUser.uid), { scoutVisibility: newVisibility });
        } catch (error) {
            console.error("Error updating scout visibility:", error);
        }
    };

    const updateDesiredPosition = async (e) => {
        const newPosition = e.target.value;
        setDesiredPosition(newPosition);
        try {
            await updateDoc(doc(db, 'applicants', auth.currentUser.uid), { desiredPosition: newPosition });
        } catch (error) {
            console.error("Error updating desired position:", error);
        }
    };

    return (
        <div id='scout-visibility' style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px', marginTop: '20px' }}>
            <h3>Scout Visibility</h3>
            <label style={{ fontWeight: 'bold' }}>Visibility:</label>
            <input 
                type="checkbox" 
                checked={scoutVisibility} 
                onChange={toggleScoutVisibility} 
                style={{ marginLeft: '10px' }}
            />
            <p>{scoutVisibility ? "You are visible to employers." : "You are hidden from employers."}</p>
            
            <label style={{ fontWeight: 'bold' }}>Desired Position:</label>
            <input 
                type="text" 
                value={desiredPosition} 
                onChange={updateDesiredPosition} 
                placeholder="Enter your desired position" 
                style={{ marginLeft: '10px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
        </div>
    );
};

export default ScoutVisibility;