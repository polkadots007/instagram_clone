import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserProfile from '../components/profile';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserExists() {
      const userDetails = await getUserByUsername(username);
      if (userDetails.length > 0) {
        setUser(userDetails[0]);
      } else {
        navigate(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username, navigate]);

  useEffect(() => {
    if (user !== null) document.title = `${user.fullName.split(' ')[0]} (@${username})`;
    else document.title = 'Snapper';
  }, [user]);

  return user?.username ? (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={user} />
      </div>
    </div>
  ) : null;
}
