import axios from "axios";
import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Countries from "./components/Countries";

const App = () => {
    const [countries, setCountries] = useState([]);
    const [selected, setSelected] = useState(null);
    const [pattern, setPattern] = useState("");

    const onPatternChange = (event) => {
        setPattern(event.target.value);
        setSelected(null);
    };

    const onSelected = (country) => {
        setSelected(country);
    };

    useEffect(() => {
        axios
            .get("https://studies.cs.helsinki.fi/restcountries/api/all")
            .then((response) => setCountries(response.data));
    }, []);

    const countriesToShow = countries.filter((item) =>
        item.name.common
            .toLocaleLowerCase()
            .includes(pattern.toLocaleLowerCase())
    );

    return (
        <div>
            <Filter pattern={pattern} onPatternChange={onPatternChange} />
            <Countries
                countries={countriesToShow}
                selected={selected}
                onSelected={onSelected}
            />
        </div>
    );
};

export default App;
