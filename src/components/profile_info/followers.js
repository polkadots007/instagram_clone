import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getAllDetailsByList } from '../../services/firebase';
import FollowerProfile from './follower_profile';

export default function Followers({
  username,
  userId,
  userDocId,
  followers,
  following,
  setProfileCount,
  isLoggedInUser
}) {
  const [followerDetails, setFollowerDetails] = useState([]);
  useEffect(() => {
    async function getProfileDetails(followers) {
      const profileDetails = await getAllDetailsByList(followers);
      setFollowerDetails(profileDetails);
    }
    if (followers.length > 0) getProfileDetails(followers);
  }, [username, followers]);

  return followerDetails.length
    ? followerDetails.map((follower) => (
        <FollowerProfile
          key={follower.userId}
          userId={userId}
          userDocId={userDocId}
          profileUserName={follower.username}
          profileFullName={follower.fullName}
          profileDocId={follower.docId}
          profileId={follower.userId}
          isFollowing={following.includes(follower.userId)}
          setProfileCount={setProfileCount}
          isLoggedInUser={isLoggedInUser}
        />
      ))
    : new Array(5).fill(0).map((_, i) => <Skeleton key={i} width="100%" height={70} />);
}

Followers.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userDocId: PropTypes.string.isRequired,
  followers: PropTypes.array.isRequired,
  following: PropTypes.array.isRequired,
  setProfileCount: PropTypes.func.isRequired,
  isLoggedInUser: PropTypes.bool.isRequired
};
