import useUser from '../../hooks/use_user';
import User from './user';
import Suggestions from './suggestions';

export default function Sidebar() {
  const {
    user: { docId, fullName, username, userId, following }
  } = useUser();

  return (
    <div className="p-4">
      <User username={username} fullName={fullName} />
      <Suggestions userId={userId} docId={docId} following={following} />
    </div>
  );
}

// Sidebar.whyDidYouRender = true;
