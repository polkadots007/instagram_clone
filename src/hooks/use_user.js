import { useState, useEffect, useContext, useCallback } from 'react';
import UserContext from '../context/user';
import { getUserByUserId } from '../services/firebase';

export default function useUser() {
  const [activeUser, setActiveUser] = useState({});
  const { user } = useContext(UserContext);
  const getUserObjByUserId = useCallback(async () => {
    const [response] = await getUserByUserId(user.uid);
    setActiveUser(response);
  }, [user]);

  useEffect(() => {
    //  Commented out to optimize using useCallback
    // async function getUserObjByUserId() {
    //   // Fn to call firebase service to get user data based on id
    //   const [response] = await getUserByUserId(user.uid);
    //   setActiveUser(response);
    // }

    if (user?.uid) {
      getUserObjByUserId();
    }
  }, [user]);

  return { user: activeUser };
}
