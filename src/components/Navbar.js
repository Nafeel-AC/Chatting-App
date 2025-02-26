import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <NavContainer>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <a className="navbar-brand text-golden" href="#">HexChat</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-golden" onClick={() => navigate('/chat')} style={{ cursor: 'pointer' }}>
                  Chat
                </a>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input 
                className="form-control me-2 search-input" 
                type="search" 
                placeholder="Search" 
                aria-label="Search"
              />
              <button className="btn search-btn" type="submit">Search</button>
            </form>
          </div>
        </div>
      </nav>
    </NavContainer>
  );
};

const NavContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .custom-navbar {
    background-color: #fdfbf7;
    border-bottom: 2px solid #d4af37; /* Made border thicker and changed color */
    box-shadow: 0 2px 4px rgba(212, 175, 55, 0.1); /* Added subtle shadow */
  }

  .text-golden {
    color: #b8860b !important;
    font-weight: 500;
    
    &:hover {
      color: #d4af37 !important;
    }
  }

  .search-input {
    border: 1px solid #d4af37;
    &:focus {
      border-color: #b8860b;
      box-shadow: 0 0 0 0.2rem rgba(184, 134, 11, 0.25);
    }
  }

  .search-btn {
    background: #d4af37;
    color: white;
    border: none;
    
    &:hover {
      background: #b8860b;
    }
  }

  .navbar-toggler {
    border-color: #d4af37;
  }

  .navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(212, 175, 55, 0.75)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
  }
`;

export default Navbar;
