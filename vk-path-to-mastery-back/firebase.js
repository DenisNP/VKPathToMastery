const firebase = require('firebase');
const COLLECTION = 'users';

const init = () => {
    const initString = process.env.VK_PATH_TO_MASTERY_FIREBASE;
    if (!initString) {
        console.error('Firebase initialization error: no environment variable');
    } else {
        const initParameters = JSON.parse(initString);
        console.log(`Firebase init parameters succeeded: ${initParameters.projectId}`);

        firebase.initializeApp(initParameters);
    }
};

const save = async (id, data) => {
    const db = firebase.firestore();
    await db.collection(COLLECTION).doc(id).set(data);
};

module.exports = {
    init,
    save,
};