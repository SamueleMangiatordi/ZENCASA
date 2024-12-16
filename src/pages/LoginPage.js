import React, { useState } from 'react';
import Login from '../components/login.js';


const LoginPage = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    // Qui potresti effettuare un redirect in base al ruolo dell'utente
  };

  return (
    <div>
      <h1>Pagina di Login</h1>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <p>Accesso effettuato come {user.role}. Ora puoi navigare nel sito.</p>
      )}
    </div>
  );
};

export default LoginPage;
