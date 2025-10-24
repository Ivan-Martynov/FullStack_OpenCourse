const CapitalInfo = ({ capital }) => {
    if (capital.length === 1) {
        return (
            <p>
                <strong>Capital:</strong> {capital[0]}
            </p>
        );
    }

    return (
        <div>
            <p>
                <strong>Capitals:</strong>
            </p>
            <ul>
                {capital.map((city) => (
                    <li key={city}>{city}</li>
                ))}
            </ul>
        </div>
    );
};

export default CapitalInfo;
