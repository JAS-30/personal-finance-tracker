import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for the navbar
const NavbarContainer = styled.nav`
  background-color: #333;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #fff;
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    display: none;  // Hide on smaller screens
  }
`;

const NavItem = styled.li`
  display: inline;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #e53935;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Clear the authentication state
    setIsAuthenticated(false);

    // Redirect to login page
    navigate('/login');
  };

  return (
    <NavbarContainer>
      <Logo>FinanceTracker</Logo>
      <NavList>
        <NavItem><NavLink to="/home">Home</NavLink></NavItem>
        <NavItem><NavLink to="/profile">Profile</NavLink></NavItem>
        <NavItem><NavLink to="/transaction-history">Transaction History</NavLink></NavItem>
        <NavItem><LogoutButton onClick={handleLogout}>Logout</LogoutButton></NavItem>
      </NavList>
    </NavbarContainer>
  );
};

export default Navbar;
