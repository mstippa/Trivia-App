import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { AuthProvider } from "./context/auth";

import Home from "./pages/home";
import Login from "./pages/login";
import Leaderboard from "./pages/leaderboard";
import Register from "./pages/register";
import MenuBar from "./components/MenuBar";
import { Container } from "semantic-ui-react";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <QueryClientProvider client={queryClient}>
            <Route exact path="/login" component={Login} />
          </QueryClientProvider>
          <QueryClientProvider client={queryClient}>
            <Route exact path="/leaderboard" component={Leaderboard} />
          </QueryClientProvider>
          <QueryClientProvider client={queryClient}>
            <Route exact path="/register" component={Register} />
          </QueryClientProvider>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
