import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_IMG_SRC } from '../../constants/paths';
import { updateProfileFollowers, updateUserFollowing } from '../../services/firebase';

export default function SuggestedProfile({
  profileDocId,
  profileUsername,
  profileId,
  userId,
  userDocId
}) {
  const [followed, setFollowed] = useState(false);
  const [removeSuggestion, setRemoveSuggestion] = useState(false);

  async function handleFollowUser() {
    setFollowed(true);

    await updateProfileFollowers(profileDocId, userId, false);
    await updateUserFollowing(userDocId, profileId, false);
  }

  function handleRemoveProfile() {
    setRemoveSuggestion(true);
  }

  return !followed && !removeSuggestion ? (
    <div className="group flex flex-col">
      <div
        className="invisible group-hover:visible cursor-pointer w-0.5 h-0.5 scale-50 self-end pb-3 pr-4"
        onClick={handleRemoveProfile}
        role="presentation"
        title="Remove from Suggestions"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center align-items justify-between">
        <Link to={`/p/${profileUsername}`} className="flex items-center justify-between">
          <img
            className="rounded-full w-8 h-8 flex mr-3"
            src={`/images/avatars/${profileUsername}.jpg`}
            alt=""
            onError={(e) => {
              e.target.src = DEFAULT_IMG_SRC;
            }}
          />
          <p className="font-bold text-sm mb-4 md:mb-0">{profileUsername}</p>
        </Link>
        <button
          className="text-xs font-bold text-blue-active hover:text-blue-medium ml-12 md:ml-0 -mt-4 md:mt-0"
          type="button"
          onClick={handleFollowUser}
        >
          Follow
        </button>
      </div>
    </div>
  ) : null;
}

SuggestedProfile.propTypes = {
  profileDocId: PropTypes.string.isRequired,
  profileUsername: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  userDocId: PropTypes.string.isRequired
};
