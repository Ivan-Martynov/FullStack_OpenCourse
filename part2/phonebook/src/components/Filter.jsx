const Filter = ({ mask, setMask }) => {
    return (
        <div>
            Filter shown with:
            <input
                value={mask}
                onChange={(event) => setMask(event.target.value)}
            />
        </div>
    );
};
export default Filter;
