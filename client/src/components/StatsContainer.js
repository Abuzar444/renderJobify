import { useAppContext } from '../context/appContext';
import StatItem from './StatItem';
import { FaSuitcaseRolling, FaCalendarCheck, FaTimes, FaCheck } from 'react-icons/fa';
import styled from 'styled-components'

const StatsContainer = () => {
  const { stats } = useAppContext();
  const defaultStats = [
    {
      title: 'Εκκρεμούν',
      count: stats.Εκκρεμεί || 0,
      icon: <FaSuitcaseRolling />,
      color: '#e9b949',
      bgc: '#fcefc7',
    },
    {
      title: 'Σε φάση συνέντευξης',
      count: stats.Συνέντευξη || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bgc: '#e0e8f9',
    },
    {
      title: 'Απορρίφθηκαν',
      count: stats.Απορρίφθηκε || 0,
      icon: <FaTimes />,
      color: '#d66a6a',
      bgc: '#ffeeee',
    },
    {
      title: 'Εγκρίθηκαν',
      count: stats.Εγκρίθηκε || 0,
      icon: <FaCheck />,
      color: '#0f5132',
      bgc: '#d1e7dd',
    },
  ];

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />;
      })}
    </Wrapper>
  );
};


const Wrapper = styled.section`
  display: grid;
  row-gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  @media (min-width: 1120px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 1rem;
  }
`

export default StatsContainer;