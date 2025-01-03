import React, { useState, useEffect } from "react";
import { 
  Banner, 
  Header, 
  Title, 
  StyledButton, 
  HeroSection, 
  HeroImageContainer, 
  HeroContent, 
  CountdownContainer, 
  DiscountTag, 
  MainHeadline, 
  CTAButton,
  CTAButton2, 
  RatingContainer, 
  Star, 
  BrandStory, 
  StoryButton, 
  FAQSection, 
  NewsletterSignup, 
  ContactInfo,
  BenefitsSection,
  BenefitItem,
  Icon,
  AssemblySection, 
  AssemblyStep, 
  StepContent, 
  CircularImage,
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
  ContactInfo2,
  WhatsAppButton
} from "../styles/StyledComponents";

const Home = () => {

  const [email, setEmail] = useState('');

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

  const calculateTimeLeft = (targetDate) => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const startNewTimer = () => {
      const newTargetDate = new Date();
      newTargetDate.setMinutes(newTargetDate.getMinutes() + 15); // Nuovo timer di 15 minuti
      localStorage.setItem("countdownTargetDate", newTargetDate.toISOString());
      return newTargetDate;
    };

    // Ottieni la data target dal localStorage o impostane una nuova
    let targetDate = localStorage.getItem("countdownTargetDate");

    if (!targetDate) {
      // Se non esiste una data salvata, crea un nuovo timer
      targetDate = startNewTimer();
    } else {
      // Converti la data salvata in un oggetto Date
      targetDate = new Date(targetDate);
    }

    // Calcola il tempo iniziale
    setTimeLeft(calculateTimeLeft(targetDate));

    // Aggiorna il timer ogni secondo
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        // Il timer è scaduto: avvia un nuovo timer
        targetDate = startNewTimer();
      }

      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer); // Cleanup per evitare memory leaks
  }, []);

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
    <StyledButton to="/login" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Icon>👤</Icon>
    </StyledButton>
    <StyledButton to="/cart" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Icon>🛍️</Icon>
    </StyledButton>
  </div>
</Header>

<WhatsAppButton
        href="https://wa.me/393883816904"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Icon" />
      </WhatsAppButton>

      <HeroSection>
        <HeroImageContainer>
          <img 
            src="/HeroImage.png" 
            alt="Hero Product" 
            style={{ width: "100%", height: "auto" }} 
          />
        </HeroImageContainer>
        <HeroContent>
          <CountdownContainer>
            <div>{String(timeLeft.days).padStart(2, "0")}</div>
            <div>{String(timeLeft.hours).padStart(2, "0")}</div>
            <div>{String(timeLeft.minutes).padStart(2, "0")}</div>
            <div>{String(timeLeft.seconds).padStart(2, "0")}</div>
          </CountdownContainer>
          <DiscountTag>🔥 Fino al 50% di Sconto</DiscountTag>
          <MainHeadline>ZenCasa | Scatole per Armadio Rigide con Cerniera da 66L, Set da 3 Contenitori per Armadio Salvaspazio, Organizer Armadio con Struttura in Metallo Pieghevole con Maniglie Rinforzate </MainHeadline>
          <CTAButton>Ordina Ora!</CTAButton>
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
      <img src="/passo1.jpeg" alt="Step 1" />
    </CircularImage2>
  </AssemblyStep>


<AssemblyStep>
    <CircularImageContainer>
      <img src="/passo2.jpeg" alt="Step 2" />
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
    <img src="/passo3.jpeg" alt="Step 3" />
  </CircularImage2>
  
</AssemblyStep>

<AssemblyStep>
  <CircularImageContainer>
    <img src="/passo4.jpeg" alt="Step 4" />
  </CircularImageContainer>
  <StepContent>
    <h3>Step 4: Fatto!</h3>
    <p>La tua scatola è pronta all'uso!</p>
  </StepContent>
</AssemblyStep>
<CTAButton2>Ordina Subito!</CTAButton2>
</AssemblySection>

<BrandStoryContainer>
  <BrandStoryText>
    <h2>LA NOSTRA STORIA</h2>
    <p>
      Benvenuti in Zencasa, dove crediamo che ordinare il vostro spazio possa liberare la mente. Fondata nel 2020, la nostra missione è trasformare ogni casa in un santuario di serenità attraverso soluzioni innovative e sostenibili. Ogni prodotto è progettato per aumentare l'efficienza e l'armonia domestica, aiutandovi a riconquistare il controllo del vostro ambiente e, di conseguenza, della vostra vita. Unitevi al movimento Zencasa e scoprite come un ambiente più ordinato possa portare a una vita più felice e centrata.
    </p>
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <StoryButton onClick={() => window.location.href = '/BrandStory'}>
        Scopri di più
      </StoryButton>
    </div>
  </BrandStoryText>
  <BrandStoryImageContainer>
    <img src="/BrandStory.png" alt="Brand Story" />
  </BrandStoryImageContainer>
  
</BrandStoryContainer>

<div>
      {/* Altri componenti della homepage */}

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
          <MoreButton>Altre Domande?</MoreButton>
        </FAQContent>
        <FAQImage src="/FAQImage.png" alt="FAQ" />
      </FAQContainer>

    </div>

    <div>
    
      <ContactSection>
        <ContactInfo>
        <ContactTitle>ZENCASA</ContactTitle>
    <ContactText>Ordina il Tuo Spazio<br />Libera la Tua Mente</ContactText>
    <div>
      <p><strong>Contatti:</strong></p>
      <p>📧 Email: <a href="mailto:info@zencasaitalia.it">info@zencasaitalia.it</a></p>
      <p>📞 Telefono: +39 123 456 789</p>
      <p>🕒 Orari di Supporto: Lun-Ven 9:00 - 18:00</p>
    </div>
        </ContactInfo>

        <StayConnected>
          <StayConnectedTitle>Rimaniamo in Contatto</StayConnectedTitle>
          <StayConnectedText>
            Niente mail fastidiose, promesso! Solo consigli & codici sconto!<br />
            Inserisci la tua mail, ti invieremo subito un <strong>Coupon dal valore di 5 Euro</strong>.
          </StayConnectedText>
          <EmailForm onSubmit={handleSubmit}>
            <EmailInput
              type="email"
              placeholder="Inserisci la tua mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <SubmitButton type="submit">→</SubmitButton>
          </EmailForm>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Iscrivendoti alla nostra newsletter accetti la nostra politica sulla privacy e riceverai comunicazioni commerciali.
          </p>
        </StayConnected>
      </ContactSection>

      {/* Altri componenti della homepage */}
    </div>

    </>
  );
};

export default Home;
