const firebase = require('./firebase');

const defaultState = {
    paths: {
        first: {
            name: '',
            icon: '',
            color: 0,
            days: [],
            done: [],
            nextCheckpoint: {
                ts: 0,
                id: -1,
            },
            nextDone: 0,
        },
        second: {
            name: '',
            icon: '',
            color: 0,
            days: [],
            done: [],
            nextCheckpoint: {
                ts: 0,
                id: -1,
            },
            nextDone: 0,
        },
        third: {
            name: '',
            icon: '',
            color: 0,
            days: [],
            done: [],
            nextCheckpoint: {
                ts: 0,
                id: -1,
            },
            nextDone: 0,
        },
    },
    nextDoneTotal: 0,
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
    const newUser = setDoneForUser(user, pathName, timezoneOffset);
    return await firebase.save(userId, newUser);
};

const generateDemo = async (userId, data) => {
    const user = await firebase.read(userId, defaultState);
    const newUser = generateDemoForUser(user, data.timezoneOffset);
    return await firebase.save(userId, newUser);
};

const generateDemoForUser = (user, timezoneOffset) => {
    // create new date
    let date = new Date();
    const serverOffset = -date.getTimezoneOffset();
    const newDifference = (timezoneOffset - serverOffset) * 60000;

    // move to server timezone
    date = new Date(date.getTime() + newDifference);
    date.setHours(0, 0, 0, 0);
    let dow = dayOfWeek(date);

    // first path create
    user.paths.first = Object.assign({}, defaultState.paths.first);
    writePath({ name: 'Езда на велосипеде', icon: '🚴‍♂️', days: [0,1,2,3,4,5,6], color: 0 }, user.paths.first);
    const now = (new Date()).getTime();
    const startFirst = now - 30 * 24 * 3600000;
    for (let t = startFirst; t <= now - 24 * 3600000; t += 24 * 3600000) {
        user = setDoneForUser(user, 'first', timezoneOffset, t);
    }

    // second path create
    const daysSecond = dow === 4 ? [1,3] : [2,4];
    user.paths.second = Object.assign({}, defaultState.paths.second);
    writePath({ name: 'Игра на гитаре', icon: '🎸', days: daysSecond, color: 77 }, user.paths.second);
    const startSecond = now - 21 * 24 * 3600000;
    let counter = 0;
    for (let tt = startSecond; tt <= now; tt += 24 * 3600000) {
        const sDate = new Date(tt + newDifference);
        sDate.setHours(0, 0, 0, 0);
        let sDow = dayOfWeek(sDate);
        if (daysSecond.includes(sDow)) {
            counter++;
            if (counter === 3) continue;
        }
        user = setDoneForUser(user, 'second', timezoneOffset, tt);
    }
    user.nextDoneTotal = 0;

    return user;
};

const setDoneForUser = (user, pathName, timezoneOffset, forceTimestamp) => {
    // validate data
    if (!Object.prototype.hasOwnProperty.call(user.paths, pathName)) return user;
    if (!user.paths[pathName].name) return user;
    const offset = Number.parseInt(timezoneOffset);
    if (Number.isNaN(offset) || offset < -720 || offset > 840) return user;

    // create new date
    let date = forceTimestamp ? new Date(forceTimestamp) : new Date();
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
    const newDone = {
        ts: userTimestamp,
    };

    if (prevTs !== null) {
        if (prevTs.ts >= userTimestamp) return user;

        const prevDate = new Date(prevTs.ts + newDifference);
        const prevDow = dayOfWeek(prevDate);

        // check if days in chain
        const prevIndex = days.indexOf(prevDow);
        const nextIndex = days.indexOf(dow);
        const dontBreak = (prevIndex === nextIndex - 1 || (prevIndex === days.length - 1 && nextIndex === 0))
            && userTimestamp - prevTs.ts <= 7 * 24 * 3600000;

        // modify done object
        if (!dontBreak) {
            newDone.start = true;
        }
    } else {
        newDone.start = true;
    }

    done.push(newDone);

    // set next done timestamp for notifications
    user.paths[pathName].nextDone = toDayOf(user.paths[pathName].days, date.getTime() + 24 * 3600000) - newDifference;
    const allDone = Object.values(user.paths).filter(p => p.nextDone > 0).map(p => p.nextDone);
    if (allDone.length > 0) {
        user.nextDoneTotal = Math.min(...allDone);
    } else {
        user.nextDoneTotal = 0;
    }

    // checkpoint
    const [cpId, nextCheckpoint] = getCheckpointId(user.paths[pathName], userDate, newDifference);
    if (cpId > 0) {
        newDone.checkpoint = cpId;
    }

    user.paths[pathName].nextCheckpoint = Object.assign({}, nextCheckpoint);
    return user;
};

const writePath = (newPath, userPath) => {
    if (!newPath.name || !newPath.icon || !newPath.days || newPath.days.length === 0) return;
    if (newPath.name.length > 30 || newPath.icon.length > 7) return;
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

const getCheckpointId = (path, date, difference) => {
    if (path.done.length === 0) return [-1, {ts:0,id:-1}];
    let startDay = null;
    for (let index = path.done.length - 1; index >= 0; index--) {
        if (path.done[index].start) {
            startDay = path.done[index];
            break;
        }
    }

    if (startDay === null) return [-1, {ts:0,id:-1}];
    const daysDifference = Math.floor((date.getTime() - startDay.ts) / (24 * 3600000));
    const checkpointsGot = new Set(path.done.filter(d => d.checkpoint > 0).map(d => d.checkpoint));

    const daysCount = path.days.length;
    let checkpointIndex = checkpoints.findIndex(
      cp => !checkpointsGot.has(cp.id)
        && cp.daysNeed.includes(daysCount)
    );

    if (checkpointIndex === -1) {
        return [-1, {ts:0,id:-1}];
    }

    let checkpoint = checkpoints[checkpointIndex];
    let checkpointId = -1;
    if (checkpoint.daysDone <= daysDifference) {
        checkpointId = checkpoint.id;
        checkpointIndex++;
        if (checkpointIndex > checkpoints.length - 1) {
            return [checkpointId, {ts:0,id:-1}];
        }
        checkpoint = checkpoints[checkpointIndex];
    }

    // find next checkpoint
    let nextCheckpointTs = startDay.ts + 24 * 3600000 * checkpoint.daysDone + difference;
    nextCheckpointTs = toDayOf(path.days, nextCheckpointTs) - difference;

    return [checkpointId, { ts: nextCheckpointTs, id: checkpoint.id }];
};

const toDayOf = (days, timestamp) => {
    const date = new Date(timestamp);
    const dow = dayOfWeek(date);
    let closestNext = days.find(d => d >= dow);
    if (closestNext === undefined) {
       closestNext = days[0];
    }

    if (closestNext < dow) closestNext += 7;
    return timestamp + 24 * 3600000 * (closestNext - dow);
};

const checkpoints = [
    {
        id: 1,
        daysNeed: [7],
        daysDone: 3,
    },
    {
        id: 2,
        daysNeed: [7, 6, 5],
        daysDone: 7,
    },
    {
        id: 3,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 14,
    },
    {
        id: 4,
        daysNeed: [6, 5, 4, 3, 2, 1],
        daysDone: 21,
    },
    {
        id: 5,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 30,
    },
    {
        id: 6,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 45,
    },
    {
        id: 7,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 60,
    },
    {
        id: 8,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 90,
    },
    {
        id: 9,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 120,
    },
    {
        id: 10,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 150,
    },
    {
        id: 11,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 180,
    },
    {
        id: 12,
        daysNeed: [4, 3, 2, 1],
        daysDone: 210,
    },
    {
        id: 13,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 240,
    },
    {
        id: 14,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 300,
    },
    {
        id: 15,
        daysNeed: [7, 6, 5, 4, 3, 2, 1],
        daysDone: 365,
    }
];

module.exports = {
    init,
    createEditPath,
    deletePath,
    setDone,
    getUser,
    generateDemo,
};
