/* eslint-disable no-nested-ternary */
import Skeleton from 'react-loading-skeleton';
import usePhotos from '../hooks/use_photos';
import 'react-loading-skeleton/dist/skeleton.css';
import Post from './post';

export default function Timeline() {
  const { photos } = usePhotos();
  return (
    <div className="container col-span-2 ml-2">
      {!photos ? (
        <Skeleton count={4} width={640} height={500} className="block mb-5" />
      ) : photos?.length > 0 ? (
        photos.map((content) => (
          <Post key={content.docId} content={content} expandAllComments={false} />
        ))
      ) : (
        <p className="text-center text-2xl">Follow some people to see photos!</p>
      )}
    </div>
  );
}
