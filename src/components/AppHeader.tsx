import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { supabase } from "../lib/client";

type HeaderUser = {
  id: string;
  avatarUrl?: string | null;
  role?: string | null;
};

interface AppHeaderProps {
  title: string;
  containerClassName?: string;
  leftContent?: React.ReactNode;
}

function DashboardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5.5 h-5.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5.5 h-5.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
      />
    </svg>
  );
}

export function AppHeader({
  title,
  containerClassName = "max-w-lg mx-auto",
  leftContent,
}: AppHeaderProps) {
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const isAdmin = currentUser?.role === "admin";
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const syncUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      const sessionUser = session?.user ?? null;

      if (sessionUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("avatar_url, role")
          .eq("id", sessionUser.id)
          .maybeSingle();

        if (!isMounted) return;

        setCurrentUser({
          id: sessionUser.id,
          avatarUrl:
            profileData?.avatar_url ??
            sessionUser.user_metadata?.avatar_url ??
            sessionUser.user_metadata?.avatarUrl ??
            null,
          role: profileData?.role ?? sessionUser.user_metadata?.role ?? null,
        });
      } else {
        setCurrentUser(null);
      }

      setIsAuthLoading(false);
    };

    syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      const sessionUser = session?.user ?? null;

      if (sessionUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("avatar_url, role")
          .eq("id", sessionUser.id)
          .maybeSingle();

        if (!isMounted) return;

        setCurrentUser({
          id: sessionUser.id,
          avatarUrl:
            profileData?.avatar_url ??
            sessionUser.user_metadata?.avatar_url ??
            sessionUser.user_metadata?.avatarUrl ??
            null,
          role: profileData?.role ?? sessionUser.user_metadata?.role ?? null,
        });
      } else {
        setCurrentUser(null);
      }

      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-card-bg border-b border-border">
      <div
        className={`px-4 py-3 flex items-center justify-between gap-3 ${containerClassName}`}
      >
        <div className="flex items-center min-w-0 flex-1">
          {leftContent ? (
            <div className="min-w-0">{leftContent}</div>
          ) : (
            <div className="w-10" />
          )}
        </div>

        <h1 className="flex-1 text-center text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="flex items-center justify-end gap-3.5 min-w-47.5 flex-1">
          {isAdmin && (
            <Link
              to="/dashboard"
              title="Panel de Administración"
              className="text-foreground/70 hover:text-foreground hover:bg-foreground/10 p-2 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
            >
              <DashboardIcon />
            </Link>
          )}

          {isAuthLoading ? (
            <div className="w-8 h-8" />
          ) : currentUser ? (
            <>
              <Link
                to="/profile"
                title="Mi Perfil"
                className="inline-flex items-center justify-center cursor-pointer"
              >
                <img
                  src={currentUser.avatarUrl ?? undefined}
                  alt="Perfil"
                  className="w-6 h-6 rounded-full object-cover border border-primary-light hover:bg-foreground/10 transition-colors"
                />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Cerrar sesión"
                className="text-foreground/70 hover:text-foreground hover:bg-foreground/10 p-2 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center"
              >
                <LogoutIcon />
              </button>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="text-accent font-medium hover:underline"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
