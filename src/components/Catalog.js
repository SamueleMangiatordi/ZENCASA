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

const ProductsCatalog = ({ onAddToCart }) => {  // Riceve la funzione onAddToCart
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
    <CatalogContainer>
      <Sidebar>
        <FilterTitle>Prezzo</FilterTitle>
        {/* Filtri e ordinamento */}
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
              <AddToCartButton onClick={() => onAddToCart(product)}>
                Aggiungi al carrello
              </AddToCartButton>
            </ProductCard>
          ))}
        </ProductGrid>
      </MainContent>
    </CatalogContainer>
  );
};

export default ProductsCatalog;
