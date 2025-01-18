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
