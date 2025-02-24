import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import Register from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/change-password' element={<ChangePasswordPage/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/admin' element={<AdminPage/>}/>

      </Routes>
    </Router>
  );
}

export default App;
