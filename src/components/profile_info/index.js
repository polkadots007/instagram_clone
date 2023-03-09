import PropTypes from 'prop-types';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Followers from './followers';
import Following from './following';

export default function UserInfo({ user, isLoggedInUser }) {
  const { username } = useParams();
  const { pathname } = useLocation();
  const [selectedPage, setSelectedPage] = useState(null);
  const [profileCount, setProfileCount] = useState({
    followerCount: user.followers.length,
    followingCount: user.following.length
  });

  useEffect(() => {
    if (pathname.includes(username)) setSelectedPage(pathname.split(`${username}/`)[1]);
  }, [pathname]);

  return (
    <>
      <div className="flex">
        <div
          className={`w-[50%] py-4 text-center ${
            selectedPage === 'followers' && 'border-b border-black-light'
          }`}
        >
          <Link to={`/p/${user.username}/followers`}>
            <span className="font-bold cursor-pointer">
              {profileCount.followerCount}
              {` `}
              {profileCount.followerCount === 1 ? `Follower` : `Followers`}
            </span>
          </Link>
        </div>
        <div
          className={`w-[50%] py-4 text-center ${
            selectedPage === 'following' && 'border-b border-black-light'
          }`}
        >
          <Link to={`/p/${user.username}/following`} className="w-[50%]">
            <span className="font-bold cursor-pointer">
              {profileCount.followingCount}
              {` `}
              Following
            </span>
          </Link>
        </div>
      </div>
      <div className="mt-3">
        {selectedPage === 'following' ? (
          <Following
            username={user.username}
            userId={user.userId}
            userDocId={user.docId}
            following={user.following}
            setProfileCount={setProfileCount}
            isLoggedInUser={isLoggedInUser}
          />
        ) : (
          selectedPage === 'followers' && (
            <Followers
              username={user.username}
              userId={user.userId}
              userDocId={user.docId}
              followers={user.followers}
              following={user.following}
              setProfileCount={setProfileCount}
              isLoggedInUser={isLoggedInUser}
            />
          )
        )}
      </div>
    </>
  );
}

UserInfo.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
    followers: PropTypes.array.isRequired,
    following: PropTypes.array.isRequired,
    fullName: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    docId: PropTypes.string.isRequired,
    dateCreated: PropTypes.number.isRequired
  }).isRequired,
  isLoggedInUser: PropTypes.bool.isRequired
};
