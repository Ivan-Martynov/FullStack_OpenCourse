import Person from "./Person";
import personService from "../services/persons";

const Persons = ({ persons, setPersons }) => {
    const deletePerson = (id) => {
        const person = persons.find((item) => item.id === id);

        if (window.confirm(`Delete ${person.name}?`)) {
            personService.remove(id).then(() => {
                setPersons(persons.filter((item) => item.id !== id));
            });
        }
    };

    return (
        <ul>
            {persons.map((person) => {
                return (
                    <Person
                        key={person.name}
                        person={person}
                        doDelete={() => deletePerson(person.id)}
                    />
                );
            })}
        </ul>
    );
};
export default Persons;
