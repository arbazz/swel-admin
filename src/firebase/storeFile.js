import firebase from './index';
import { v4 as uuidv4 } from 'uuid';

export default async function storeFile(file) {
    const ref = firebase
        .storage()
        .ref()
        .child(`${uuidv4()}`);
    const snapshot = await ref.put(file);

    return await snapshot.ref.getDownloadURL();
}