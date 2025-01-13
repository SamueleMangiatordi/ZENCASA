import React, { useState, useEffect } from 'react';
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
import {PRODUCTS_URL} from '../data/api'; // Importa la funzione getProducts
import { StyledLink } from '../styles/StyledCatalog'; // Importa StyledLink


const ProductsCatalog = () => {
  const [products, setProducts] = useState([]); // Stato per i prodotti recuperati
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(null); // Stato per eventuali errori
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOption, setSortOption] = useState('I nostri preferiti');

  // Recupera i prodotti da Strapi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${PRODUCTS_URL}?populate=*`); // API di Strapi
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.data.map((product) => {
          const imageFormats = product.immagine_prodotto?.[0]?.formats || {};
          const imageUrl = imageFormats.medium?.url || imageFormats.large?.url || imageFormats.small?.url || product.immagine_prodotto?.[0]?.url;
  
          return {
            id: product.id,
            documentId: product.documentId,
            name: product.nome_prodotto,
            image: imageUrl ? `http://localhost:1337${imageUrl}` : '/default-image.jpg',
            price: product.prezzo_unitario,
            //tag: product.attributes.tag || 'Novità',
          };
        }));
        setLoading(false);
      } catch (err) {
        setError('Impossibile recuperare i dati');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  // Filtraggio dei prodotti
  let filteredProducts = products.filter((product) => {
    const matchesPrice =
      selectedPriceRange !== null ? product.price <= selectedPriceRange : true;
    const matchesColor = selectedColors.length
      ? selectedColors.includes(product.color)
      : true;

    return matchesPrice && matchesColor;
  });

  // Ordinamento dei prodotti
  if (sortOption === 'Prezzo crescente') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'Prezzo decrescente') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'I nostri preferiti') {
    filteredProducts = shuffleArray(filteredProducts);
  }

  // Stato di caricamento ed errori
  if (loading) {
    return <p>Caricamento dei prodotti...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1% 5%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Title>Zencasa</Title>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <StyledButton to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Icon>👤</Icon>
          </StyledButton>
          <StyledButton to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
            {products.map((product) => (
              <ProductCard key={product.id}>
                {/* Link all'immagine del prodotto */}
                <StyledLink to={`/products/${product.documentId}`}>
                  <ProductImage src={product.image} alt={product.name} />
                </StyledLink>

                {/* Link al nome del prodotto */}
                <StyledLink to={`/products/${product.documentId}`}>
                  <ProductName>{product.name}</ProductName>
                </StyledLink>

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
