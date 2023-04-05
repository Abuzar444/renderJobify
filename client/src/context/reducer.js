// Ο reducer αναλαμβάνει την αποθήκευση της εκάστοτε κατάστασης (state)
// μέσα σε ολόκληρη την εφαρμογή ανάλογα με την ενέργεια που περνάμε.

import { initialState } from './appContext';

const reducer = (state, action) => {
  if (action.type === 'DISPLAY_ALERT') {
    return {
      ...state,
      showAlert: true,
      alertType: 'danger',
      alertText: 'Συμπλήρωσε όλα τα πεδία! (Reducer)',
    };
  }
  if (action.type === 'CLEAR_ALERT') {
    return {
      ...state,
      showAlert: false,
      alertType: '',
      alertText: '',
    };
  }

  if (action.type === 'TOGGLE_SIDEBAR') {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }

  if (action.type === 'GET_CURRENT_USER_BEGIN') {
    return {
      ...state,
      userLoading: true,
      showAlert: false,
    };
  }
  if (action.type === 'GET_CURRENT_USER_SUCCESS') {
    return {
      ...state,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      userLoading: false,
    };
  }

  if (action.type === 'REGISTER_USER_BEGIN') {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === 'REGISTER_USER_SUCCESS') {
    return {
      ...state,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Ο Χρήστης Δημιουργήθηκε! Ανακατεύθυνση...',
    };
  }
  if (action.type === 'REGISTER_USER_ERROR') {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === 'LOGIN_USER_BEGIN') {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === 'LOGIN_USER_SUCCESS') {
    return {
      ...state,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Επιτυχής Είσοδος! Ανακατεύθυνση...',
    };
  }
  if (action.type === 'LOGIN_USER_ERROR') {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === 'UPDATE_USER_BEGIN') {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === 'UPDATE_USER_SUCCESS') {
    return {
      ...state,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Τα Στοιχεία Χρήστη Ενημερώθηκαν!',
    };
  }
  if (action.type === 'UPDATE_USER_ERROR') {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === 'LOGOUT_USER') {
    return {
      ...initialState,
      user: null,
      userLoading: false,
    };
  }

  if (action.type === 'CREATE_JOB_BEGIN') {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === 'CREATE_JOB_SUCCESS') {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Η Εργασία Προστέθηκε!',
    };
  }
  if (action.type === 'CREATE_JOB_ERROR') {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === 'EDIT_JOB_SET_ID') {
    const job = state.jobs.find((job) => job._id === action.payload.id);
    const { _id, position, company, jobLocation, jobType, status } = job;
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
    };
  }
  if (action.type === 'EDIT_JOB_BEGIN') {
    return { ...state, isLoading: true };
  }
  if (action.type === 'EDIT_JOB_SUCCESS') {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Η Εργασία Ενημερώθηκε!',
    };
  }
  if (action.type === 'EDIT_JOB_ERROR') {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === 'DELETE_JOB_BEGIN') {
    return { ...state, isLoading: true };
  }
  if (action.type === 'DELETE_JOB_ERROR') {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }

  if (action.type === 'GET_JOBS_BEGIN') {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === 'GET_JOBS_SUCCESS') {
    return {
      ...state,
      isLoading: false,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
      numOfPages: action.payload.numOfPages,
    };
  }

  if (action.type === 'SHOW_STATS_BEGIN') {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === 'SHOW_STATS_SUCCESS') {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications,
    };
  }

  if (action.type === 'HANDLE_CHANGE') {
    return {
      ...state,
      page: 1,
      [action.payload.name]: action.payload.value,
    };
  }

  if (action.type === 'CLEAR_VALUES') {
    initialState.isEditing = false;
    initialState.editJobId = '';
    initialState.position = '';
    initialState.company = '';
    initialState.jobLocation = state.userLocation;
    initialState.jobType = 'Πλήρης Απασχόληση';
    initialState.status = 'Εκκρεμεί';
    return {
      ...state,
      ...initialState,
    };
  }

  if (action.type === 'CLEAR_FILTERS') {
    return {
      ...state,
      search: '',
      searchStatus: 'Όλα',
      searchType: 'Όλα',
      sort: 'Νεότερες',
    };
  }

  if (action.type === 'CHANGE_PAGE') {
    return { ...state, page: action.payload.page };
  }
  throw new Error(`Η ενέργεια ${action.type} δεν υπάρχει.`);
};
export default reducer;
