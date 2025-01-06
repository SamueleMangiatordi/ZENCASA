import React, { useState } from 'react';
import {
  AdminContainer,
  Sidebar,
  SidebarItem,
  SubMenu,
  SubMenuItem,
  DashboardSection,
  StatsContainer,
  StatsCard,
  StatIcon,
  CarouselContainer,
  ProductCarousel,
  ProductCard,
  SidebarAvatar
} from '../styles/StyledAdminProfile';
import {
  Header,
  Title,
  StyledButton,
  Icon,
  Banner,
} from '../styles/StyledComponents';

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('statistiche'); // Stato attivo della sezione
  const [activeSubMenu, setActiveSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setActiveSubMenu(!activeSubMenu);
  };

  const products = [
    { id: 1, name: 'Scatola Organizer', img: '/assets/immagini/organizer_cassetti.jpg', price: '€19.99' },
    { id: 2, name: 'Set Organizer', img: '/assets/immagini/scatoleBeige.jpg', price: '€29.99' },
    { id: 3, name: 'Contenitore Salvaspazio', img: '/assets/immagini/scatoleGrigie.jpg', price: '€39.99' },
  ];

  const users = [
    { id: 1, nome: 'Mario Rossi', email: 'mario.rossi@example.com', telefono: '1234567890' },
    { id: 2, nome: 'Giulia Bianchi', email: 'giulia.bianchi@example.com', telefono: '0987654321' },
    { id: 3, nome: 'Luca Verdi', email: 'luca.verdi@example.com', telefono: '1122334455' },
  ];

  return (
    <>
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>

      {/* Navigation Bar */}
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Title>Zencasa</Title>
          <nav style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <StyledButton to="/products">CATALOGO</StyledButton>
            <StyledButton
              as="a"
              href="https://wa.me/393883816904"
              target="_blank"
              rel="noopener noreferrer"
            >
              CONTATTI
            </StyledButton>
          </nav>
        </div>

        {/* Right Section: Home button */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <StyledButton to="/">HOME</StyledButton>
        </div>
      </Header>

      <AdminContainer>
        <Sidebar>
          <SidebarAvatar>
            <img src="https://cdn-icons-png.flaticon.com/512/1054/1054744.png" alt="User Avatar" />
          </SidebarAvatar>
          <SidebarItem onClick={() => setActiveSection('statistiche')}>Home</SidebarItem>
          <SidebarItem onClick={() => setActiveSection('gestisciUtenti')}>Gestisci Utenti</SidebarItem>
          <SidebarItem>Riferimenti Fornitore</SidebarItem>
          <SidebarItem onClick={toggleSubMenu}>
            Prodotti
            <span>{activeSubMenu ? '-' : '+'}</span>
          </SidebarItem>
          {activeSubMenu && (
            <SubMenu>
              <SubMenuItem>
                <img src="/assets/immagini/IT.png" alt="IT" />
                Italia (IT)
              </SubMenuItem>
              <SubMenuItem>
                <img src="/assets/immagini/DE.png" alt="DE" />
                Germania (DE)
              </SubMenuItem>
              <SubMenuItem>
                <img src="/assets/immagini/ES.png" alt="ES" />
                Spagna (ES)
              </SubMenuItem>
              <SubMenuItem>
                <img src="/assets/immagini/FR.png" alt="FR" />
                Francia (FR)
              </SubMenuItem>
            </SubMenu>
          )}
          <SidebarItem>Ordini</SidebarItem>
        </Sidebar>

        <DashboardSection>
          {activeSection === 'statistiche' && (
            <>
              <h2>Statistiche</h2>
              <StatsContainer>
                <StatsCard>
                  <StatIcon>
                    <img src="/assets/immagini/carrello.png" alt="Ordini" />
                  </StatIcon>
                  <div>
                    <h3>ORDINI</h3>
                    <p>120</p>
                  </div>
                </StatsCard>
                <StatsCard>
                  <StatIcon>
                    <img src="/assets/immagini/stella.png" alt="Recensioni" />
                  </StatIcon>
                  <div>
                    <h3>RECENSIONI</h3>
                    <p>54</p>
                  </div>
                </StatsCard>
                <StatsCard>
                  <StatIcon>
                    <img src="/assets/immagini/credito.png" alt="Da Pagare" />
                  </StatIcon>
                  <div>
                    <h3>DA PAGARE</h3>
                    <p>€2,500</p>
                    <small>*STIMA</small>
                  </div>
                </StatsCard>
                <StatsCard>
                  <StatIcon>
                    <img src="/assets/immagini/banconota.png" alt="Pagati" />
                  </StatIcon>
                  <div>
                    <h3>PAGATI</h3>
                    <p>€10,000</p>
                  </div>
                </StatsCard>
              </StatsContainer>

              <h2>I tuoi Prodotti</h2>
              <CarouselContainer>
                <ProductCarousel>
                  {products.map((product) => (
                    <ProductCard key={product.id}>
                      <img src={product.img} alt={product.name} />
                      <h4>{product.name}</h4>
                      <p>{product.price}</p>
                    </ProductCard>
                  ))}
                </ProductCarousel>
              </CarouselContainer>
            </>
          )}

          {activeSection === 'gestisciUtenti' && (
            <>
              <h2>Gestione Utenti</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Nome</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Telefono</th>
                    <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.nome}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.email}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{user.telefono}</td>
                      <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                        <button style={{ marginRight: '10px' }}>Modifica</button>
                        <button>Elimina</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </DashboardSection>
      </AdminContainer>
    </>
  );
};

export default AdminPage;
