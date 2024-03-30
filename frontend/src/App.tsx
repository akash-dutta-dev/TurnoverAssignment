import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/Header";
import { SignUp } from "./pages/SignUp";
import { EmailVerify } from "./pages/EmailVerify";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto py-10 flex-1 ">
          <Routes>
            <Route path="/" element={<Navigate to="/sign-up" />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/verify-email" element={<EmailVerify />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
