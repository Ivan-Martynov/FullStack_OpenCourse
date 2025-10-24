import Weather from "./Weather";
import CapitalInfo from "./CapitalInfo";

const Country = ({ country }) => {
    if (!country) {
        return <></>;
    }

    return (
        <div>
            <h1>{country.name.common}</h1>

            <CapitalInfo capital={country.capital} />

            <p>
                <strong>Population</strong>: {country.population} people
            </p>
            <p>
                <strong>Area</strong>: {country.area} km<sup>2</sup>
            </p>

            <h2>Languages</h2>
            <ul>
                {Object.keys(country.languages).map((key) => (
                    <li key={key}>{country.languages[key]}</li>
                ))}
            </ul>

            <h1>{country.flag}</h1>

            <Weather city={country.capital[0]} />
        </div>
    );
};

export default Country;
