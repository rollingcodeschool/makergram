import { BrowserRouter,Route, Routes, Navigate, Outlet } from "react-router";
import Home from "./pages/Home";
import Post from "./pages/Post";
import Rank from "./pages/Rank";
import BottomNav from "./components/BottomNav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Dashboard from "./pages/Dashboard";
import { supabase } from "./lib/client";
import { useEffect, useState } from "react";

function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const userId = session?.user?.id;
      if (!userId) {
        setIsAdmin(false);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (!isMounted) return;
      setIsAdmin(profileData?.role === "admin");
    };

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isAdmin === null) {
    return null;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

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
             <Route element={<AdminRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </main>

        {/* Menú fijo inferior */}
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
