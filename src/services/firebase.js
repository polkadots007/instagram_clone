import { firebase, FieldValue } from '../lib/firebase';

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username.toLowerCase())
    .get();

  return result.docs.map((user) => user.data().length > 0).length > 0;
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username.toLowerCase())
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));
}

export async function searchUserByUsername(searchTerm) {
  const result = await firebase
    .firestore()
    .collection('users')
    // .where('username', '==', searchTerm.toLowerCase())
    .get();

  const profiles = result.docs
    .map((item) => ({
      ...item.data(),
      docId: item.id
    }))
    .filter((item) => item.username.includes(searchTerm.toLowerCase()));
  return profiles.length > 0 ? profiles : [{ docId: 0, username: 'No results found' }];
}

export async function getUserByUserId(userId) {
  const result = await firebase.firestore().collection('users').where('userId', '==', userId).get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));
  return user;
}

export async function getSuggestedProfiles(userId, following) {
  const result = await firebase.firestore().collection('users').limit(10).get();
  return result.docs
    .map((user) => ({
      ...user.data(),
      docId: user.id
    }))
    .filter((profile) => profile.userId !== userId && !following.includes(profile.userId));
}

export async function updateProfileFollowers(profileDocId, loggedInUserId, isFollowingProfile) {
  return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: !isFollowingProfile
        ? FieldValue.arrayUnion(loggedInUserId)
        : FieldValue.arrayRemove(loggedInUserId)
    })
    .then((_) => console.info('Success'))
    .catch((error) => {
      console.error('Error adding followers', error);
    });
}

export async function updateUserFollowing(loggedInUserDocId, followerId, isFollowingProfile) {
  return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: !isFollowingProfile
        ? FieldValue.arrayUnion(followerId)
        : FieldValue.arrayRemove(followerId)
    })
    .then((_) => console.info('Success'))
    .catch((error) => {
      console.error('Error adding following', error);
    });
}

export async function getPhotosByIds(userId, followingIds) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', followingIds)
    .get();

  const profilePhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id
  }));

  const photosWithUserDetails = await Promise.all(
    profilePhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId, loggedInUserId) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', '==', userId)
    .get();

  // const photos = result.docs.map((photo) => ({
  //   ...photo.data(),
  //   docId: photo.id
  // }));

  const photos = result.docs.map((photo) => {
    let userLikedPhoto = false;
    if (photo?.data().likes?.includes(loggedInUserId)) {
      userLikedPhoto = true;
    }
    return {
      ...photo.data(),
      userLikedPhoto,
      docId: photo.id
    };
  });

  return photos;
}

export async function isUserFollowingProfile(loggedInUsername, profileUserId) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', loggedInUsername.toLowerCase())
    .where('following', 'array-contains', profileUserId)
    .get();
  const response = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return response.length > 0;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  await updateUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);
  await updateProfileFollowers(profileDocId, followingUserId, isFollowingProfile);
}
