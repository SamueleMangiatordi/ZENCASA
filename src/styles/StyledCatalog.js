import styled from 'styled-components';

export const CatalogContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Sidebar = styled.div`
  width: 20%;
  padding: 20px;
  background-color: #f7f7f7;
  border-right: 1px solid #ddd;
`;

export const FilterTitle = styled.h3`
  margin-bottom: 10px;
`;

export const FilterOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const Checkbox = styled.input`
  margin-right: 10px;
`;

export const ColorCircle = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color || '#fff'};
  display: inline-block;
  border: 1px solid #ddd;
  margin-right: 10px;
`;

export const MainContent = styled.div`
  width: 80%;
  padding: 20px;
`;

export const SortContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

export const ProductCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

export const ProductName = styled.h4`
  font-size: 16px;
  margin: 10px 0;
`;

export const ProductPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const ProductTag = styled.span`
  background-color: #eee;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
`;

export const AddToCartButton = styled.button`
  padding: 10px 20px;
  background-color: #b22222;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #9b1c1c;
  }
`;
