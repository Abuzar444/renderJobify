import { Link } from 'react-router-dom';
import img from '../assets/images/not-found.svg';
import styled from 'styled-components';

const Error = () => {
  return (
    <Wrapper className="full-page">
      <div>
        <img src={img} alt="not found" />
        <h3>ΩΠ! ΚΑΤΙ ΠΗΓΕ ΛΑΘΟΣ.</h3>
        <p>Φαίνεται ότι δεν μπορούμε να ξετρυπώσουμε την σελίδα που ψάχνεις.</p>
        <Link to="/">ΕΠΙΣΤΡΟΦΗ</Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 600px;
    display: block;
    margin-bottom: 2rem;
  }
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--grey-500);
  }
  a {
    color: var(--primary-500);
    text-decoration: underline;
    text-transform: capitalize;
  }
`;

export default Error;
