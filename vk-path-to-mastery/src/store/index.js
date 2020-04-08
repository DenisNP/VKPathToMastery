import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const toMonday = (timestamp) => {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);

    let dayOfWeek = date.getDay() - 1;
    if (dayOfWeek < 0) dayOfWeek = 6;

    date.setDate(date.getDate() - dayOfWeek);
    return date.getTime();
};

const getDayObject = (paths, timestamp) => {
    const dayObject = {};
    Object.entries(paths).forEach(([pathName, path]) => {
        dayObject[pathName] = {
            prev: false,
            next: false,
            done: false,
            checkpoint: 0,
        };

        const dayIndex = path.done.findIndex((d) => d.ts >= timestamp);
        if (dayIndex !== -1) {
            let nextDay = path.done[dayIndex];
            if (nextDay.ts === timestamp) {
                dayObject[pathName].done = true;
                if (nextDay.checkpoint) dayObject[pathName].checkpoint = nextDay.checkpoint;
                dayObject[pathName].prev = !nextDay.start;
                nextDay = dayIndex + 1 < path.done.length ? path.done[dayIndex + 1] : null;
            } else {
                dayObject[pathName].prev = dayIndex > 0 && !nextDay.start;
            }

            dayObject[pathName].next = nextDay !== null
                && !nextDay.start
                && (dayObject[pathName].prev || dayObject[pathName].done);
        }
    });

    return dayObject;
};

const api = async (method, userId, data) => {
    const apiHost = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
    const address = `${apiHost}/${method}/${userId}`;

    try {
        const response = await fetch(address, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // noinspection UnnecessaryLocalVariableJS
        const content = await response.json();
        return content;
    } catch (e) {
        return null;
    }
};

export default new Vuex.Store({
    state: {
        user: {
            userId: '',
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
        },
        checkpoints: [
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
            },
        ],
        isLoading: false,
    },
    getters: {
        minTimestamp(state) {
            const stamps = Object.values(state.user.paths)
                .map((p) => (p.done.length === 0 ? Infinity : p.done[0].ts));

            const minTs = Math.min(...stamps);
            const ts = Math.min(new Date().getTime() - 30 * 24 * 3600000, minTs);
            return toMonday(ts);
        },
        maxTimestamp(state) {
            const stamps = Object.values(state.user.paths)
                .map((p) => (p.done.length === 0 ? 0 : p.done[p.done.length - 1].ts));

            const maxTs = Math.max(...stamps);
            const ts = Math.max(
                new Date().getTime() + 90 * 24 * 3600000,
                maxTs + 30 * 24 * 3600000,
            );
            const maxDate = new Date(ts);
            maxDate.setMonth(maxDate.getMonth() + 1);
            maxDate.setDate(0);

            return toMonday(maxDate.getTime());
        },
        allDays(state, getters) {
            const days = [];
            const now = new Date();
            now.setHours(0, 0, 0, 0);

            for (let day = getters.minTimestamp; day < getters.maxTimestamp; day += 24 * 3600000) {
                const currentDate = new Date(day);
                const dayObject = {
                    paths: getDayObject(state.user.paths, day),
                    day: currentDate.getDate(),
                    weekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
                    evenMonth: currentDate.getMonth() % 2 === 0,
                    today: now.getMonth() === currentDate.getMonth()
                        && now.getDate() === currentDate.getDate()
                        && now.getFullYear() === currentDate.getFullYear(),
                    aWeekAgo: day + 14 * 24 * 3600000 === now.getTime(),
                    first: currentDate.getDate() === 1,
                    timestamp: day,
                };
                days.push(dayObject);
            }

            return days;
        },
    },
    mutations: {
        setUserId(state, userId) {
            state.user.userId = userId;
        },
        setUserData(state, data) {
            if (data && data.paths) {
                state.user = { ...data };
            }
        },
        setLoading(state, loading) {
            state.isLoading = loading;
        },
    },
    actions: {
        async init({ state, commit }) {
            const userId = '55555';
            commit('setUserId', userId);

            commit('setLoading', true);
            const response = await api('getUser', state.user.userId, {});
            commit('setLoading', false);
            commit('setUserData', response);
        },
        async createEditPath({ state, commit }, path) {
            commit('setLoading', true);
            const response = await api('createEditPath', state.user.userId, path);
            commit('setLoading', false);
            commit('setUserData', response);
        },
        async deletePath({ state, commit }, data) {
            commit('setLoading', true);
            const response = await api('deletePath', state.user.userId, data);
            commit('setLoading', false);
            commit('setUserData', response);
        },
        async setDone({ state, commit }, pathName) {
            const timezoneOffset = -1 * (new Date()).getTimezoneOffset();
            commit('setLoading', true);
            const response = await api('setDone', state.user.userId, { pathName, timezoneOffset });
            commit('setLoading', false);
            commit('setUserData', response);
        },
    },
});
