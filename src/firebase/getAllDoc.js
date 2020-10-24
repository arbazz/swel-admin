import firebase from './index';

export default function getAllDoc(coll) {
    var db = firebase.firestore();
    let temp = [];
    return new Promise((resolve) => {
        db.collection(coll)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    temp.push({ docId: doc.id, docData: doc.data() });
                });
                resolve(temp);
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
                resolve(temp);
            });
    })
}