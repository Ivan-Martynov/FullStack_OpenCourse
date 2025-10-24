const Total = ({ parts }) => (
    <strong>
        Total of {parts.reduce((init, p) => init + p.exercises, 0)} exercises
    </strong>
);

export default Total;
