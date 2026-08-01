
function PrerequisiteList({ names }) {
    if (!names || names.length === 0) {
        return <p className="prereq-empty">Sin prerrequisitos</p>;
    }

    return (
        <ul className="prereq-tag-list">
            {names.map((name) => (
                <li key={name} className="prereq-tag">
                    {name}
                </li>
            ))}
        </ul>
    );
}

export default PrerequisiteList;