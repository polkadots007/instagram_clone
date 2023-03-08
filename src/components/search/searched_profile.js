import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DEFAULT_IMG_SRC } from '../../constants/paths';

export default function SearchedProfile({ visRef, index, username }) {
  return (
    <div
      ref={visRef}
      className={`flex items-center justify-start w-full h-14 pt-4 mt-${
        index * 14
      } bg-white z-10 relative border-x last:border-b last:rounded border-gray-primary pb-2`}
    >
      {username !== 'No results found' ? (
        <Link
          to={`/p/${username}`}
          className="flex w-full p-2 hover:bg-blue-active rounded cursor-pointer"
        >
          <img
            className="rounded-full w-8 h-8 flex mr-3"
            src={`/images/avatars/${username}.jpg`}
            alt=""
            onError={(e) => {
              e.target.src = DEFAULT_IMG_SRC;
            }}
          />
          <p className="font-bold text-sm self-center">{username}</p>
        </Link>
      ) : (
        <p className="font-bold text-sm">{username}</p>
      )}
    </div>
  );
}

SearchedProfile.propTypes = {
  visRef: PropTypes.object,
  index: PropTypes.number,
  username: PropTypes.string.isRequired
};
