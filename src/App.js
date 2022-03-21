import React, {useState, useEffect, useContext, createContext} from 'react';
import './App.css';

const terms = {F: 'Fall', W: 'Winter', S: 'Spring'};
const ScheduleContext = createContext(undefined);
const SettingTerm = createContext(undefined);
const mainTitle = 'CS Courses for 2018-2019';

const App = () => {
    const [schedule, setSchedule] = useState();
    const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';

    useEffect(() => {
        const fetchSchedule = async () => {
            const response = await fetch(url);
            if (!response.ok) throw response;
            const json = await response.json();
            console.log('json', json);
            setSchedule(addScheduleTimes(json));
        };
        fetchSchedule();
    }, []);

    if (!schedule) return <h1>Loading schedule...</h1>;

    const changeMainTitle = (courseTitle) => {
        setSchedule((prevState) => ({
            ...prevState,
            title: courseTitle,
        }));
    };

    return (                                // Here there are two ways to move the props to the sub components. First one is with provider and in this case we do not need to carry the prop in every single sub component but
                                            // we could just define it and use it somewhere one of sub component. Other way is to move the prop from each component as selectCourse prop. We also used spread operator for this prop.
        <div className="container">
            <Banner title={ schedule.title } putMainTitleBack={mainTitle => changeMainTitle(mainTitle)}/>
            <ScheduleContext.Provider value={changeMainTitle}>
                <CourseList courses={ schedule.courses } clickOnCourseCode={(courseTitle) => changeMainTitle(courseTitle)} />
            </ScheduleContext.Provider>
        </div>
    );
};

const Banner = ({title, putMainTitleBack}) => (
    <h1 onClick={() => putMainTitleBack(mainTitle)}>{title}</h1>
);

//// Demonstraton of useState() function flow

// const myMemory = {
//     'ListCourse'= {...}
// };
//
// const updateState = (newState) => {
//     const currentState = myMemory?.['ListCourse'].state;
//     if(currentState !== newState) {
//         myMemory['ListCourse'].state = newState;
//     }
//     ListCourse();
// }
//
// function useState2(defaultState) {
//     const state = myMemory?.['ListCourse'].state || defaultState;
//
//     return [state, updateState];
//
// }
//
//
// function ListCourse() {
//     const [term, setTerm] = useState2('fall');
//
//     console.log('term', term);
//     return {
//         render: () => {
//             setTerm('spring');
//         }
//     }
// }
//
// const course = ListCourse();
//
// setTimeout(() => {
//     course.render();
// }, 1000)

const CourseList = ({courses, ...props}) => {
    const [term, setTerm] = useState('Fall');
    const [selected, setSelected] = useState([]);
    const termCourses = Object.values(courses).filter(course => term === getCourseTerm(course));
    return (
    <>
        <SettingTerm.Provider value={setTerm}>
            <TermSelector term={term}/>
        </SettingTerm.Provider>
        <div className="course-list">
            {termCourses.map(course => <Course key={course.id} selected={selected} setSelected={setSelected} course={course} {...props}/>)}
        </div>
    </>
    );
};

const TermSelector = ({term}) => (
    <div className='btn-group'>
        {Object.values(terms).map(value => <TermButton key={value} term={value} checked={value === term}/>)}
    </div>
)

const TermButton = ({term, checked}) => {
    const setTerm = useContext(SettingTerm);
    return (
        <>
            <input type="radio" id={term} className="btn-check" autoComplete="off" checked={checked}
                   onChange={() => setTerm(term)}/>
            <label className="btn btn-success m-1 p-2" htmlFor={term}> {term} </label>
        </>
    )
}

const Course = ({course, selected, setSelected, clickOnCourseCode}) => {
    const courseTermAndName = `${getCourseTerm(course)} CS ${getCourseNumber(course)}`;
    const changeMainTitle = useContext(ScheduleContext);
    const isSelected = selected.includes(course);
    const style = {backgroundColor: isSelected ? 'lightgreen' : 'white'};
    return (
        <div className="card m-1 p-2"
            style = {style}
            onClick={() => setSelected(toggle(course, selected))}>
            <div className="card-body">
                <div className="card-title" onClick={() => clickOnCourseCode(courseTermAndName)}>{courseTermAndName}</div>
                <div className="card-text" onClick={() => changeMainTitle(course.title)}>{course.title}</div>
                <div className="card-text">{course.meets}</div>
            </div>
        </div>
    );
};

const getCourseTerm = course => (
    terms[course.id.charAt(0)]
);

const getCourseNumber = course => (
    course.id.slice(1, 4)
);

const toggle = (x, lst) => (
  lst.includes(x) ? lst.filter(y => y !== x) : [x, ...lst]
);

// const hasConflict =(course, selected) => {
//     selected.some(selection => courseConflict(course, selection))
// };

const meetsPat = /^ *((?:M|Tu|W|Th|F)+) +(\d\d?):(\d\d) *[ -] *(\d\d?):(\d\d) *$/;

const timeParts = meets => {
    const [match, days, hh1, mm1, hh2, mm2] = meetsPat.exec(meets) || [];
    return !match ? {} : {
        days,
        hours: {
            start: hh1 * 60 + mm1 * 1,
            end: hh2 * 60 + mm2 * 1
        }
    };
};

const mapValues = (fn, obj) => {
    console.log('lala', Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)])));
    return (
        Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, fn(value)]))
    );
};

const addCourseTimes = course => ({
    ...course,
    ...timeParts(course.meets)
});

const addScheduleTimes = schedule => {
    console.log('lala2', mapValues(addCourseTimes, schedule.courses));
    return ({
        title: schedule.title,
        courses: mapValues(addCourseTimes, schedule.courses)
    });
};


export default App;

