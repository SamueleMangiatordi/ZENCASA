import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 1rem 2rem;
`;

const Main = styled.main`
  padding: 2rem;
`;

const TitleBlock = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const Image = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 2rem auto;
`;

const ProductSection = styled.section`
  padding: 2rem;
  background-color: #f4f4f4;
`;

const Product = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  margin-top: 1rem;
`;

const Home = () => {
  return (
    <Container>
      <Header>
        <div>TITOLO</div>
        <nav>
          <a href="/products">PRODOTTI</a>
          <a href="/login">LOGIN</a>
        </nav>
      </Header>
      <Main>
        <TitleBlock>
          <Title>TITOLO</Title>
          <Description>Descrizione breve del sito o del prodotto principale.</Description>
          <Image />
        </TitleBlock>
        <ProductSection>
          <Product>Prodotto 1</Product>
          <Product>Prodotto 2</Product>
          <Product>Prodotto 3</Product>
        </ProductSection>
      </Main>
    </Container>
  );
};

export default Home;
