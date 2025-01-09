import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components for the navbar
const NavbarContainer = styled.nav`
  background-color: #333;
  width: 100%;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 1024px) {
    padding: 10px 15px;
  }
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 24px;
  color: #fff;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;

  @media (max-width: 768px) {
    display: ${({ isMobileMenuOpen }) => (isMobileMenuOpen ? 'block' : 'none')};
    position: absolute;
    top: 60px;
    left: 0;
    background-color: #333;
    width: 100%;
    padding: 0;
    margin: 0;
    z-index: 1000;
  }

  @media (min-width: 1024px) {
    gap: 10px; /* Adjust gap for larger screens */
    padding-right:50px;
  }
`;

const NavItem = styled.li`
  display: inline;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  display: block;
  padding: 10px 10px;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    padding: 15px;
    font-size: 16px;
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
  margin-left: 20px; /* Add margin to the left to create space from the links */

  &:hover {
    background-color: #e53935;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px;
    width: 100%;
    margin-left: 0;
  }
`;

const HamburgerMenu = styled.div`
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  z-index: 1500;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    top: 18px;
    right: 20px;
  }

  div {
    width: 30px;
    height: 4px;
    background-color: white;
    border-radius: 2px;
  }
`;

const Navbar = ({ setIsAuthenticated }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // References to detect clicks outside of the menu
  const navbarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Clear the authentication state
    setIsAuthenticated(false);

    // Redirect to login page
    navigate('/login');
  };

  // Close the hamburger menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && !hamburgerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    // Add the event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <NavbarContainer ref={navbarRef}>
      <Logo>FinanceTracker</Logo>
      <HamburgerMenu ref={hamburgerRef} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <div />
        <div />
        <div />
      </HamburgerMenu>
      <NavList isMobileMenuOpen={isMobileMenuOpen}>
        <NavItem><NavLink to="/home">Home</NavLink></NavItem>
        <NavItem><NavLink to="/profile">Profile</NavLink></NavItem>
        <NavItem><NavLink to="/transaction-history">Transaction History</NavLink></NavItem>
        <NavItem><LogoutButton onClick={handleLogout}>Logout</LogoutButton></NavItem>
      </NavList>
    </NavbarContainer>
  );
};

export default Navbar;
