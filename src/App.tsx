import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  LoginPage,
  DashboardPage,
  ChildrenListPage,
  ChildProfilePage,
  NewSessionPage,
  AnalyticsPage,
} from './pages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/children" element={<ChildrenListPage />} />
        <Route path="/children/:id" element={<ChildProfilePage />} />
        <Route path="/sessions/new" element={<NewSessionPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
