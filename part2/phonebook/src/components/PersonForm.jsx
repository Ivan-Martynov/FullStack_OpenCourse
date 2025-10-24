import { useState } from "react";
import personService from "../services/persons";

const PersonForm = ({ persons, setPersons, inform }) => {
    const [newName, _setNewName] = useState("");
    const [newNumber, _setNewNumber] = useState("");

    const _changePhoneNumber = (person, number) => {
        if (
            !window.confirm(
                `${person.name} is already added to the phonebook, replace ` +
                    `the old number with a new one?`
            )
        ) {
            return;
        }
        personService
            .update(person.id, { ...person, number })
            .then((returnedPerson) => {
                setPersons(
                    persons.map((item) =>
                        item.id === person.id ? returnedPerson : item
                    )
                );
                inform({
                    message:
                        `New number for ${person.name} is ` +
                        `${returnedPerson.number}`,
                    messageClass: "notification-success",
                });
            })
            .catch(() => {
                inform({
                    message:
                        `Information of ${person.name} has already been ` +
                        `deleted from the server`,
                    messageClass: "notification-failure",
                });
            });
    };

    const addPerson = (event) => {
        event.preventDefault();
        const name = newName.trim();
        const number = newNumber.trim();
        const person = persons.find((p) => p.name === name);
        if (person) {
            _changePhoneNumber(person, number);
        } else {
            personService.create({ name, number }).then((returnedPerson) => {
                setPersons(persons.concat(returnedPerson));
                _setNewName("");
                _setNewNumber("");
            });
            inform({
                message: `Added ${name}`,
                messageClass: "notification-success",
            });
        }
    };

    return (
        <form onSubmit={addPerson}>
            <div>
                name:
                <input
                    value={newName}
                    onChange={(event) => _setNewName(event.target.value)}
                />
            </div>
            <div>
                number:
                <input
                    value={newNumber}
                    onChange={(event) => _setNewNumber(event.target.value)}
                />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    );
};

export default PersonForm;
