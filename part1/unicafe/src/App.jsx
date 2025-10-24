import { useState } from "react";

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const StatisticsRow = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
);

const Statistics = ({ good, neutral, bad }) => {
    const n = good + neutral + bad;
    if (n === 0) {
        return <div>No feedback given</div>;
    }

    const sum = good - bad;
    return (
        <table>
            <tbody>
                <StatisticsRow text={"good"} value={good} />
                <StatisticsRow text={"neutral"} value={neutral} />
                <StatisticsRow text={"bad"} value={bad} />
                <StatisticsRow text={"all"} value={n} />
                <StatisticsRow text={"average"} value={sum / n} />
                <StatisticsRow
                    text={"positive"}
                    value={(good / n).toFixed(2) + " %"}
                />
            </tbody>
        </table>
    );
};

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const handleGoodClick = () => setGood(good + 1);
    const handleNeutralClick = () => setNeutral(neutral + 1);
    const handleBadClick = () => setBad(bad + 1);

    return (
        <div>
            <h2>Give feedback</h2>
            <Button onClick={handleGoodClick} text="Good" />
            <Button onClick={handleNeutralClick} text="Neutral" />
            <Button onClick={handleBadClick} text="Bad" />

            <h3>Statistics</h3>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    );
};

export default App;
