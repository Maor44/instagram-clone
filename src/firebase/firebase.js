import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyByGNKZ1D3qZlwoTrKNqG_VtiVQ59D69cA',
  authDomain: 'instagram-clone-61f97.firebaseapp.com',
  databaseURL: 'https://instagram-clone-61f97.firebaseio.com',
  projectId: 'instagram-clone-61f97',
  storageBucket: 'instagram-clone-61f97.appspot.com',
  messagingSenderId: '494882958206',
  appId: '1:494882958206:web:2eb5dd395a8847fa82a12f',
});

const db = firebaseApp.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
 
export { db, storage, auth };
