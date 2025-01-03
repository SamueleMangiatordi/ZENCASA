import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import {
  CheckoutContainer,
  MainContent,
  LeftSection,
  RightSection,
  Title2,
  LoginSection,
  LoginButton,
  CheckoutForm,
  FormField,
  Input,
  Select,
  CheckboxLabel,
  SummarySection,
  SummaryTitle,
  SummaryItem,
  TotalPrice,
  ArticlesSection,
  ArticlesList,
  ArticleItem,
  ArticleDetails,
  InfoSection,
  ProceedButton,
} from "../styles/StyledCheckout";
import {
    Banner,
    Header,
    Title,
    StyledButton,
    Icon,
  } from '../styles/StyledComponents';
  
const Checkout = ({ cartItems = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    address1: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "Italia",
    phone: "",
    email: "",
    newsletter: false,
  });

  const navigate = useNavigate(); // Hook per la navigazione

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Reindirizza alla pagina di login
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 2.99;
  const total = subtotal + shipping;

  return (
<>
        <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>
              <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1% 5%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <Title>Zencasa</Title>
                  <nav style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <StyledButton to="/">HOME</StyledButton>
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
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <StyledButton to="/login" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Icon>👤</Icon>
                  </StyledButton>
                  <StyledButton to="/cart" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Icon>🛍️</Icon>
                  </StyledButton>
                </div>
              </Header>


    <CheckoutContainer>
      <MainContent>
        {/* Sezione sinistra: Dati di spedizione */}
        <LeftSection>
          <Title2>Dettagli Spedizione</Title2>

          <LoginSection>
            <span>Hai già un profilo? Accedi per velocizzare l'acquisto.</span>
            <LoginButton onClick={handleLoginRedirect}>Accedi</LoginButton>
          </LoginSection>

          <CheckoutForm>
            <FormField>
              <label>Nome *</label>
              <Input
                type="text"
                name="name"
                placeholder="Inserisci il tuo nome"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormField>
            <FormField>
              <label>Cognome *</label>
              <Input
                type="text"
                name="surname"
                placeholder="Inserisci il tuo cognome"
                value={formData.surname}
                onChange={handleInputChange}
                required
              />
            </FormField>
            <FormField>
              <label>Indirizzo *</label>
              <Input
                type="text"
                name="address1"
                placeholder="Inserire l'indirizzo"
                value={formData.address1}
                onChange={handleInputChange}
                required
              />
            </FormField>
            <FormField>
              <label>Indirizzo 2</label>
              <Input
                type="text"
                name="address2"
                placeholder="Interno, scala, ecc. (facoltativo)"
                value={formData.address2}
                onChange={handleInputChange}
              />
            </FormField>
            <FormField>
              <label>Città *</label>
              <Input
                type="text"
                name="city"
                placeholder="Inserisci la città"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </FormField>
            <FormField>
              <label>CAP *</label>
              <Input
                type="text"
                name="postalCode"
                placeholder="Inserisci il codice postale"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </FormField>
            <FormField>
              <label>Paese *</label>
              <Select disabled>
                <option value="Italia">Italia</option>
              </Select>
            </FormField>
            <FormField>
              <label>Numero di Telefono *</label>
              <Input
                type="text"
                name="phone"
                placeholder="Inserisci il tuo numero di telefono"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </FormField>
            <FormField>
              <label>Email *</label>
              <Input
                type="email"
                name="email"
                placeholder="Inserisci il tuo indirizzo e-mail"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormField>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
              />
              Acconsento all’iscrizione alla Newsletter per ricevere promozioni e aggiornamenti.
            </CheckboxLabel>
          </CheckoutForm>

          <ProceedButton>Avanti: Metodo di Spedizione</ProceedButton>
        </LeftSection>

        {/* Sezione destra: Riepilogo ordine */}
        <RightSection>
          <SummarySection>
            <SummaryTitle>Riepilogo dell'ordine</SummaryTitle>
            <SummaryItem>
              <span>Subtotale</span>
              <span>€{subtotal.toFixed(2)}</span>
            </SummaryItem>
            <SummaryItem>
              <span>Spedizione</span>
              <span>{shipping === 0 ? "GRATUITA" : `€${shipping.toFixed(2)}`}</span>
            </SummaryItem>
            <TotalPrice>
              <span>TOTALE</span>
              <span>€{total.toFixed(2)}</span>
            </TotalPrice>
          </SummarySection>

          <ArticlesSection>
            <h3>{cartItems.length} ARTICOLI</h3>
            <ArticlesList>
              {cartItems.map((item) => (
                <ArticleItem key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <ArticleDetails>
                    <p>{item.name}</p>
                    <p>Quantità: {item.quantity}</p>
                    <p>€{item.price.toFixed(2)}</p>
                  </ArticleDetails>
                </ArticleItem>
              ))}
            </ArticlesList>
          </ArticlesSection>

          <InfoSection>
            <h3>Consegna</h3>
            <p>Clicca e Ritira Gratuito e pronto in 2 ore. L'ordine viene conservato entro 7 giorni.</p>
            <p>Spedizione Standard gratuita per ordini superiori a 75€.</p>
            <p>Spedizione Express (1-3 giorni) gratuita per ordini superiori a 100€.</p>

            <h3>Resi e Cambi</h3>
            <p>Gratuiti ed estesi fino al 31/01/25 online e nei negozi aderenti.</p>

            <h3>Hai bisogno di aiuto?</h3>
            <p>Numero Verde 800 124823 Lun - Ven 8:00 - 18:00. Le chiamate effettuate in Italia da linee fisse sono gratuite.</p>
          </InfoSection>
        </RightSection>
      </MainContent>
    </CheckoutContainer>
    </>
  );
};

export default Checkout;
