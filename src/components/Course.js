import {getCourseNumber, getCourseTerm, hasConflict, toggle} from "../utilities/times";
import React, {useContext} from "react";
import {ScheduleContext} from "../App";

const Course = ({course, selected, setSelected, clickOnCourseCode}) => {
    const courseTermAndName = `${getCourseTerm(course)} CS ${getCourseNumber(course)}`;
    const changeMainTitle = useContext(ScheduleContext);
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected);
    const style = {backgroundColor: isDisabled ? 'lightgrey' : isSelected ? 'lightgreen' : 'white'};
    return (
        <div className="card m-1 p-2"
             style={style}
             onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}>
            <div className="card-body">
                <div className="card-title"
                     onClick={() => clickOnCourseCode(courseTermAndName)}>{courseTermAndName}</div>
                <div className="card-text" onClick={() => changeMainTitle(course.title)}>{course.title}</div>
                <div className="card-text">{course.meets}</div>
            </div>
        </div>
    );
};

export default Course;