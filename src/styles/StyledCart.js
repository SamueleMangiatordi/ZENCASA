import styled from 'styled-components';

export const CartContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

export const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  span:last-child {
    margin-left: 10px;
    font-size: 24px;
  }
`;

export const FreeShippingMessage = styled.div`
  background-color: #f8f9fa;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
  text-align: center;

  p {
    font-size: 16px;
    margin: 0;
  }
`;


export const ProductList = styled.div`
  margin-bottom: 40px;
`;

export const ProductCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
`;

export const ProductInfo = styled.div`
  h3 {
    font-size: 18px;
    margin: 0 0 10px 0;
  }

  p {
    margin: 0;
    font-size: 16px;
  }
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;

  button {
    border: 1px solid #ccc;
    background-color: transparent;
    padding: 5px 10px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      background-color: #f1f1f1;
    }
  }

  span {
    margin: 0 10px;
    font-size: 16px;
  }
`;

export const RemoveButton = styled.button`
  background-color: transparent;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

export const SummarySection = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  background-color: #f8f9fa;

  h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 16px;
`;

export const TotalPrice = styled.h3`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-bottom: 20px;
`;

export const CheckoutButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

export const FreeShippingContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;

  p {
    font-size: 16px;
    margin: 0 0 10px;
  }
`;


export const ProgressBarOuter = styled.div`
  height: 20px;
  background: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
  display: flex;
`;

export const ProgressBarInner = styled.div`
  background-color: ${(props) => props.color || "#28a745"};
  width: ${(props) => props.width || "0%"};
  transition: width 0.3s ease;
`;

export const ProgressLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 14px;
  color: #6c757d;
`;

export const HighlightText = styled.span`
  font-weight: bold;
  color: ${(props) => props.color || "#007bff"};
`;

export const AddToCartButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProductName = styled.h3`
  font-size: 18px;
  margin: 0;
`;

export const ProductPrice = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

export const ControlButton = styled.button`
  border: 1px solid #ccc;
  background-color: transparent;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;
