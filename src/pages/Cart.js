import React from 'react';
import {
  CartContainer,
  ProductList,
  ProductCard,
  ProductDetails,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductPrice,
  QuantityControls,
  ControlButton,
  SummarySection,
  SummaryItem,
  TotalPrice,
  CheckoutButton,
} from '../styles/StyledCart';

const Cart = ({ cartItems }) => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 2.99;
  const total = subtotal + shipping;

  return (
    <CartContainer>
      <ProductList>
        {cartItems.length === 0 ? (
          <h2>IL TUO CARRELLO È VUOTO</h2>
        ) : (
          cartItems.map((item) => (
            <ProductCard key={item.id}>
              <ProductDetails>
                <ProductImage src={item.image} alt={item.name} />
                <ProductInfo>
                  <ProductName>{item.name}</ProductName>
                  <ProductPrice>€{item.price.toFixed(2)}</ProductPrice>
                  <span>Quantità: {item.quantity}</span>
                </ProductInfo>
              </ProductDetails>
            </ProductCard>
          ))
        )}
      </ProductList>

      <SummarySection>
        <h3>RIEPILOGO DELL'ORDINE</h3>
        <SummaryItem>
          <span>Subtotale</span>
          <span>€{subtotal.toFixed(2)}</span>
        </SummaryItem>
        <SummaryItem>
          <span>Spedizione</span>
          <span>{shipping === 0 ? 'GRATUITA' : `€${shipping.toFixed(2)}`}</span>
        </SummaryItem>
        <TotalPrice>
          <span>TOTALE</span>
          <span>€{total.toFixed(2)}</span>
        </TotalPrice>
        <CheckoutButton to="/checkout">Continua</CheckoutButton>
      </SummarySection>
    </CartContainer>
  );
};

export default Cart;
