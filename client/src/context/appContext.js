// Εδώ περνάμε όλες τις καταστάσεις και τις λειτουργίες σε όλα τα επίπεδα της εφαρμογής.

import React, { useReducer, useContext, useEffect } from 'react';
import reducer from './reducer';
import axios from 'axios';

export const initialState = {
  user: null,
  userLocation: '',
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertType: '',
  alertText: '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobTypeOptions: [
    'Σύμβουλος',
    'Συνεργασία',
    'Πλήρης Απασχόληση',
    'Ημιαπασχόληση',
    'Υβριδική',
    'Απομακρυσμένη',
    'Πρακτική',
  ],
  jobType: 'Πλήρης Απασχόληση',
  statusOptions: ['Εκκρεμεί', 'Συνέντευξη', 'Απορρίφθηκε', 'Εγκρίθηκε'],
  status: 'Εκκρεμεί',
  jobLocation: '',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'Όλα',
  searchType: 'Όλα',
  sort: 'Νεότερες',
  sortOptions: ['Νεότερες', 'Παλαιότερες', 'Α -> Ω', 'Ω -> Α'],
};

const AppContext = React.createContext();

// Οικουμενική πρόσβαση στις καταστάσεις και τις λειτουργίες που δημιουργούμε παρακάτω. Χρήση στο index.js
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Axios
  // Εξασφαλίζουμε ότι το αποδεικτικό μας δεν το στέλνουμε σε όλες τις προσκομίσεις μας αλλά μόνο στα url που δηλώνουμε εδώ.
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });

  // request interceptor

  // response interceptor
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  // Λειτουργίες
  const displayAlert = () => {
    dispatch({ type: 'DISPLAY_ALERT' });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: 'CLEAR_ALERT' });
    }, 5000);
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const getCurrentUser = async (user) => {
    dispatch({ type: 'GET_CURRENT_USER_BEGIN' });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;
      dispatch({
        type: 'GET_CURRENT_USER_SUCCESS',
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status === 401) return;
      logoutUser();
    }
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: 'REGISTER_USER_BEGIN' });
    try {
      const response = await axios.post(
        '/api/v1/auth/registerUser',
        currentUser
      );
      const { user, location } = response.data;
      dispatch({
        type: 'REGISTER_USER_SUCCESS',
        payload: { user, location },
      });
    } catch (error) {
      dispatch({
        type: 'REGISTER_USER_ERROR',
        payload: { msg: error.response.data },
      });
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: 'LOGIN_USER_BEGIN' });
    try {
      const response = await axios.post('/api/v1/auth/loginUser', currentUser);
      const { user, location } = response.data;
      dispatch({
        type: 'LOGIN_USER_SUCCESS',
        payload: { user, location },
      });
    } catch (error) {
      dispatch({
        type: 'LOGIN_USER_ERROR',
        payload: { msg: error.response.data },
      });
    }
    clearAlert();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: 'UPDATE_USER_BEGIN' });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);

      // no token
      const { user, location } = data;

      dispatch({
        type: 'UPDATE_USER_SUCCESS',
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: 'UPDATE_USER_ERROR',
          payload: { msg: error.response.data },
        });
      }
    }
    clearAlert();
  };

  const logoutUser = async () => {
    await authFetch.get('/auth/logoutUser')
    dispatch({ type: 'LOGOUT_USER' });
  };

  const createJob = async () => {
    dispatch({ type: 'CREATE_JOB_BEGIN' });
    try {
      const { position, company, jobLocation, jobType, status } = state;

      await authFetch.post('/jobs', {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({
        type: 'CREATE_JOB_SUCCESS',
      });
      clearValues();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: 'CREATE_JOB_ERROR',
        payload: { msg: error.response.data },
      });
    }
    clearAlert();
  };

  const setEditJobId = (id) => {
    dispatch({ type: 'EDIT_JOB_SET_ID', payload: { id } });
  };

  const editJob = async () => {
    dispatch({ type: 'EDIT_JOB_BEGIN' });
    try {
      const { editJobId, position, company, jobLocation, jobType, status } =
        state;

      await authFetch.patch(`/jobs/${editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({
        type: 'EDIT_JOB_SUCCESS',
      });
      clearValues();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: 'EDIT_JOB_ERROR',
        payload: { msg: error.response.data },
      });
    }
    clearAlert();
  };

  const deleteJob = async (jobId) => {
    dispatch({ type: 'DELETE_JOB_BEGIN' });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
      clearAlert();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: 'DELETE_JOB_ERROR',
        payload: { msg: error.response.data },
      });
    }
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: 'GET_JOBS_BEGIN' });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: 'GET_JOBS_SUCCESS',
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const showStats = async () => {
    dispatch({ type: 'SHOW_STATS_BEGIN' });
    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: 'SHOW_STATS_SUCCESS',
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({
      type: 'HANDLE_CHANGE',
      payload: { name, value },
    });
  };

  const clearValues = async () => {
    await dispatch({
      type: 'CLEAR_VALUES',
    });
  };

  const clearFilters = () => {
    dispatch({
      type: 'CLEAR_FILTERS',
    });
  };

  const changePage = (page) => {
    dispatch({ type: 'CHANGE_PAGE', payload: { page } });
  };

  useEffect(() => {
    getCurrentUser();
  }, []);
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        toggleSidebar,
        loginUser,
        updateUser,
        logoutUser,
        createJob,
        setEditJobId,
        editJob,
        deleteJob,
        getJobs,
        showStats,
        handleChange,
        clearValues,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// make sure use
export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
