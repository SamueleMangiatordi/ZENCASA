import React, { useState } from 'react';
import {
  CatalogContainer,
  Sidebar,
  FilterTitle,
  FilterOption,
  Checkbox,
  MainContent,
  SortContainer,
  ProductGrid,
  ProductCard,
  ProductImage,
  ProductName,
  ProductPrice,
  ProductTag,
  AddToCartButton,
  ColorCircle,
} from '../styles/StyledCatalog';
import {
  Banner,
  Header,
  Title,
  StyledButton,
  Icon,
} from '../styles/StyledComponents';

const ProductsCatalog = () => {
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOption, setSortOption] = useState('I nostri preferiti');

  const products = [
    {
      id: 1,
      name: 'Set 2 scatole per vestiti',
      image: '/assets/immagini/scatoleBeige.jpg',
      price: 30.98,
      color: 'Beige',
      tag: 'Novità',
    },
    {
      id: 2,
      name: 'Set 3 scatole per vestiti',
      image: '/assets/immagini/scatoleGrigie.jpg',
      price: 38.90,
      color: 'Grigio',
      tag: 'Novità',
    },
    {
      id: 3,
      name: 'Set 4 contenitori sottoletto',
      image: '/assets/immagini/contenitoriSottoletto.jpg',
      price: 49,
      color: 'Bianco',
      tag: 'Novità',
    },
  ];

  const priceRanges = [
    { label: 'Fino a 20 euro', maxPrice: 20 },
    { label: 'Fino a 50 euro', maxPrice: 50 },
    { label: 'Fino a 100 euro', maxPrice: 100 },
  ];

  const colors = [
    { name: 'Beige', color: '#f5deb3' },
    { name: 'Grigio', color: '#808080' },
    { name: 'Bianco', color: '#ffffff' },
  ];

  const handlePriceRangeChange = (maxPrice) => {
    setSelectedPriceRange(maxPrice === selectedPriceRange ? null : maxPrice);
  };

  const handleColorChange = (color) => {
    setSelectedColors((prevSelected) =>
      prevSelected.includes(color)
        ? prevSelected.filter((c) => c !== color)
        : [...prevSelected, color]
    );
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ item }) => item);
  };

  let filteredProducts = products.filter((product) => {
    const matchesPrice =
      selectedPriceRange !== null ? product.price <= selectedPriceRange : true;
    const matchesColor = selectedColors.length
      ? selectedColors.includes(product.color)
      : true;

    return matchesPrice && matchesColor;
  });

  if (sortOption === 'Prezzo crescente') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'Prezzo decrescente') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'I nostri preferiti') {
    filteredProducts = shuffleArray(filteredProducts);
  }

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

      <CatalogContainer>
        <Sidebar>
          <FilterTitle>Prezzo</FilterTitle>
          {priceRanges.map((range, index) => (
            <FilterOption key={index}>
              <Checkbox
                type="checkbox"
                checked={selectedPriceRange === range.maxPrice}
                onChange={() => handlePriceRangeChange(range.maxPrice)}
              />
              {range.label}
            </FilterOption>
          ))}

          <FilterTitle>Colore</FilterTitle>
          {colors.map((color, index) => (
            <FilterOption key={index}>
              <ColorCircle color={color.color} />
              <Checkbox
                type="checkbox"
                checked={selectedColors.includes(color.name)}
                onChange={() => handleColorChange(color.name)}
              />
              {color.name}
            </FilterOption>
          ))}
        </Sidebar>
        <MainContent>
          <SortContainer>
            <span>Ordina:</span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="I nostri preferiti">I nostri preferiti</option>
              <option value="Prezzo crescente">Prezzo crescente</option>
              <option value="Prezzo decrescente">Prezzo decrescente</option>
            </select>
            <span>{filteredProducts.length} Risultati</span>
          </SortContainer>

          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id}>
                <ProductImage src={product.image} alt={product.name} />
                <ProductTag>{product.tag}</ProductTag>
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{`€${product.price.toFixed(2)}`}</ProductPrice>
                <AddToCartButton>Aggiungi al carrello</AddToCartButton>
              </ProductCard>
            ))}
          </ProductGrid>
        </MainContent>
      </CatalogContainer>
    </>
  );
};

export default ProductsCatalog;
