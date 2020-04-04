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

const save = async (id, data) => {
    const db = firebase.firestore();
    await db.collection(COLLECTION).doc(id).set({...data, hash: hash(id)});
};

const hash = (userId) => {
    return crypto
        .createHash('sha256')
        .update(`${userId}_${initParameters.secretForHash}`)
        .digest('base64');
};

module.exports = {
    init,
    save,
};