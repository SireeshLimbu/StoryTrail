import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthForms } from "@/components/AuthForms";
import { AdminButton } from "@/components/AdminButton";
import { useIsAdmin } from "@/hooks/useAdmin";
import WelcomePage from "./pages/WelcomePage";
import StoriesPage from "./pages/StoriesPage";
import StoryLandingPage from "./pages/StoryLandingPage";
import Home from "./pages/Home";
import GamePage from "./pages/GamePage";
import CharactersPage from "./pages/CharactersPage";
import ProfilePage from "./pages/ProfilePage";
import MapPage from "./pages/MapPage";
import TrailPage from "./pages/TrailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import NotFound from "./pages/NotFound";
import AdminCitiesPage from "./pages/admin/AdminCitiesPage";
import AdminLocationsPage from "./pages/admin/AdminLocationsPage";
import AdminCharactersPage from "./pages/admin/AdminCharactersPage";
import AdminMapsPage from "./pages/admin/AdminMapsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public welcome page */}
        <Route path="/" element={<WelcomePage />} />
        
        {/* Public story browsing */}
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/story/:cityId" element={<StoryLandingPage />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<AuthRoute><AuthForms /></AuthRoute>} />
        
        {/* Protected routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/game/:cityId" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/characters" element={<ProtectedRoute><CharactersPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
        <Route path="/trail" element={<ProtectedRoute><TrailPage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        
        {/* Admin routes - protected with server-side admin role check */}
        <Route path="/admin" element={<AdminRoute><AdminCitiesPage /></AdminRoute>} />
        <Route path="/admin/locations" element={<AdminRoute><AdminLocationsPage /></AdminRoute>} />
        <Route path="/admin/characters" element={<AdminRoute><AdminCharactersPage /></AdminRoute>} />
        <Route path="/admin/maps" element={<AdminRoute><AdminMapsPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AdminButton />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
