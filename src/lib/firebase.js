import Firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// import { seedDatabase } from '../seed';

const config = {
  apiKey: 'AIzaSyAis6eP1zjoY181j5a09f_XPxWMrxvqTgs',
  authDomain: 'instagram001-11aea.firebaseapp.com',
  projectId: 'instagram001-11aea',
  storageBucket: 'instagram001-11aea.appspot.com',
  messagingSenderId: '303950880313',
  appId: '1:303950880313:web:4c58b95882ad5fb5f677e8'
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

// We need to call seed file here ONCE!
// seedDatabase(firebase);

export { firebase, FieldValue };
