import Country from "./Country";

const Countries = ({ countries, selected, onSelected }) => {
    if (countries.length > 10) {
        return (
            <div>
                <p>Too many matches, specify another filter.</p>
            </div>
        );
    }

    if (countries.length === 1) {
        return <Country country={countries[0]} />;
    }

    return (
        <div>
            <ul>
                {countries.map((item) => (
                    <li key={item.name.common}>
                        {item.name.common}&nbsp;
                        <button onClick={() => onSelected(item)}>show</button>
                    </li>
                ))}
            </ul>
            <Country country={selected} />
        </div>
    );
};

export default Countries;
