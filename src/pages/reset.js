import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import * as ROUTES from '../constants/routes';
import { doesEmailAddressExist } from '../services/firebase';

export default function Reset() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isValidEmail, setEmailValidity] = useState(false);
  const isInvalid = email === '';
  const [error, setError] = useState(null);

  const handleResetPwd = async (event) => {
    event.preventDefault();

    const isEmailValid = await doesEmailAddressExist(email);
    if (isEmailValid) {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setEmailValidity(true);
          setTimeout(() => {
            navigate(ROUTES.LOGIN);
          }, 3000);
        })
        .catch((err) => {
          setEmail('');
          setError(err);
          console.error(err);
        });
    } else {
      setEmailValidity(false);
      setError('This email address does not exist! Please enter again!');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-undef
    document.title = 'Reset - Snapper';
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5 justify-end">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram on it"
          className="max-h-96"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img src="/images/logo.png" alt="Instagram" className="mt-2 w-6/12 mb-4" />
          </h1>
          {error && <p className="mb-4 text-xs text-center text-red-primary">{error}</p>}
          {isValidEmail && (
            <p className="mb-4 text-sm text-green-primary font-bold">
              Reset instructions sent to your email!
            </p>
          )}
          <form onSubmit={handleResetPwd} method="POST">
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Enter your email address"
              className={`text-sm text-gray-base w-full mr-3 py-5 px-5 h-2 
               border ${
                 !isValidEmail ? 'border-gray-primary' : 'border-green-primary'
               } rounded mb-4`}
              onChange={({ target }) => setEmail(target.value)}
              value={email}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${
                isInvalid && 'opacity-50'
              }
            `}
            >
              Reset Password
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full by-white p-4 border border-gray-primary rounded">
          <p className="text-sm">
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium">
              <span className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                {`  Go Back to Login`}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
