// UserList.js
import React from 'react';

function UserList({ users, loading }) {
  return (
    <div>
      <h3>Lista de Usuarios:</h3>
      <ul className="user-list">
        {users.map(user => (
          <li key={user._id} className="user-item">
            <span className="user-name">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
