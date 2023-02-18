import PropTypes from 'prop-types';
import { useReducer, useEffect, useContext } from 'react';
import UserContext from '../../context/user';
import { getUserPhotosByUserId } from '../../services/firebase';
import Header from './header';
import Photos from './photos';

export default function UserProfile({ user }) {
  const {
    user: { uid: loggedInUserId = '' }
  } = useContext(UserContext);
  const reducer = (state, newState) => ({ ...state, ...newState });
  const initialState = {
    profile: {},
    photosCollection: [],
    followerCount: 0,
    followingCount: 0
  };
  const [{ profile, photosCollection, followerCount, followingCount }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      const { userId, followers, following } = user;
      const photos = await getUserPhotosByUserId(userId, loggedInUserId);

      dispatch({
        profile: user,
        photosCollection: photos,
        followerCount: followers.length,
        followingCount: following.length
      });
    }
    getProfileInfoAndPhotos();
  }, [user]);

  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        followingCount={followingCount}
        setFollowerCount={dispatch}
      />
      <Photos photos={photosCollection} />
    </>
  );
}

UserProfile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
    followers: PropTypes.array.isRequired,
    following: PropTypes.array.isRequired,
    fullName: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired
  }).isRequired
};
