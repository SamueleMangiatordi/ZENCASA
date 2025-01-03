import styled from "styled-components";

export const CheckoutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
`;

export const MainContent = styled.div`
  display: flex;
  gap: 40px;
`;

export const LeftSection = styled.div`
  flex: 2;
`;

export const RightSection = styled.div`
  flex: 1;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

export const Title2 = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const LoginSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

export const LoginButton = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;

export const CheckoutForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

export const FormField = styled.div`
  flex: 1 1 calc(50% - 20px);
  display: flex;
  flex-direction: column;
  label {
    font-weight: bold;
    margin-bottom: 5px;
  }
`;

export const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

export const CheckboxLabel = styled.label`
  flex: 1 1 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

export const SummarySection = styled.div`
  margin-bottom: 20px;
`;

export const SummaryTitle = styled.h2`
  margin-bottom: 10px;
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-top: 20px;
`;

export const ArticlesSection = styled.div`
  margin-top: 20px;
`;

export const ArticlesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ArticleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  img {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    object-fit: cover;
  }
`;

export const ArticleDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InfoSection = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-top: 1px solid #ddd;
`;

export const ProceedButton = styled.button`
  margin-top: 20px;
  padding: 15px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background-color: #333;
  }
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f0f0f0;
  pointer-events: none; /* Impedisce modifiche */
  cursor: not-allowed;
`;
