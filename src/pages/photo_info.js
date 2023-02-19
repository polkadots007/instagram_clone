import { useParams, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { getPhotoByPhotoId } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import Header from '../components/header';
import UserContext from '../context/user';
import SelectedPost from '../components/selected_post';

export default function PhotoDetails() {
  const { username, id: photoId } = useParams();
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  useEffect(() => {
    async function checkPhotoExists() {
      const photoDetails = await getPhotoByPhotoId(photoId, user?.uid);
      if (photoDetails.length > 0) {
        setPhoto(photoDetails[0]);
      } else {
        navigate(ROUTES.NOT_FOUND);
      }
    }

    checkPhotoExists();
  }, [photo, navigate]);

  return photo?.photoId ? (
    <div className="bg-gray-background">
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <SelectedPost photo={photo} />
      </div>
    </div>
  ) : null;
}
