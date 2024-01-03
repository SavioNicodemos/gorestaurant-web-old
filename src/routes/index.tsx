import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path='/' element={<Dashboard />} />
    </Routes>
  </Router>
);

export default AppRoutes;
