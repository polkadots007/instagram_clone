import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_IMG_SRC } from '../../constants/paths';
import { toggleFollow } from '../../services/firebase';

export default function FollowingProfile({
  userId,
  userDocId,
  profileUserName,
  profileFullName,
  profileDocId,
  profileId,
  setProfileCount,
  isLoggedInUser
}) {
  const [isFollowing, setIsFollowing] = useState(true);
  async function handleFollowUser() {
    setIsFollowing((isFollowing) => !isFollowing);
    setProfileCount((prevCount) => ({
      ...prevCount,
      followingCount: isFollowing ? prevCount.followingCount - 1 : prevCount.followingCount + 1
    }));
    await toggleFollow(isFollowing, userDocId, profileDocId, profileId, userId);
  }

  return (
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
            </span>
            <p className="text-sm mb-4 md:mb-0">{profileFullName}</p>
          </div>
        </div>
        {isLoggedInUser ? (
          <button
            className={`text-xs font-bold ${
              isFollowing
                ? 'bg-gray-normal hover:bg-gray-primary'
                : 'text-white bg-blue-active hover:bg-blue-medium'
            }  py-2 px-4 border-none rounded-md ml-12 md:ml-0 -mt-4 md:mt-0`}
            type="button"
            onClick={handleFollowUser}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        ) : null}
      </div>
    </div>
  );
}

FollowingProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  userDocId: PropTypes.string.isRequired,
  profileUserName: PropTypes.string.isRequired,
  profileFullName: PropTypes.string.isRequired,
  profileDocId: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  setProfileCount: PropTypes.func.isRequired,
  isLoggedInUser: PropTypes.bool.isRequired
};
