import firebase from './index';

export default function addAlbum(title,image, album, audio, albumName, artistName, artist, genreName, genre){
    var db = firebase.firestore();
    return new Promise((res) => {
        db.collection("Songs").add({
            image,
            title,
            album,
            audio,
            albumName,
            artistName,
            artist,
            genreName,
            genre
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