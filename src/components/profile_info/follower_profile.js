import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_IMG_SRC } from '../../constants/paths';
import { updateProfileFollowers, updateUserFollowing } from '../../services/firebase';

export default function FollowerProfile({
  userId,
  userDocId,
  profileUserName,
  profileFullName,
  profileDocId,
  profileId,
  isFollowing,
  setProfileCount,
  isLoggedInUser
}) {
  const [isUserFollowing, setFollowed] = useState(isFollowing);
  const [show, setShow] = useState(true);

  async function handleFollowUser() {
    setFollowed(true);
    setProfileCount((prevCount) => ({
      ...prevCount,
      followingCount: prevCount.followingCount + 1
    }));
    await updateProfileFollowers(profileDocId, userId, false);
    await updateUserFollowing(userDocId, profileId, false);
  }

  async function handleRemoveUser() {
    setShow(false);
    setProfileCount((prevCount) => ({ ...prevCount, followerCount: prevCount.followerCount - 1 }));
    await updateProfileFollowers(userDocId, profileId, true);
    await updateUserFollowing(profileDocId, userId, true);
  }

  return !show ? null : (
    <div className="group flex flex-col">
      <div className="flex flex-col py-2 mx-16 md:flex-row items-start md:items-center align-items justify-between">
        <div className="flex items-center justify-between">
          <Link to={`/p/${profileUserName}`}>
            <img
              className="rounded-full w-12 h-12 flex mr-3"
              src={`/images/avatars/${profileUserName}.jpg`}
              alt=""
              onError={(e) => {
                e.target.src = DEFAULT_IMG_SRC;
              }}
            />
          </Link>
          <div className="flex flex-col">
            <span className="flex flex-row">
              <p className="font-bold text-sm mb-4 pr-2 self-center md:mb-0">{profileUserName}</p>
              {!isUserFollowing && isLoggedInUser ? (
                <>
                  <p className="pr-2">•</p>
                  <button
                    className="font-bold text-sm text-blue-active hover:text-blue-medium mb-4 md:mb-0"
                    type="button"
                    onClick={handleFollowUser}
                  >
                    Follow
                  </button>
                </>
              ) : null}
            </span>
            <p className="text-sm mb-4 md:mb-0">{profileFullName}</p>
          </div>
        </div>
        {isLoggedInUser ? (
          <button
            className="text-xs font-bold bg-gray-normal hover:bg-gray-primary px-4 py-2 border-none rounded-md ml-12 md:ml-0 -mt-4 md:mt-0"
            type="button"
            onClick={handleRemoveUser}
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}

FollowerProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  userDocId: PropTypes.string.isRequired,
  profileUserName: PropTypes.string.isRequired,
  profileFullName: PropTypes.string.isRequired,
  profileDocId: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  setProfileCount: PropTypes.func.isRequired,
  isLoggedInUser: PropTypes.bool.isRequired
};
