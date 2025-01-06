import React from 'react';
import {
  AdminContainer,
  AdminHeader,
  AdminTitle,
  DashboardContent,
  NavigationBar,
  NavButton,
} from '../../styles/StyledAdminProfile';

const AdminProfile = () => {
  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>Profilo Amministratore</AdminTitle>
        <NavigationBar>
          <NavButton>Team</NavButton>
          <NavButton>Utenti</NavButton>
          <NavButton>Statistiche</NavButton>
        </NavigationBar>
      </AdminHeader>
      <DashboardContent>
        <h2>Benvenuto nella dashboard amministrativa!</h2>
        <p>Qui puoi gestire l'e-commerce: ordini, prodotti, clienti, e statistiche.</p>
      </DashboardContent>
    </AdminContainer>
  );
};

export default AdminProfile;
