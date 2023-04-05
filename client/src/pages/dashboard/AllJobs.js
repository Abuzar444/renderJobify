import { Alert, JobsContainer, SearchContainer } from '../../components';
import { useAppContext } from '../../context/appContext';

const AllJobs = () => {
  const { showAlert } = useAppContext();
  return (
    <>
      <SearchContainer />
      {showAlert && <Alert />}
      <JobsContainer />
    </>
  );
};

export default AllJobs;
