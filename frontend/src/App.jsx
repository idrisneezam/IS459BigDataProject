import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { PredictionQueryPage } from '@/pages/q1/PredictionQueryPage'
import Visualisation from "@/pages/q2/Visualisation";

function App() {

  return (
    <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/Q1" replace />} />
            <Route path="/Q1" element={<PredictionQueryPage />} />
            <Route path="/Q2" element={<Visualisation />} />
        </Routes>
    </Router>
  );
}

export default App