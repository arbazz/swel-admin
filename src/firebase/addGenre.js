import firebase from './index';

export default function addGenre(title,image){
    var db = firebase.firestore();
    return new Promise((res) => {
        db.collection("Genre").add({
            image,
            title
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            res(true);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            res(false);
        });
    })
    
}