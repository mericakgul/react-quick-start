import React, {createContext, useContext, useState} from "react";
import {getCourseTerm, terms} from "../utilities/times";
import Course from "./Course";

const SettingTerm = createContext(undefined);

const scheduleChanged = (selected, courses) => (
    selected.some(course => course !== courses[course.id])
);

const CourseList = ({courses, ...props}) => {
    const [term, setTerm] = useState('Fall');
    const [selected, setSelected] = useState([]);

    if(scheduleChanged(selected, courses)) {
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

const TermSelector = ({term}) => (
    <div className='btn-group'>
        {Object.values(terms).map(value => <TermButton key={value} term={value} checked={value === term}/>)}
    </div>
);

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

export default CourseList;
