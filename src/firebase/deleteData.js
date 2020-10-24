import firebase from './index';

export default function deleteData(coll ,docId){
    return new Promise((resolve, reject) => {
        firebase.firestore().collection(coll).doc(docId).delete().then(function() {
            console.log("Document successfully deleted!");
            resolve("true")
        }).catch(function(error) {
            console.error("Error removing document: ", error);
            resolve("false")
        });
    })
}