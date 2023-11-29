import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './landing';
import Signup from './signup';

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
