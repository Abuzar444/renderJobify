import main from '../assets/images/main-alternative.svg';
import styled from 'styled-components';
import { Logo } from '../components';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import React from 'react';

const Landing = () => {
  const {user} = useAppContext()
  return (
    <React.Fragment>
    {user && <Navigate to='/' />}
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          {/* info */}
          <h1>
            Σημείο <span>Ιχνηλάτησης</span> Εργασίας
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci
            in, consectetur quibusdam non doloremque odit obcaecati tenetur
            veniam debitis itaque nemo praesentium tempora asperiores, corporis
            dolores eaque! Error, tempore debitis!
          </p>
          <Link to="/register" className="btn btn-hero">
            Σύνδεση / Εγγραφή
          </Link>
        </div>
        <img src={main} alt="Job hunt" className="img main-img" />
      </div>
    </Wrapper>
    </React.Fragment>
  );
};

const Wrapper = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    font-size: 2.6rem;
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;

export default Landing;
