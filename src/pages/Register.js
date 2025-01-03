import React, { useState } from 'react';
import {
  RegisterContainer,
  RegisterForm,
  RegisterTitle,
  RegisterLabel,
  RegisterInput,
  RegisterSelect,
  RegisterCheckbox,
  RegisterButton,
  SectionTitle,
} from '../styles/StyledRegisterComponents';

const italianProvinces = [
  'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno', 'Asti', 'Avellino',
  'Bari', 'Barletta-Andria-Trani', 'Belluno', 'Benevento', 'Bergamo', 'Biella', 'Bologna',
  'Bolzano', 'Brescia', 'Brindisi', 'Cagliari', 'Caltanissetta', 'Campobasso', 'Caserta',
  'Catania', 'Catanzaro', 'Chieti', 'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo',
  'Enna', 'Fermo', 'Ferrara', 'Firenze', 'Foggia', 'Forlì-Cesena', 'Frosinone', 'Genova',
  'Gorizia', 'Grosseto', 'Imperia', 'Isernia', 'L’Aquila', 'La Spezia', 'Latina', 'Lecce',
  'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata', 'Mantova', 'Massa-Carrara', 'Matera',
  'Messina', 'Milano', 'Modena', 'Monza e della Brianza', 'Napoli', 'Novara', 'Nuoro',
  'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia', 'Pesaro e Urbino', 'Pescara',
  'Piacenza', 'Pisa', 'Pistoia', 'Pordenone', 'Potenza', 'Prato', 'Ragusa', 'Ravenna',
  'Reggio Calabria', 'Reggio Emilia', 'Rieti', 'Rimini', 'Roma', 'Rovigo', 'Salerno',
  'Sassari', 'Savona', 'Siena', 'Siracusa', 'Sondrio', 'Sud Sardegna', 'Taranto', 'Teramo',
  'Terni', 'Torino', 'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia',
  'Verbano-Cusio-Ossola', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo'
];

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    addressDetails: '',
    postalCode: '',
    city: '',
    province: 'Bari', // Provincia di default
    phone: '',
    saveData: false,
    receiveSMS: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dati di registrazione:', formData);
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSubmit}>
        <RegisterTitle>Zencasaa</RegisterTitle>

        <SectionTitle>Contatti</SectionTitle>
        <RegisterLabel>Email o numero di telefono cellulare</RegisterLabel>
        <RegisterInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <RegisterCheckbox>
          <input
            type="checkbox"
            name="receiveEmail"
            checked={formData.receiveEmail}
            onChange={handleChange}
          />
          <span>Inviami email con notizie e offerte</span>
        </RegisterCheckbox>

        <SectionTitle>Consegna</SectionTitle>
        <RegisterLabel>Paese / Regione</RegisterLabel>
        <RegisterSelect name="country" disabled>
          <option value="Italy">Italia</option>
        </RegisterSelect>

        <RegisterLabel>Nome</RegisterLabel>
        <RegisterInput
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <RegisterLabel>Cognome</RegisterLabel>
        <RegisterInput
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <RegisterLabel>Indirizzo</RegisterLabel>
        <RegisterInput
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <RegisterLabel>Interno, scala, ecc. (facoltativo)</RegisterLabel>
        <RegisterInput
          type="text"
          name="addressDetails"
          value={formData.addressDetails}
          onChange={handleChange}
        />

        <RegisterLabel>CAP</RegisterLabel>
        <RegisterInput
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          required
        />

        <RegisterLabel>Città</RegisterLabel>
        <RegisterInput
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
        />

        <RegisterLabel>Provincia</RegisterLabel>
        <RegisterSelect
          name="province"
          value={formData.province}
          onChange={handleChange}
        >
          {italianProvinces.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </RegisterSelect>

        <RegisterLabel>Telefono</RegisterLabel>
        <RegisterInput
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <RegisterCheckbox>
          <input
            type="checkbox"
            name="saveData"
            checked={formData.saveData}
            onChange={handleChange}
          />
          <span>Salva questi dati per la prossima volta</span>
        </RegisterCheckbox>

        <RegisterCheckbox>
          <input
            type="checkbox"
            name="receiveSMS"
            checked={formData.receiveSMS}
            onChange={handleChange}
          />
          <span>Inviami SMS con notizie e offerte</span>
        </RegisterCheckbox>

        <RegisterButton type="submit">Registrati</RegisterButton>
      </RegisterForm>
    </RegisterContainer>
  );
};

export default Register;
