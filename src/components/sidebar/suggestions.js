/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getSuggestedProfiles } from '../../services/firebase';
import SuggestedProfile from './suggested_profile';

export default function Suggestions({ userId, docId, following }) {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(userId, following);
      setProfiles(response);
    }
    if (userId) suggestedProfiles();
  }, [userId]);

  return !profiles ? (
    <Skeleton count={10} height={150} className="mt-5" />
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-bold text-gray-base text-center">Suggestions for you</p>
      </div>
      <div className="mt-2 grid gap-2">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            profileDocId={profile.docId}
            profileUsername={profile.username}
            profileId={profile.userId}
            userId={userId}
            userDocId={docId}
          />
        ))}
      </div>
    </div>
  ) : null;
}

Suggestions.propTypes = {
  userId: PropTypes.string,
  docId: PropTypes.string,
  following: PropTypes.array
};
