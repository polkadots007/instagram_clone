/* eslint-disable no-nested-ternary */
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import PropTypes from 'prop-types';
import Post from './post';

export default function SelectedPost({ photo }) {
  return (
    <div className="container col-span-2 ml-2">
      {!photo ? (
        <Skeleton count={4} width={640} height={500} className="block mb-5" />
      ) : (
        <div className="mx-12">
          <Post content={photo} expandAllComments />
        </div>
      )}
    </div>
  );
}

SelectedPost.propTypes = {
  photo: PropTypes.object.isRequired
};
