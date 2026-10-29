import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import WeeklyAnalysis from "./pages/WeeklyAnalysis"
import AddTrade from "./pages/AddTrade";
import Analytics from "./pages/Analytics";
import Journal from "./pages/Journal";
import Roadmap from "./pages/Roadmap";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/weekly-analysis" element={<WeeklyAnalysis />} />
          <Route path="/add-trade" element={<AddTrade />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;