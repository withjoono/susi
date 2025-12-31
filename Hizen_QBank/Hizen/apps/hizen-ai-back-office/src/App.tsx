import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ECommerce from './pages/Dashboard/ECommerce';
import SignIn from './pages/Authentication/SignIn';
import Loader from './common/Loader';
import routes from './routes';
import { AuthProvider } from './context/AuthContext';

const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route element={<DefaultLayout />}>
          <Route index element={<ECommerce />} />
          {routes.map(({ path, component: Component }) => (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<Loader />}>
                  <Component />
                </Suspense>
              }
            />
          ))}
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
