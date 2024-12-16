import React from 'react';

const Profile = ({ user }) => {
  if (!user) return <p>Devi effettuare il login per vedere il profilo.</p>;

  return (
    <div>
      <h2>Profilo di {user.email}</h2>
      <p>Ruolo: {user.role}</p>
      {/* Qui potresti mostrare acquisti, dati personali, etc. */}
    </div>
  );
};

export default Profile;
