import { BrowserRouter,Route, Routes } from "react-router";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Rank from "./pages/Rank";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Dashboard from "./pages/Dashboard";


export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground antialiased">
        <main className="pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<Post />} />
            <Route path="/rank" element={<Rank />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<ProfileEdit />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Menú fijo inferior */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
