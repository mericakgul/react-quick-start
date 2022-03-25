import React, {useState, useEffect, createContext} from 'react';
import './App.css';
import {addScheduleTimes} from "./utilities/times";
import CourseList from "./components/CourseList";
import {useData} from "./utilities/firebase";

export const ScheduleContext = createContext(undefined);
const mainTitle = 'CS Courses for 2018-2019';

const App = () => {
    const [schedule, loading, error] = useData('/', addScheduleTimes);

    if (error) return <h1>{error}</h1>;
    if (loading) return <h1>Loading the schedule...</h1>
    // const [schedule, setSchedule] = useState();
    // const url = 'https://courses.cs.northwestern.edu/394/data/cs-courses.php';
    //
    // useEffect(() => {
    //     const fetchSchedule = async () => {
    //         const response = await fetch(url);
    //         if (!response.ok) throw response;
    //         const json = await response.json();
    //         setSchedule(addScheduleTimes(json));
    //     };
    //     fetchSchedule();
    // }, []);
    //
    // if (!schedule) return <h1>Loading schedule...</h1>;

    const changeMainTitle = (courseTitle) => {  // After adding firebase database this function is not working anymore. It'll be kept for study purposes.
        // setSchedule((prevState) => ({
        //     ...prevState,
        //     title: courseTitle,
        // }));
    };

    return (                                // Here there are two ways to move the props to the sub components. First one is with provider and in this case we do not need to carry the prop in every single sub component but
        // we could just define it and use it somewhere one of sub component. Other way is to move the prop from each component as selectCourse prop. We also used spread operator for this prop.
        <div className="container">
            <Banner title={schedule.title} putMainTitleBack={mainTitle => changeMainTitle(mainTitle)}/>
            <ScheduleContext.Provider value={changeMainTitle}>
                <CourseList courses={schedule.courses}
                            clickOnCourseCode={(courseTitle) => changeMainTitle(courseTitle)}/>
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

export default App;

