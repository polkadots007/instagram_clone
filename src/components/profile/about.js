/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DialogTitle from '@mui/material/DialogTitle';
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { Tooltip } from '@mui/material';
import useUser from '../../hooks/use_user';
import { updateUserInfo, doesUsernameExist, doesEmailAddressExist } from '../../services/firebase';
import { DEFAULT_IMG_SRC } from '../../constants/paths';

export default function About({ fullScreen, open, handleClose, profileUserName, profile }) {
  const [profileInfo, setProfileInfo] = useState({
    name: profile.fullName,
    username: profile.username,
    bio: profile.bio || '',
    email: profile.emailAddress
  });
  const [error, setError] = useState(null);
  const [isSaveClicked, setSaveClicked] = useState(false);
  const reloadPage = true;
  const { user: userDetails } = useUser();

  function dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  const isEditAllowed = {
    username: userDetails?.usernameModified
      ? dateDiffInDays(new Date(userDetails?.usernameModified), new Date()) >= 14
      : true,
    email: userDetails?.emailModified
      ? dateDiffInDays(new Date(userDetails?.emailModified), new Date()) >= 14
      : true
  };

  const noEditUsernameMsg = 'Username can not be changed multiple times within 14 days';
  const noEditEmailMsg = 'Email can not be changed multiple times within 14 days';

  const handleChange = ({ target }, fieldType) => {
    setProfileInfo((prevInfo) => ({ ...prevInfo, [fieldType]: target.value }));
  };

  const handleCancel = () => {
    setProfileInfo({
      name: profile.fullName,
      username: profile.username,
      bio: profile.bio || '',
      email: profile.emailAddress
    });
    setError(null);
    setSaveClicked(false);
    handleClose();
  };

  const handleSaveClose = () => {
    if (!error) {
      handleClose(
        null,
        profileInfo.username !== profile.username ? profileInfo.username : null,
        profileInfo.username !== profile.username ? !reloadPage : reloadPage
      );
    }
    setSaveClicked(false);
  };

  const handleSave = async () => {
    setSaveClicked(true);
    const requestChange = {};
    if (profileInfo.email !== profile.emailAddress && (!error || !error?.email)) {
      const auth = getAuth();
      updateEmail(auth.currentUser, profileInfo.email)
        .then(() => {
          requestChange.emailModified = Date.now();
          console.info('Success');
        })
        .catch((error) => {
          setError((errors) => ({
            ...errors,
            email: 'Firebase Error, Please check console for more details.'
          }));
          console.error(error);
        });
    }
    if (profileInfo.name !== profile.fullName) {
      requestChange.fullName = profileInfo.name;
      requestChange.fullNameModified = Date.now();
    }
    if (profileInfo.username !== profile.username && (!error || !error?.username)) {
      requestChange.username = profileInfo.username;
      requestChange.usernameModified = Date.now();
      const auth = getAuth();
      updateProfile(auth.currentUser, {
        displayName: profileInfo.username
      })
        .then(() => {
          console.info('Success');
        })
        .catch((error) => {
          setError((errors) => ({
            ...errors,
            username: 'Firebase Error, Please check console for more details.'
          }));
          console.error(error);
        });
    }
    if (profileInfo.bio !== profile.bio) {
      requestChange.bio = profileInfo.bio;
    }
    if (Object.values(requestChange).length > 0) {
      await updateUserInfo(profile.docId, requestChange);
      handleSaveClose();
    }
  };
  useEffect(() => {
    async function verifyChange() {
      const isUsernameDiff = profileInfo.username !== profile.username;
      const isEmailDiff = profileInfo.email !== profile.emailAddress;
      if (isUsernameDiff) {
        const flag = await doesUsernameExist(profileInfo.username);
        if (flag) setError((error) => ({ ...error, username: 'Username already exists!' }));
      }
      if (isEmailDiff) {
        const flag = await doesEmailAddressExist(profileInfo.email);
        if (flag) setError((error) => ({ ...error, email: 'Email Address already exists!' }));
      }
      if (!isUsernameDiff && !isEmailDiff) {
        setError(null);
      }
    }
    verifyChange();
  }, [profileInfo]);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title" className="text-center w-[calc(100vw*0.6)]">
        About
      </DialogTitle>
      <DialogContent>
        <div className="container w-full flex items-center justify-center mb-6">
          <img
            className="rounded-full h-10 w-10 flex"
            alt={`${profileUserName} profile`}
            src={`/images/avatars/${profileUserName}.jpg`}
            onError={(e) => {
              e.target.src = DEFAULT_IMG_SRC;
            }}
          />
          <p className="pl-2 text-black-light">{profileUserName}</p>
        </div>
        <div className="flex flex-col w-full items-center justify-between pr-2">
          <div className="container flex flex-col md:flex-row md:items-center justify-between mb-4">
            <p className="font-bold basis-20 shrink-0 h-8 lg:text-right text-black-light mx-2">
              Name
            </p>
            <input
              aria-label="Name"
              autoComplete="off"
              className="text-sm basis-80 grow shrink-0 h-8 text-gray-base mr-3 px-4 border border-gray-primary rounded-md focus:outline-none"
              type="text"
              name="name"
              placeholder="Type your name"
              value={profileInfo.name}
              onChange={(e) => handleChange(e, 'name')}
            />
          </div>
          <div className="container flex flex-col md:flex-row md:items-center justify-between mb-4">
            <p className="font-bold basis-20 shrink-0 lg:text-right text-black-light mx-2">
              Username
            </p>
            <input
              aria-label="Username"
              autoComplete="off"
              className={`text-sm lg:basis-80 grow shrink-0 h-8 text-gray-base mr-3 px-4 border ${
                error?.username ? 'border-red-primary' : 'border-gray-primary'
              } rounded-md focus:outline-none`}
              type="text"
              name="username"
              disabled={!isEditAllowed?.username}
              placeholder="Type your favourite handle"
              value={profileInfo.username}
              onChange={(e) => handleChange(e, 'username')}
            />
            {isEditAllowed && !isEditAllowed?.username && (
              <Tooltip title={noEditUsernameMsg || ' '}>
                <ErrorOutlineIcon className="text-gray-primary scale-70" />
              </Tooltip>
            )}
            {error?.username && (
              <Tooltip title={error?.username}>
                <ErrorOutlineIcon className="text-red-primary" />
              </Tooltip>
            )}
          </div>
          <div className="container flex flex-col md:flex-row md:items-center justify-between mb-4">
            <p className="font-bold basis-20 shrink-0 lg:text-right text-black-light mx-2 self-start">
              Bio
            </p>
            <div className="flex flex-col lg:basis-80 grow shrink-0 self-start">
              <textarea
                aria-label="Bio"
                autoComplete="off"
                className="text-sm text-gray-base h-20 mr-3 px-4 py-1 border border-gray-primary rounded-md focus:outline-none"
                type="text"
                maxLength={150}
                name="bio"
                placeholder="What are you like?"
                value={profileInfo.bio}
                onChange={(e) => handleChange(e, 'bio')}
              />
              <p className="text-gray-primary text-sm mt-1 ml-1">{profileInfo.bio.length}/150</p>
            </div>
          </div>
          <div className="container flex flex-col md:flex-row md:items-center justify-between mb-4">
            <p className="font-bold basis-20 shrink-0 lg:text-right text-black-light mx-2">Email</p>
            <input
              aria-label="Email"
              autoComplete="off"
              className={`text-sm lg:basis-80 grow shrink-0 text-gray-base h-8 mr-3 px-4 border ${
                error?.email ? 'border-red-primary' : 'border-gray-primary'
              } rounded-md focus:outline-none`}
              type="text"
              name="email"
              disabled={!isEditAllowed?.email}
              // placeholder="Type junmyeon..."
              value={profileInfo.email}
              onChange={(e) => handleChange(e, 'email')}
            />
            {isEditAllowed && !isEditAllowed?.email && (
              <Tooltip title={noEditEmailMsg || ' '}>
                <ErrorOutlineIcon className="text-gray-primary scale-70" />
              </Tooltip>
            )}
            {error?.email && (
              <Tooltip title={error?.email}>
                <ErrorOutlineIcon className="text-red-primary" />
              </Tooltip>
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} autoFocus>
          {isSaveClicked ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

About.propTypes = {
  fullScreen: PropTypes.bool,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  profileUserName: PropTypes.string.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
    bio: PropTypes.string,
    fullName: PropTypes.string,
    emailAddress: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array
  }).isRequired
};
