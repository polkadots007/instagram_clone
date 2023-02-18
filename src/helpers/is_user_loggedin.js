import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

export default function IsUserLoggedIn({ user, loggedInPath, children, ...rest }) {
  const curLocation = useLocation();

  const [location] = useState(curLocation.state || {});
  return !user ? (
    children
  ) : (
    <Navigate
      to={{
        pathname: loggedInPath,
        state: { from: location }
      }}
    />
  );
}

IsUserLoggedIn.propTypes = {
  user: PropTypes.object,
  loggedInPath: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired
};
