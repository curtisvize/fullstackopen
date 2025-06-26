const Title = ({ name }) => <h3>{name}</h3>
const Part = ({ part }) => <p>{part.name} {part.exercises}</p>
const Total = ({ total }) => <div><b>total of {total} exercises</b></div>

const Content = ({ parts }) => {
    const total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part} />
            )}
            <Total total={total} />
        </div>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Title name={course.name} />
            <Content parts={course.parts} />
        </div>

    )
}

export default Course