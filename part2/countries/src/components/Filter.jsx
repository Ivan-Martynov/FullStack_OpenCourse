const Filter = ({ pattern, onPatternChange }) => {
    return (
        <div>
            Find countries:
            <input value={pattern} onChange={onPatternChange} />
        </div>
    );
};
export default Filter;
