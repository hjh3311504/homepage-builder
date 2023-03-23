import { BrowserRouter as Router } from 'react-router-dom';
import TopNavBar from './element/top-nav-bar/TopNavBar';

import Routers from './Routers';

const App = () => {
  return (
    <div>
      <Router>
        <TopNavBar />
        <Routers />
      </Router>
    </div>
  );
};

export default App;
