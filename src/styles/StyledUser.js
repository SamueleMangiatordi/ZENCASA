import styled from 'styled-components';

export const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-height: 100vh;
  font-family: Arial, sans-serif;
`;

export const UserTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

export const SectionTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

export const TabButton = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: ${props => (props.$active ? '#007bff' : '#6c757d')};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => (props.$active ? '#0056b3' : '#5a6268')};
  }

  &:active {
    background-color: ${props => (props.$active ? '#003f7f' : '#4e555b')};
  }
`;

export const UserInfo = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 5px 0;
`;

export const UserLabel = styled.span`
  font-weight: bold;
  color: #222;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 1rem;
  margin-top: 20px;
`;

export const LoadingMessage = styled.div`
  color: #888;
  font-size: 1.2rem;
  margin-top: 20px;
`;

export const LogoutButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #003f7f;
  }
`;

export const EditButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }

  &:active {
    background-color: #1e7e34;
  }
`;

export const SaveButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #ffc107;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0a800;
  }

  &:active {
    background-color: #c69500;
  }
`;

export const CancelButton = styled.button`
  margin-top: 10px;
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #dc3545;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c82333;
  }

  &:active {
    background-color: #bd2130;
  }
`;

export const InputField = styled.input`
  padding: 10px;
  margin: 10px 0;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
`;

export const OrdersContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 800px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  font-size: 1rem;
  color: #333;
`;

export const OrderItem = styled.li`
  list-style: none;
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  p {
    margin: 5px 0;
  }
`;

export const OrdersList = styled.ul`
  padding: 0;
  margin: 0;
`;
