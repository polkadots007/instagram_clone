import { lazy, Suspense, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import useAuthListener from './hooks/use_auth_listener';
import UserContext from './context/user';
import ProtectedRoute from './helpers/protected_route';
import IsUserLoggedIn from './helpers/is_user_loggedin';

const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/sign_up'));
const NotFound = lazy(() => import('./pages/not_found'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Profile = lazy(() => import('./pages/profile'));

function App() {
  const { user } = useAuthListener();
  const UserContextProp = useMemo(() => ({ user }), [user]);
  return (
    <UserContext.Provider value={UserContextProp}>
      <Router>
        <Suspense
          fallback={
            <p
              className="flex max-w-full h-screen 
          items-center justify-center font-bold
          text-2xl
          "
            >
              Loading...
            </p>
          }
        >
          <Routes>
            <Route
              path={ROUTES.LOGIN}
              element={
                <IsUserLoggedIn user={user} loggedInPath={ROUTES.DASHBOARD} path={ROUTES.LOGIN}>
                  <Login />
                </IsUserLoggedIn>
              }
            />
            <Route
              path={ROUTES.SIGN_UP}
              element={
                <IsUserLoggedIn user={user} loggedInPath={ROUTES.DASHBOARD} path={ROUTES.LOGIN}>
                  <SignUp />
                </IsUserLoggedIn>
              }
            />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute user={user} path={ROUTES.DASHBOARD}>
                  <Dashboard />
                </ProtectedRoute>
              }
              exact
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
