import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const CartContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 40px;
  font-family: 'Arial', sans-serif;
`;

export const ProductList = styled.div`
  width: 65%;
`;

export const ProductCard = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 20px 0;
`;

export const ProductDetails = styled.div`
  display: flex;
  gap: 20px;
`;

export const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
`;

export const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const ProductName = styled.h4`
  font-size: 18px;
  margin: 0;
`;

export const ProductPrice = styled.span`
  font-size: 18px;
  color: #b22222;
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ControlButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #f1f1f1;
  }
`;

export const SummarySection = styled.div`
  width: 30%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #fafafa;
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
`;

export const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
`;

export const CheckoutButton = styled(Link)`
  display: block;
  width: 100%;
  padding: 12px 0;
  text-align: center;
  background-color: #b22222;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 20px;

  &:hover {
    background-color: #9b1c1c;
  }
`;
