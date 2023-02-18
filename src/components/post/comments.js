import { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import AddComment from './add_comment';

export default function Comments({ docId, comments: allComments, posted, commentInput }) {
  const [comments, setComments] = useState(allComments);
  const [noOfComments, setNoOfComments] = useState(3);

  function increaseCommentsByView() {
    setNoOfComments((curComments) => curComments + 3);
  }

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.length >= 3 && noOfComments < comments.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer"
            type="button"
            onClick={increaseCommentsByView}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                increaseCommentsByView();
              }
            }}
          >
            View more comments
          </button>
        )}
        {comments.slice(0, noOfComments).map((item) => (
          <p key={`${item.comment}-${item.displayName}`} className="mb-1">
            <Link to={`/p/${item.displayName}`}>
              <span className="mr-1 font-bold">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>
          </p>
        ))}
        <p className="text-gray-base uppercase text-xs mt-2">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.number.isRequired,
  commentInput: PropTypes.object.isRequired
};
