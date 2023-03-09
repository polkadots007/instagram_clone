import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserContext from '../context/user';
import UserInfo from '../components/profile_info';

export default function Followers() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoggedInUser, setLoggedIn] = useState(true);

  useEffect(() => {
    async function getUserDetails() {
      const userDetail = await getUserByUsername(username);
      if (userDetail.length > 0) {
        setUserDetails(userDetail[0]);
        if (user?.email === userDetail[0].emailAddress) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } else {
        navigate(ROUTES.NOT_FOUND);
      }
    }
    getUserDetails();
  }, [username, navigate]);

  return userDetails?.username ? (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <UserInfo user={userDetails} isLoggedInUser={isLoggedInUser} />
      </div>
    </div>
  ) : null;
}
