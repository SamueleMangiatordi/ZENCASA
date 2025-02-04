import React, { useState } from "react";
import {
  Banner,
  Header,
  Title,
  StyledButton,
  HeroSection,
  HeroImageContainer,
  HeroContent,
  DiscountTag,
  MainHeadline,
  CTAButton,
  CTAButton2,
  RatingContainer,
  Star,
  BenefitsSection,
  BenefitItem,
  Icon,
  AssemblySection,
  AssemblyStep,
  StepContent,
  CircularImage2,
  CircularImageContainer,
  StepContent2,
  BrandStoryContainer,
  BrandStoryText,
  BrandStoryImageContainer,
  FAQContainer,
  MoreButton,
  FAQImage,
  Answer,
  Question,
  FAQTitle,
  FAQContent,
  ContactSection,
  SubmitButton,
  EmailInput,
  EmailForm,
  StayConnectedText,
  StayConnectedTitle,
  StayConnected,
  ContactText,
  ContactTitle,
  ContactInfo,
  WhatsAppButton,
  StoryButton
} from "../styles/StyledComponents";
import { useAuth } from '../data/authContext';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [email, setEmail] = useState('');
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // Stato per la gestione del pop-up
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `mailto:info@zencasaitalia.it?subject=Iscrizione Newsletter&body=Email: ${email}`;
  };

  const faqData = [
    {
      question: 'Gli organizer si adattano a spazi standard negli armadi?',
      answer: 'Sì, i nostri organizer sono progettati per adattarsi agli spazi standard degli armadi. Sono ideali sia per scaffali che per spazi ristretti.',
    },
    {
      question: 'Di che Materiale Sono le Vostre Scatole?',
      answer: 'Le nostre scatole sono realizzate con materiali sostenibili, come plastica riciclata e tessuti resistenti.',
    },
    {
      question: 'In Quanto Tempo riceverò il Mio Ordine?',
      answer: 'I nostri ordini vengono spediti entro 2-3 giorni lavorativi e consegnati entro 5 giorni.',
    },
    {
      question: 'Gli organizer sono impilabili o pieghevoli?',
      answer: 'Sì, offriamo organizer sia impilabili che pieghevoli, per massimizzare lo spazio disponibile.',
    },
    {
      question: 'Cosa succede se non Sono Soddisfatta?',
      answer: 'Offriamo una garanzia di rimborso entro 30 giorni dall’acquisto.',
    },
  ];

  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  return (
    <>
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1% 5%" }}>
        {/* Left Section: Zencasa Title and Navigation Links */}
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

        {/* Right Section: Login and Cart Icons */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <StyledButton
            onClick={() => {
              if (isAuthenticated) {
                if (role === 'Admin') {
                  setTimeout(() => navigate("/admin"), 0);
                } else if (role === 'assistenzaClienti') {
                  setTimeout(() => navigate("/service"), 0);
                } else {
                  setTimeout(() => navigate("/user"), 0);
                }
              } else {
                setTimeout(() => navigate("/login"), 0);
              }
            }}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <Icon>👤</Icon>
          </StyledButton>

          <StyledButton
            onClick={() => {
              if (isAuthenticated) {
                setTimeout(() => navigate("/cart"), 0);
              } else {
                setTimeout(() => navigate("/login"), 0);
              }
            }}
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <Icon>🛍️</Icon>
          </StyledButton>
        </div>
      </Header>

      <WhatsAppButton
        href="https://wa.me/393883816904"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp Icon"
        />
      </WhatsAppButton>

      <HeroSection>
        <HeroImageContainer>
          <img
            // Nuova immagine hero dal link Amazon
            src="/assets/immagini/HeroImage.png"
            alt="Hero Product"
            style={{ width: "100%", height: "auto" }}
          />
        </HeroImageContainer>
        <HeroContent>
          <DiscountTag>🔥 Fino al 50% di Sconto</DiscountTag>
          <MainHeadline>
            ZenCasa | Scatole per Armadio Rigide con Cerniera da 66L, Set da 3 Contenitori per Armadio Salvaspazio, Organizer Armadio con Struttura in Metallo Pieghevole con Maniglie Rinforzate
          </MainHeadline>
          <CTAButton onClick={() => window.location.href = "/products"}>
            Ordina Ora!
          </CTAButton>

          <RatingContainer>
            <Star>⭐</Star><Star>⭐</Star><Star>⭐</Star><Star>⭐</Star><Star>⭐</Star>
            <span>1000+ Clienti Soddisfatti</span>
          </RatingContainer>
        </HeroContent>
      </HeroSection>

      <BenefitsSection>
        <BenefitItem>
          <Icon>🚚</Icon>
          <h3>Spedizione Gratuita</h3>
          <p>su ordini superiori a 50 euro</p>
        </BenefitItem>
        <BenefitItem>
          <Icon>💲</Icon>
          <h3>Garanzia Soddisfatto o Rimborsato</h3>
          <p>Hai 30 giorni per provarci</p>
        </BenefitItem>
        <BenefitItem>
          <Icon>📦</Icon>
          <h3>Consegna in 48h</h3>
          <p>Ricevi l'ordine entro 2 giorni lavorativi</p>
        </BenefitItem>
        <BenefitItem>
          <Icon>🎧</Icon>
          <h3>Supporto Clienti Whatsapp</h3>
          <p>Siamo disponibili per ogni tua domanda</p>
        </BenefitItem>
      </BenefitsSection>

      <AssemblySection>
        <h2>Scopri le Soluzioni Salvaspazio per il tuo Cambio Stagione</h2>
        <AssemblyStep>
          <StepContent>
            <h3>Step 1: Spacchetta il Set</h3>
            <p>Estrarre l’Organizer dalla confezione in plastica e aprire la cerniera dalla parte superiore.</p>
          </StepContent>
          <CircularImage2>
            <img src="/assets/immagini/passo1.jpeg" alt="Step 1" />
          </CircularImage2>
        </AssemblyStep>

        <AssemblyStep>
          <CircularImageContainer>
            <img src="/assets/immagini/passo2.jpeg" alt="Step 2" />
          </CircularImageContainer>
          <StepContent2>
            <h3>Step 2: Apri la Scatola</h3>
            <p>Sollevare la parte superiore dell’Organizer.</p>
          </StepContent2>
        </AssemblyStep>

        <AssemblyStep>
          <StepContent>
            <h3>Step 3: Sistema il Supporto in Metallo</h3>
            <p>
              <strong>NB:</strong> Potresti trovare i supporti sganciati dalla struttura superiore.
              Inserisci la parte superiore del supporto in metallo nell’apposito foro.
            </p>
          </StepContent>
          <CircularImage2>
            <img src="/assets/immagini/passo3.jpeg" alt="Step 3" />
          </CircularImage2>
        </AssemblyStep>

        <AssemblyStep>
          <CircularImageContainer>
            <img src="/assets/immagini/passo4.jpeg" alt="Step 4" />
          </CircularImageContainer>
          <StepContent>
            <h3>Step 4: Fatto!</h3>
            <p>La tua scatola è pronta all'uso!</p>
          </StepContent>
        </AssemblyStep>
        <CTAButton2 onClick={() => window.location.href = "/products"}>
          Ordina Ora!
        </CTAButton2>
      </AssemblySection>

      <BrandStoryContainer>
        <BrandStoryText>
          <h2>LA NOSTRA STORIA</h2>
          <p>
            Benvenuti in Zencasa, dove crediamo che ordinare il vostro spazio possa liberare la mente. Fondata nel 2020, la nostra missione è trasformare ogni casa in un santuario di serenità attraverso soluzioni innovative e sostenibili. Ogni prodotto è progettato per aumentare l'efficienza e l'armonia domestica, aiutandovi a riconquistare il controllo del vostro ambiente e, di conseguenza, della vostra vita. Unitevi al movimento Zencasa e scoprite come un ambiente più ordinato possa portare a una vita più felice e centrata.
          </p>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <StoryButton onClick={() => setIsPopupOpen(true)}>
              Scopri di più
            </StoryButton>
          </div>
        </BrandStoryText>
        <BrandStoryImageContainer>
          <img src="/assets/immagini/BrandStory.png" alt="Brand Story" />
        </BrandStoryImageContainer>
      </BrandStoryContainer>

      {/* Pop-up scorrevole per la Brand Story */}
      {isPopupOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "80%",
              maxWidth: "800px",
              padding: "20px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
              overflow: "hidden",
              position: "relative"
            }}
          >
            {/* Testo sulla sinistra */}
            <div style={{ flex: 1, padding: "20px" }}>
              <h2>La Storia di Zencasa</h2>
              <p>
                Nata nel 2020, Zencasa è frutto della passione di un team di giovani 
                professionisti che credono fortemente nell'importanza di un ambiente 
                domestico ordinato per migliorare la qualità della vita. Siamo partiti da 
                un'idea semplice: trasformare ogni stanza in un luogo di pace, armonia e 
                praticità. <br /><br />
                Grazie a un'attenta ricerca di materiali eco-friendly e a un costante 
                impegno nell'innovazione, ci siamo specializzati in soluzioni di 
                organizzazione domestica, adatte a soddisfare ogni esigenza di spazio. 
                Ogni articolo firmato Zencasa è realizzato con cura, pensando alle necessità 
                di ogni giorno e all'importanza di un ambiente privo di disordine. <br /><br />
                Con il tempo, la nostra gamma di prodotti si è ampliata, e oggi collaboriamo 
                con designer e professionisti del settore per creare soluzioni che uniscano 
                stile e funzionalità, senza mai perdere di vista la sostenibilità. Siamo 
                convinti che un ambiente ordinato possa ridurre lo stress, favorire la 
                concentrazione e permettere di godere appieno dei momenti trascorsi in casa. <br /><br />
                Oggi, Zencasa è un punto di riferimento per chi desidera vivere in un 
                ambiente più funzionale e rilassante. Ogni nostro prodotto è pensato per 
                aiutarti a ottimizzare lo spazio, migliorare la tua routine e liberare la 
                mente dal superfluo. Unisciti a noi e scopri come l’organizzazione può 
                davvero portare a una vita più serena e felice.
              </p>
            </div>

            {/* Immagine sulla destra */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <img
                src="/assets/immagini/DE.png"
                alt="Brand Story"
                style={{ width: "100%", borderRadius: "10px" }}
              />
            </div>

            {/* Bottone di chiusura */}
            <button
              onClick={() => setIsPopupOpen(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <div>
        {/* FAQ Section */}
        <FAQContainer>
          <FAQContent>
            <FAQTitle>Hai Domande? Noi rispondiamo!</FAQTitle>
            {faqData.map((faq, index) => (
              <div key={index}>
                <Question onClick={() => toggleAnswer(index)}>
                  <span>{faq.question}</span>
                  <span>{openQuestionIndex === index ? '-' : '>'}</span>
                </Question>
                {openQuestionIndex === index && <Answer>{faq.answer}</Answer>}
              </div>
            ))}
            <MoreButton as="a" href="https://wa.me/393883816904" target="_blank" rel="noopener noreferrer">
            Altre Domande?
          </MoreButton>
          </FAQContent>
          <FAQImage src="/assets/immagini/ES.png" alt="FAQ" />
        </FAQContainer>
      </div>

      <div>
        <ContactSection>
          <ContactInfo>
            <ContactTitle>ZENCASA</ContactTitle>
            <ContactText>
              Ordina il Tuo Spazio<br />
              Libera la Tua Mente
            </ContactText>
            <div>
              <p><strong>Contatti:</strong></p>
              <p>
                📧 Email: <a href="mailto:info@zencasaitalia.it">info@zencasaitalia.it</a>
              </p>
              <p>📞 Telefono: +39 388 381 6904</p>
              <p>🕒 Orari di Supporto: Lun-Ven 9:00 - 18:00</p>
            </div>
          </ContactInfo>

        </ContactSection>
      </div>
    </>
  );
};

export default Home;
