import { useState } from "react";
import SearchTools from "./tools/SearchTools";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import { useEffect } from "react";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
    const [persons, _setPersons] = useState([]);
    const [mask, _setMask] = useState("");
    const [notificationMessage, _setNotificationMessage] = useState(null);
    const [notificationClass, _setNotificationClass] = useState(
        "notification-success"
    );

    // const deletePerson = (id) => {
    //     const person = persons.find((item) => item.id === id);

    //     if (window.confirm(`Delete ${person.name}?`)) {
    //         personService.remove(id).then(() => {
    //             _setPersons(persons.filter((item) => item.id !== id));
    //         });
    //     }
    // };

    // Retrieve data from json file using json-server.
    useEffect(() => {
        personService
            .getAll()
            .then((initialPersons) => _setPersons(initialPersons));
    }, []);

    const personsToDisplay = persons.filter((p) =>
        SearchTools.fuzzySearch(mask.toLowerCase(), p.name.toLowerCase())
    );

    let timer = null;
    const inform = ({ message, messageClass }) => {
        window.clearTimeout(timer);
        console.log("calling inform", message, messageClass);

        _setNotificationMessage(message);
        _setNotificationClass(messageClass);
        timer = window.setTimeout(() => {
            _setNotificationMessage(null);
        }, 5000);
    };

    return (
        <div>
            <h2>Phonebook</h2>

            <Notification
                message={notificationMessage}
                notificationClass={notificationClass}
            />

            <Filter mask={mask} setMask={_setMask} />

            <h3>Add a new person</h3>
            <PersonForm
                persons={persons}
                setPersons={_setPersons}
                inform={inform}
            />

            <h3>Numbers</h3>
            <Persons persons={personsToDisplay} setPersons={_setPersons} />
        </div>
    );
};

export default App;
