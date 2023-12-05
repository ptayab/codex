import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './landing';
import Signup from './signup';
import Channels from './channels';
import Posts from './posts';



function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/posts/:postId" element={<Posts />} />
      </Routes>
    </Router>
  );
}

export default App;
