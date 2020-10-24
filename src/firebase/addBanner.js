import firebase from './index';

export default function addBanner(image, title, link, linkName, type) {
    var db = firebase.firestore();
    return new Promise((res) => {
        db.collection("Banner").add({
            image,
            title,
            link,
            linkName,
            type
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