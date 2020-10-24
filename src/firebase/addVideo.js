import firebase from './index';

export default function addVideo(title, image, video) {
    var db = firebase.firestore();
    return new Promise((res) => {
        db.collection("Videos").add({
            image,
            title,
            video
        })
            .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                res(true);
            })
            .catch(function (error) {
                console.error("Error adding document: ", error);
                res(false);
            });
    })

}