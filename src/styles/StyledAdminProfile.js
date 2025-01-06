import styled from "styled-components";

export const AdminContainer = styled.div`
  display: flex;
  background-color: #f5f5f5; /* Sfondo bianco sporco */
  min-height: 100vh;
`;

export const Sidebar = styled.aside`
  width: 250px;
  background-color: #ffffff; /* Sidebar bianca */
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-right: 1px solid #ddd;
`;

export const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9; /* Grigio chiaro */
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  border: 1px solid transparent;

  &:hover {
    background-color: #ffedd5; /* Beige/arancione chiaro */
    border-color: #ff8c42; /* Bordi arancioni */
  }
`;

export const SubMenu = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1rem;
`;

export const SubMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 5px;
  background-color: white;

  &:hover {
    background-color: #ffedd5; /* Beige/arancione chiaro */
  }

  img {
    width: 20px;
    height: 20px;
  }
`;

export const DashboardSection = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

export const Header = styled.header`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #ddd;
`;

export const Title = styled.h1`
  font-family: 'Arial', sans-serif;
  font-weight: bold;
  text-align: left;
  margin: 0;
  color: #3d3d3d;
`;

export const NavButton = styled.button`
  background-color: transparent;
  color: #ff8b3d; /* Arancione per i collegamenti */
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-right: 1rem;

  &:hover {
    color: #ff4f00; /* Arancione più scuro al passaggio del mouse */
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatsCard = styled.div`
  flex: 1;
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
`;

export const StatIcon = styled.div`/* Sfondo beige/arancione chiaro */
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100px;
    height: 100px;
  }
`;


export const CarouselContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

export const ProductCarousel = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ff8c42; /* Arancione per lo scroll */
    border-radius: 5px;
  }
`;

export const ProductCard = styled.div`
  background-color: #fff7ed; /* Beige chiaro */
  padding: 1rem;
  border-radius: 8px;
  width: 200px;
  text-align: center;
  border: 1px solid #eee;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  h4 {
    margin: 10px 0;
    font-size: 1.2rem;
    font-weight: bold;
    color: #3d3d3d;
  }

  p {
    color: #666;
    font-size: 0.9rem;
  }
`;

export const Icon = styled.div`
  font-size: 2rem;
  margin-right: 10px;
`;

export const SidebarAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #fff;
  margin: 0 auto 2rem auto; /* Per centrare l'avatar */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #ff8b3d; /* Bordo arancione */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* L'immagine copre l'avatar senza deformarsi */
  }
`;


