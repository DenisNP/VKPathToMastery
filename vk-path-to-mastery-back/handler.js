const firebase = require('./firebase');

const defaultState = {
    paths: {
        first: {
            name: '',
            icon: '',
            days: [],
            done: [],
        },
        second: {
            name: '',
            icon: '',
            days: [],
            done: [],
        },
        third: {
            name: '',
            icon: '',
            days: [],
            done: [],
        },
    },
    archive: [],
};

const init = () => {
    firebase.init();
};

const createEditPath = async (userId, data) => {
    const user = await firebase.read(userId, defaultState);
    if (data.first) writePath(data.first, user.paths.first);
    if (data.second) writePath(data.second, user.paths.second);
    if (data.third) writePath(data.third, user.paths.third);

    return await firebase.save(userId, user);
};

const deletePath = async (userId, data) => {
    const user = await firebase.read(userId, defaultState);
    const { pathName } = data;
    if (!Object.prototype.hasOwnProperty.call(user.paths, pathName)) return user;

    if (data.archive === true && user.paths[pathName].name) {
        user.archive.push(user.paths[pathName]);
    }

    user.paths[pathName] = Object.assign({}, defaultState.paths.first);
    return await firebase.save(userId, user);
};

const setDone = async (userId, data) => {
    const user = await firebase.read(userId, defaultState);
    const { pathName, timezoneOffset } = data;

    if (!Object.prototype.hasOwnProperty.call(user.paths, pathName)) return user;
    if (!user.paths[pathName].name) return user;
    const offset = Number.parseInt(timezoneOffset);
    if (Number.isNaN(offset) || offset < -720 || offset > 840) return user;

    let date = new Date();
    const serverOffset = -date.getTimezoneOffset();
    const newDifference = offset - serverOffset;

    date = new Date(date.getTime() + newDifference * 60000);

    let dayOfWeek = date.getDay() - 1;
    if (dayOfWeek < 0) dayOfWeek = 6;

    if (!user.paths[pathName].days.includes(dayOfWeek)) return user;

    const timestamp = date.getTime();
    user.paths[pathName].done.push(timestamp);

    return await firebase.save(userId, user);
};

const writePath = (newPath, userPath) => {
    if (!userPath.name || !userPath.icon || !userPath.days || userPath.days.length === 0) return;
    userPath.name = newPath.name;
    userPath.icon = newPath.icon;
    userPath.days = newPath.days;
};

module.exports = {
    init,
    createEditPath,
    deletePath,
    setDone,
};