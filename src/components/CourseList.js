import React, {createContext, useContext, useState} from "react";
import {getCourseTerm, terms} from "../utilities/times";
import Course from "./Course";
import {signInWithGoogle, signOut, useUserState} from "../utilities/firebase";

const SettingTerm = createContext(undefined);

const scheduleChanged = (selected, courses) => (
    selected.some(course => course !== courses[course.id])
);

const CourseList = ({courses, ...props}) => {
    const [term, setTerm] = useState('Fall');
    const [selected, setSelected] = useState([]);

    if (scheduleChanged(selected, courses)) {
        setSelected([])
    }

    const termCourses = Object.values(courses).filter(course => term === getCourseTerm(course));
    return (
        <>
            <SettingTerm.Provider value={setTerm}>
                <TermSelector term={term}/>
            </SettingTerm.Provider>
            <div className="course-list">
                {termCourses.map(course => <Course key={course.id} selected={selected} setSelected={setSelected}
                                                   course={course} {...props}/>)}
            </div>
        </>
    );
};

const TermSelector = ({term}) => {
    const [user] = useUserState();
    return (
        <div className="btn-toolbar justify-content-between">
            <div className='btn-group'>
                {Object.values(terms).map(value => <TermButton key={value} term={value} checked={value === term}/>)}
            </div>
            { user ? <SignOutButton displayName = {user.displayName}/> : <SignInButton />}
        </div>
    );
};

const TermButton = ({term, checked}) => {
    const setTerm = useContext(SettingTerm);
    return (
        <>
            <input type="radio" id={term} className="btn-check" autoComplete="off" checked={checked}
                   onChange={() => setTerm(term)}/>
            <label className="btn btn-success m-1 p-2" htmlFor={term}> {term} </label>
        </>
    )
};

const SignInButton = () => (
    <button className="btn btn-secondary btn-sm m-1"
            onClick={() => signInWithGoogle()}>
        Sign In
    </button>
);

const SignOutButton = ({displayName}) => (
    <button className="btn btn-secondary btn-sm m-1"
            onClick={() => signOut(displayName)}>
        Sign Out {displayName}
    </button>
)

export default CourseList;
