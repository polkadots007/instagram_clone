import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getAllDetailsByList } from '../../services/firebase';
import FollowingProfile from './following_profile';

export default function Following({
  username,
  userId,
  userDocId,
  following,
  setProfileCount,
  isLoggedInUser
}) {
  const [followingDetails, setFollowingDetails] = useState([]);
  useEffect(() => {
    async function getProfileDetails(following) {
      const profileDetails = await getAllDetailsByList(following);
      setFollowingDetails(profileDetails);
    }
    if (following.length > 0) getProfileDetails(following);
  }, [username, following]);

  return followingDetails.length
    ? followingDetails.map((followingUser) => (
        <FollowingProfile
          key={followingUser.userId}
          userId={userId}
          userDocId={userDocId}
          profileUserName={followingUser.username}
          profileFullName={followingUser.fullName}
          profileDocId={followingUser.docId}
          profileId={followingUser.userId}
          setProfileCount={setProfileCount}
          isLoggedInUser={isLoggedInUser}
        />
      ))
    : new Array(5).fill(0).map((_, i) => <Skeleton key={i} width="100%" height={70} />);
}

Following.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userDocId: PropTypes.string.isRequired,
  following: PropTypes.array.isRequired,
  setProfileCount: PropTypes.func.isRequired,
  isLoggedInUser: PropTypes.bool.isRequired
};
