import { Landing, Register, Error, ProtectedRoute } from './pages';
import {
  AllJobs,
  AddJob,
  Profile,
  Stats,
  SharedLayout,
} from './pages/dashboard';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Stats />}></Route>
            <Route path="all-jobs" element={<AllJobs />}></Route>
            <Route path="add-job" element={<AddJob />}></Route>
            <Route path="profile" element={<Profile />}></Route>
          </Route>
          <Route path="/landing" element={<Landing />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="*" element={<Error />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
