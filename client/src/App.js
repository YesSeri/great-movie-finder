import Home from './pages/home'
import Movie from './pages/movie'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import * as ROUTES from './constants/routes'
function App() {
  return (
    <Router>
      <Route exact path={ROUTES.HOME}>
        <Home />
      </Route>
      <Route exact path={ROUTES.MOVIE}>
        <Movie />
      </Route>
    </Router>
  );
}

export default App;
