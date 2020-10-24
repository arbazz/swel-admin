import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyD64TYHjmxLTzzUX2IUMqO4y2iXt0l3swo",
  authDomain: "swel-945a5.firebaseapp.com",
  databaseURL: "https://swel-945a5.firebaseio.com",
  projectId: "swel-945a5",
  storageBucket: "swel-945a5.appspot.com",
  messagingSenderId: "1006499806107",
  appId: "1:1006499806107:web:d5362e32399c73b6efbf3e",
  measurementId: "G-MJ572GLNB3"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;
