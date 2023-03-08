import { useState, useEffect } from 'react';
import { searchUserByUsername } from '../../services/firebase';
import SearchedProfile from './searched_profile';
import useComponentVisible from '../../hooks/use_comp_visible';

export default function SearchBar() {
  const [searchText, setSearchText] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);
  const { ref, isComponentVisible } = useComponentVisible(true);

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

  useEffect(() => {
    if (!isComponentVisible) setSearchText('');
  }, [isComponentVisible]);

  return (
    <div className="self-center w-[30rem]">
      <div
        className={`text-gray-700 py-2 flex flex-col items-center justify-center border border-gray-primary
         focus-within:border-blue-active focus-within:border-[1.5px] ${
           searchText.length > 0 ? 'rounded-t-xl' : 'rounded-xl'
         }`}
      >
        <form
          className="flex items-center justify-between w-full pr-2"
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
            className="text-sm text-gray-base w-full h-8 ml-2 mr-3 px-4 rounded-md focus:outline-none"
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
      </div>
      <div className="absolute w-[30rem]">
        {searchText.length > 0 &&
          isComponentVisible &&
          (matchedUsers.length > 0 ? (
            matchedUsers.map((profile, index) => (
              <SearchedProfile
                key={profile.docId}
                visRef={ref}
                index={index}
                username={profile.username}
              />
            ))
          ) : (
            <p className="w-full h-14 p-4 bg-white text-gray-base z-10 relative border-x border-b border-gray-primary">
              Searching...
            </p>
          ))}
      </div>
    </div>
  );
}
