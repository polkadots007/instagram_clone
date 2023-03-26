import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import useUser from '../../hooks/use_user';
import About from './about';
import { DEFAULT_IMG_SRC } from '../../constants/paths';
import { toggleFollow, isUserFollowingProfile } from '../../services/firebase';

export default function Header({
  photosCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    username: profileUserName,
    bio: userBio,
    fullName,
    followers = [],
    following = []
  },
  followerCount,
  followingCount,
  setFollowerCount
}) {
  const { user } = useUser();
  const navigate = useNavigate();
  const loggedInUsername = user?.username;
  const [isFollowingProfile, setIsFollowingProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const [newUsrnmloggedIn, setNewUsrnmLogInStatus] = useState(false);
  const activeBtnFollow = loggedInUsername && profileUserName !== loggedInUsername;
  const isLoggedInUser = loggedInUsername && profileUserName === loggedInUsername;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleOpenAbout = () => {
    setOpen(true);
  };

  const handleCloseAbout = (e, newUsername, onlyReloadFlag) => {
    setOpen(false);
    if (newUsername && newUsername.length > 0) {
      setNewUsrnmLogInStatus(true);
      navigate(`/p/${newUsername}`);
      window.location.reload();
    } else if (onlyReloadFlag) {
      window.location.reload();
    }
  };

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1
    });
    await toggleFollow(isFollowingProfile, user.docId, profileDocId, profileUserId, user.userId);
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(user.username, profileUserId);
      setIsFollowingProfile(isFollowing);
    };
    if (user?.username && profileUserId) isLoggedInUserFollowingProfile();
  }, [user?.username, profileUserId]);

  return !profileUserName ? (
    <Skeleton count={1} width="100%" height={200} />
  ) : (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto">
      <div className="container flex justify-center">
        <img
          className="rounded-full h-40 w-40  flex"
          alt={`${profileUserName} profile`}
          src={`/images/avatars/${profileUserName}.jpg`}
          onError={(e) => {
            e.target.src = DEFAULT_IMG_SRC;
          }}
        />
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profileUserName}</p>
          {(isLoggedInUser || newUsrnmloggedIn) && (
            <button
              className="bg-gray-normal hover:bg-gray-primary font-bold text-sm rounded-md px-2 h-8"
              type="button"
              onClick={handleOpenAbout}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleOpenAbout();
              }}
            >
              Edit Profile
            </button>
          )}
          {activeBtnFollow && isFollowingProfile === null ? (
            <Skeleton count={1} width={80} height={32} />
          ) : (
            activeBtnFollow &&
            !newUsrnmloggedIn && (
              <button
                className={`font-bold text-sm rounded-md w-20 h-8
                ${
                  isFollowingProfile
                    ? 'bg-gray-normal hover:bg-gray-primary'
                    : 'bg-blue-active hover:bg-blue-medium text-white'
                }`}
                type="button"
                onClick={handleToggleFollow}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleToggleFollow();
                }}
              >
                {isFollowingProfile ? 'Following' : 'Follow'}
              </button>
            )
          )}
        </div>
        <div className="container flex mt-4">
          {followers === undefined || following === undefined ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">{photosCount}</span> Photos
              </p>
              <p className="mr-10 cursor-pointer">
                <Link to={`/p/${profileUserName}/followers`}>
                  <span className="font-bold">{followerCount}</span>
                  {` `}
                  {followerCount === 1 ? `Follower` : `Followers`}
                </Link>
              </p>
              <p className="mr-10 cursor-pointer">
                <Link to={`/p/${profileUserName}/following`}>
                  <span className="font-bold">{followingCount}</span>
                  {` `}
                  Following
                </Link>
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!fullName ? <Skeleton count={1} height={24} width={677} /> : fullName}
          </p>
        </div>
        <div className="container max-h-[4rem] h-[4rem] text-ellipsis">
          <p className="max-w-[20rem]">{userBio}</p>
        </div>
      </div>
      <About
        fullScreen={fullScreen}
        open={open}
        handleClose={handleCloseAbout}
        profileUserName={profileUserName}
        profile={user}
      />
    </div>
  );
}

Header.propTypes = {
  photosCount: PropTypes.number.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
    bio: PropTypes.string,
    fullName: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array
  }).isRequired,
  followerCount: PropTypes.number.isRequired,
  followingCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired
};
