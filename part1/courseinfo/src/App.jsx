const Header = (props) => {
    return <h1>{props.course.name}</h1>;
};

const Part = (props) => {
    return (
        <p>
            {props.part.name} {props.part.exercises}
        </p>
    );
};

const Content = (props) => {
    return (
        <div>
            {props.course.parts.map((item) => (
                <Part part={item} />
            ))}
        </div>
    );
};

const Total = (props) => <p>Number of exercises {props.total}</p>;

const App = () => {
    const course = {
        name: "Half Stack application development",
        parts: [
            {
                name: "Fundamentals of React",
                exercises: 10,
            },
            {
                name: "Using props to pass data",
                exercises: 7,
            },
            {
                name: "State of a component",
                exercises: 14,
            },
        ],
    };

    return (
        <div>
            <Header course={course} />
            <Content course={course} />
            <Total
                total={course.parts.reduce((init, p) => init + p.exercises, 0)}
            />
        </div>
    );
};

export default App;
