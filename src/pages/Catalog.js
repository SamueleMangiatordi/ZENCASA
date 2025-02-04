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
  AddToCartButton, // Stile per pulsanti
} from '../styles/StyledCatalog';
import {
  Banner,
  Header,
  Title,
  StyledButton, // Usa questo per i link nella navbar
  Icon,
} from '../styles/StyledComponents';
import { PRODUCTS_URL } from '../data/api'; // URL delle API
import { useNavigate } from 'react-router-dom';

const ProductsCatalog = () => {
  const [products, setProducts] = useState([]); // Stato per i prodotti
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(null); // Stato per eventuali errori
  const [selectedPriceRange, setSelectedPriceRange] = useState(null); // Filtro prezzo
  const [sortOption, setSortOption] = useState('I nostri preferiti'); // Ordinamento
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate(); // Per navigare tra le pagine

  // Recupera i prodotti da Strapi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${PRODUCTS_URL}?populate=*`);
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }
        const data = await response.json();

        setProducts(
          data.data.map((product) => ({
            id: product.id,
            documentId: product.documentId,
            name: product.nome_prodotto,
            image:
              product.immagine_prodotto?.[0]?.formats?.medium?.url ||
              product.immagine_prodotto?.[0]?.formats?.small?.url,
            description: product.descrizione,
            price: product.prezzo_unitario,
          }))
        );
        setLoading(false);
      } catch (err) {
        setError('Impossibile recuperare i dati');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Funzione per aggiungere al carrello
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const handlePriceRangeChange = (maxPrice) => {
    setSelectedPriceRange(maxPrice === selectedPriceRange ? null : maxPrice);
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
    return matchesPrice;
  });

  // Ordinamento dei prodotti
  if (sortOption === 'Prezzo crescente') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'Prezzo decrescente') {
    filteredProducts.sort((a, b) => b.price - a.price);
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
      {/* Banner e Navigation Bar */}
      <Banner>Spedizione gratuita per ordini superiori a 50 euro</Banner>
      <Header style={{ display: 'flex', justifyContent: 'space-between', padding: '1% 5%' }}>
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

      {/* Catalogo */}
      <CatalogContainer>
        {/* Filtri Laterali */}
        <Sidebar>
        <FilterTitle>Prezzo</FilterTitle>
        {[
          { label: 'Fino a 20 euro', maxPrice: 20 },
          { label: 'Fino a 30 euro', maxPrice: 30 },
          { label: 'Fino a 40 euro', maxPrice: 40 },
          { label: 'Più di 50 euro', maxPrice: 51 }, // Valore speciale per prodotti sopra 50€
        ].map((range, index) => (
          <FilterOption key={index}>
            <Checkbox
              type="checkbox"
              checked={selectedPriceRange === range.maxPrice}
              onChange={() => handlePriceRangeChange(range.maxPrice)}
            />
            {range.label}
          </FilterOption>
        ))}
      </Sidebar>



        {/* Sezione Principale */}
        <MainContent>
          <SortContainer>
            <span>Ordina:</span>
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="Prezzo crescente">Prezzo crescente</option>
              <option value="Prezzo decrescente">Prezzo decrescente</option>
            </select>
            <span>{filteredProducts.length} Risultati</span>
          </SortContainer>

          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id}>
                <ProductImage
                  src={`http://localhost:1337${product.image}`}
                  alt={product.name}
                />
                <ProductName>{product.name}</ProductName>
                <ProductPrice>{`€${product.price.toFixed(2)}`}</ProductPrice>


                <AddToCartButton onClick={() => addToCart(product)}>
                Aggiungi al carrello
              </AddToCartButton>
              </ProductCard>
            ))}
          </ProductGrid>
        </MainContent>
      </CatalogContainer>
    </>
  );
};

export default ProductsCatalog;
