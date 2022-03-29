import {getCourseNumber, getCourseTerm, hasConflict} from "../utilities/times";
import React, {useContext} from "react";
import {ScheduleContext} from "../App";
import useDoubleClick from "use-double-click";
import {useRef} from "react";
import {timeParts} from "../utilities/times";
import {setData, useUserState} from "../utilities/firebase";

const reschedule = async (course, meets) => {
    if (meets && window.confirm(`Change ${course.id} to ${meets}?`)) {
        try {
            await setData (`/courses/${course.id}/meets`, meets);
        } catch (error){
            alert(error);
        }
    }
};

const Course = ({course, selected, setSelected, clickOnCourseCode}) => {
    const courseTermAndName = `${getCourseTerm(course)} CS ${getCourseNumber(course)}`;
    const changeMainTitle = useContext(ScheduleContext);
    const isSelected = selected.includes(course);
    const isDisabled = !isSelected && hasConflict(course, selected);
    const [user] = useUserState();
    const style = {backgroundColor: isDisabled ? 'lightgrey' : isSelected ? 'lightgreen' : 'white'};
    const courseRef = useRef();
    useDoubleClick({
        onSingleClick: () => {
            if(!isDisabled){
                setSelected(toggle(course, selected))
            }
        },
        onDoubleClick: () => {
            if(user){
                reschedule(course, getCourseMeetingData(course));
            }
        },
        ref: courseRef,
        latency: 250
    });
    return (
        <div className="card m-1 p-2"
             style={style}
             // onClick={isDisabled ? null : () => setSelected(toggle(course, selected))}
             ref={courseRef}>
            <div className="card-body">
                <div className="card-title"
                     onClick={() => clickOnCourseCode(courseTermAndName)}>{courseTermAndName}</div>
                <div className="card-text" onClick={() => changeMainTitle(course.title)}>{course.title}</div>
                <div className="card-text">{course.meets}</div>
            </div>
        </div>
    );
};


const toggle = (x, lst) => (
    lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

const getCourseMeetingData = course => {
    const meets = prompt('Enter meeting data: MTuWThF hh:mm-hh:mm:', course.meets);  // prompt returns user input string or null if clicked on cancel.
    const valid = !meets || timeParts(meets).days;
    if (valid) {
        return meets;
    }
    alert('Invalid meeting data');
    return null;
};

export default Course;