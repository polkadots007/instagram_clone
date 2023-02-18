import { useState, useEffect, useContext } from 'react';
import FirebaseContext from '../context/firebase';

export default function useAuthListener() {
  // eslint-disable-next-line no-undef
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        // if we an authenticated user -> store the user in localStorage
        // eslint-disable-next-line no-undef
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setUser(authUser);
      } else {
        // if there is no user, we clear the localStorage
        // eslint-disable-next-line no-undef
        localStorage.removeItem('authUser');
        setUser(null);
      }
      return () => listener();
    });
  }, [firebase]);

  return { user };
}
