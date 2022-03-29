import React, {useState, useEffect} from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase,ref,onValue, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDSq5wqKwr4rqRonHmoUOocFTCfXQbQEvQ",
    authDomain: "quick-start-firebase-e19fb.firebaseapp.com",
    databaseURL: "https://quick-start-firebase-e19fb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "quick-start-firebase-e19fb",
    storageBucket: "quick-start-firebase-e19fb.appspot.com",
    messagingSenderId: "750699902086",
    appId: "1:750699902086:web:aabe09d2beeb0c8c3c0d07",
    measurementId: "G-QDJJB67FFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database  = getDatabase(app);

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        const dbRef = ref(database, path);
        const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
        if (devMode) { console.log(`loading ${path}`); }
        return onValue(dbRef, (snapshot) => {
            const val = snapshot.val();
            if (devMode) { console.log(val); }
            setData(transform ? transform(val) : val);
            setLoading(false);
            setError(null);
        }, (error) => {
            setData(null);
            setLoading(false);
            setError(error);
        });
    }, [path, transform]);

    return [data, loading, error];
};

export const setData = (path, value) => (
    set(ref(database, path), value)
);