const firebase = require('firebase');
const crypto = require('crypto');
const COLLECTION = 'users';

let initParameters = {
    secretForHash: '',
};

const init = () => {
    const initString = process.env.VK_PATH_TO_MASTERY_FIREBASE;
    if (!initString) {
        console.error('Firebase initialization error: no environment variable');
    } else {
        initParameters = JSON.parse(initString);
        console.log(`Firebase init parameters succeeded: ${initParameters.projectId}`);
        firebase.initializeApp(initParameters);
    }
};

const save = async (userId, data, inputHash) => {
    const db = firebase.firestore();
    const h = inputHash || hash(userId);
    const newData = {...data, userId};
    await db.collection(COLLECTION).doc(h).set(newData);

    return newData;
};

const read = async (userId, defaultData) => {
    const db = firebase.firestore();
    const h = hash(userId);
    const docRef = await db.collection(COLLECTION).doc(h).get();

    if (docRef.exists) {
        return docRef.data();
    } else {
        return await save(userId, defaultData, h);
    }
};

const hash = (userId) => {
    return crypto
        .createHash('sha256')
        .update(`${userId}_${initParameters.secretForHash}`)
        .digest('hex')
        .toUpperCase();
};

module.exports = {
    init,
    save,
    read,
};