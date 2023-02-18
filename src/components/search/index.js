import { useState, useEffect } from 'react';
import { searchUserByUsername } from '../../services/firebase';
import SearchedProfile from './searched_profile';

export default function SearchBar() {
  const [searchText, setSearchText] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);

  const handleSearchInput = ({ target }) => {
    // setMatchedUsers([]);
    setSearchText(target.value);
  };

  const handleClear = (event) => {
    event.preventDefault();
    setSearchText('');
  };

  useEffect(() => {
    const handleSearch = async () => {
      // event.preventDefault();
      const profiles = await searchUserByUsername(searchText);
      setMatchedUsers(profiles);
    };
    if (searchText.length > 0) handleSearch();
  }, [searchText]);

  return (
    <div className="text-gray-700 my-2 w-[30rem] border border-gray-primary rounded-xl">
      <form
        className="flex items-center justify-between pr-2"
        method="POST"
        // onSubmit={(event) => (searchText.length > 0 ? handleSearch(event) : event.preventDefault())}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 ml-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>

        <input
          aria-label="Search"
          autoComplete="off"
          className="text-sm text-gray-base my-1 w-full h-8 ml-2 mr-3 px-4 rounded-md"
          type="text"
          name="search-user"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchInput}
        />

        {searchText.length > 0 && (
          <svg
            onClick={handleClear}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleClear(event);
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </form>
      {searchText.length > 0 &&
        (matchedUsers.length > 0 ? (
          matchedUsers.map((profile, index) => (
            <SearchedProfile key={profile.docId} index={index} username={profile.username} />
          ))
        ) : (
          <p className="w-full h-14 p-4 bg-white text-gray-base z-10 relative border-x border-b border-gray-primary">
            Searching...
          </p>
        ))}
    </div>
  );
}
