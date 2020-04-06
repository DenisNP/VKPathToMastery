const firebase = require('./firebase');

const defaultState = {
    paths: {
        first: {
            name: '',
            icon: '',
            color: 0,
            days: [],
            done: [],
        },
        second: {
            name: '',
            icon: '',
            color: 0,
            days: [],
            done: [],
        },
        third: {
            name: '',
            icon: '',
            color: 0,
            days: [],
            done: [],
        },
    },
    archive: [],
};

const init = () => {
    firebase.init();
};

const getUser = async (userId) => {
    return await firebase.read(userId, defaultState);
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

    // validate data
    if (!Object.prototype.hasOwnProperty.call(user.paths, pathName)) return user;
    if (!user.paths[pathName].name) return user;
    const offset = Number.parseInt(timezoneOffset);
    if (Number.isNaN(offset) || offset < -720 || offset > 840) return user;

    // create new date
    let date = new Date();
    const serverOffset = -date.getTimezoneOffset();
    const newDifference = (offset - serverOffset) * 60000;

    // move to server timezone
    date = new Date(date.getTime() + newDifference);
    date.setHours(0, 0, 0, 0);

    let dow = dayOfWeek(date);
    const days = user.paths[pathName].days;
    if (!user.paths[pathName].days.includes(dow)) return user;

    // move to user timezone
    const userDate = new Date(date.getTime() - newDifference);
    const userTimestamp = userDate.getTime();

    // add new timestamp
    const done = user.paths[pathName].done;
    const prevTs = done.length > 0 ? done[done.length - 1] : null;
    if (prevTs !== null && prevTs.ts >= userTimestamp) return user;

    const prevDate = new Date(prevTs.ts + newDifference);
    const prevDow = dayOfWeek(prevDate);

    // check if days in chain
    const prevIndex = days.indexOf(prevDow);
    const nextIndex = days.indexOf(dow);
    const dontBreak = prevIndex === nextIndex - 1 || (prevIndex === days.length - 1 && nextIndex === 0);

    if (userTimestamp - prevTs.ts > 7 * 24 * 3600000) return user;

    // create new done object
    const newDone = {
        ts: userTimestamp,
    };
    if (!dontBreak) {
        newDone.broken = true;
    }
    done.push(newDone);

    return await firebase.save(userId, user);
};

const writePath = (newPath, userPath) => {
    if (!newPath.name || !newPath.icon || !newPath.days || newPath.days.length === 0) return;
    if (newPath.name.length > 140 || newPath.icon.length > 1) return;
    if (!newPath.days.every(checkDay)) return;
    const newColor = Number.parseInt(newPath.color);
    if (Number.isNaN(newColor) || newColor < 0 || newColor > 360) return;

    userPath.name = newPath.name;
    userPath.icon = newPath.icon;
    userPath.color = newColor;
    userPath.days = [...new Set(newPath.days)].sort();
};

const checkDay = (n) => {
    const parsedNum = Number.parseInt(n);
    if (Number.isNaN(parsedNum)) return false;
    return parsedNum >= 0 && parsedNum <= 6;
};

const dayOfWeek = (date) => {
    let dayOfWeek = date.getDay() - 1;
    return dayOfWeek < 0 ? 6 : dayOfWeek;
};

module.exports = {
    init,
    createEditPath,
    deletePath,
    setDone,
    getUser,
};
