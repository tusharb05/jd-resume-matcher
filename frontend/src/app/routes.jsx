import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import AuthCard from "../components/auth/AuthCard.jsx";
import HomePage from "../pages/HomePage.jsx";

function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6">
      <div className="text-center">
        <div className="text-2xl font-semibold">404</div>
        <div className="text-slate-600 mt-1">Page not found</div>
      </div>
    </div>
  );
}

export default [
  { path: "/auth", element: <AuthCard /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/", element: <HomePage /> }],
  },
  { path: "*", element: <NotFound /> },
];
