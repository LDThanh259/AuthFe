import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import Register from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider} from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import ClientPage from './pages/ClientPage';

function App() {
  console.log('[App] Rendering application routes');

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public routes */}
          <Route path='/' element={<Dashboard/>}/>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
          <Route path='/change-password' element={<ChangePasswordPage/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path="/unauthorized" element={<Unauthorized />} />
    
          {/* Protected Routes */}  
          <Route
            path='/user-only'
            element={
              <ProtectedRoute roles={['Client']}>
                <ClientPage/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute roles={['Client']}>
                <ProfilePage/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/admin' 
            element={
              <ProtectedRoute roles={['Admin']}>
                <AdminPage/>
              </ProtectedRoute>
              }
          />
        </Routes>
      </Router>

    </AuthProvider>
  );
}

export default App;
