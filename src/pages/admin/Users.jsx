import { Link } from 'react-router-dom';

const users = [
    { id: 1, name: 'Alice Andersson', email: 'alice@example.com' },
    { id: 2, name: 'Bob Berg', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Carlsson', email: 'charlie@example.com' },
    { id: 4, name: 'Diana Dahl', email: 'diana@example.com' },
    { id: 5, name: 'Eve Eriksson', email: 'eve@example.com' },
    { id: 6, name: 'Frank Falk', email: 'frank@example.com' },
    { id: 7, name: 'Grace Gustafsson', email: 'grace@example.com' },
    { id: 8, name: 'Hank Hansen', email: 'hank@example.com' },
    { id: 9, name: 'Ivy Ingelsson', email: 'ivy@example.com' },
    { id: 10, name: 'Jack Johansson', email: 'jack@example.com' },
    { id: 11, name: 'Karen Karlsson', email: 'karen@example.com' },
    { id: 12, name: 'Leo Lind', email: 'leo@example.com' },
    { id: 13, name: 'Mona Månsson', email: 'mona@example.com' },
    { id: 14, name: 'Nina Nilsson', email: 'nina@example.com' },
    { id: 15, name: 'Oscar Olsson', email: 'oscar@example.com' },
    { id: 16, name: 'Paula Pettersson', email: 'paula@example.com' },
    { id: 17, name: 'Quinn Quist', email: 'quinn@example.com' },
    { id: 18, name: 'Rickard Rask', email: 'rickard@example.com' },
    { id: 19, name: 'Sara Svensson', email: 'sara@example.com' },
    { id: 20, name: 'Tommy Thor', email: 'tommy@example.com' },
];
export default function Users() {
    return (
        <>
            <h2>Användare</h2>
            <div className='admin-users'>
                <input type='text' placeholder='Sök efter användare...' />
                <ul>
                    <li className='user-header'>
                        <div>Namn</div>
                        <div>Email</div>
                    </li>
                    {users.map((user) => (
                        <li className='user-card'>
                            <Link to={`/admin/users/${user.id}`} key={user.id}>
                                <p>{user.name}</p>
                                <p>{user.email}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
