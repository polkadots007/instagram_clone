import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

export default function ProtectedRoute({ user, children, ...rest }) {
  const curLocation = useLocation();

  const [location] = useState(curLocation.state || {});
  return user ? (
    children
  ) : (
    <Navigate
      to={{
        pathname: ROUTES.LOGIN,
        state: { from: location }
      }}
    />
  );
}

ProtectedRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.object.isRequired
};
