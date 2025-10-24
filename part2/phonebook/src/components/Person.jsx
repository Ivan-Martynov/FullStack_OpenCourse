const Person = ({ person, doDelete }) => (
    <li>
        {person.name} {person.number}&nbsp;
        <button onClick={doDelete}>delete</button>
    </li>
);

export default Person;
