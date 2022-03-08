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
            setSchedule(json);
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
                <CourseList courses={ schedule.courses } selectCourse={(courseTitle) => changeMainTitle(courseTitle)} />
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
    const termCourses = Object.values(courses).filter(course => term === getCourseTerm(course));
    return (
    <>
        <SettingTerm.Provider value={setTerm}>
            <TermSelector term={term}/>
        </SettingTerm.Provider>
        <div className="course-list">
            {termCourses.map(course => <Course key={course.id} course={course} {...props}/>)}
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

const Course = ({course, selectCourse}) => {
    const courseTermAndName = `${getCourseTerm(course)} CS ${getCourseNumber(course)}`;
    const changeMainTitle = useContext(ScheduleContext);
    return (
        <div className="card m-1 p-2">
            <div className="card-body">
                <div className="card-title" onClick={() => selectCourse(courseTermAndName)}>{courseTermAndName}</div>
                <div className="card-text" onClick={() => changeMainTitle(course.title)}>{course.title}</div>
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

export default App;

