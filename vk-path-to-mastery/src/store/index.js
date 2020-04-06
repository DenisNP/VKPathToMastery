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
        };

        const dayIndex = path.done.findIndex((d) => d.ts >= timestamp);
        if (dayIndex !== -1) {
            let nextDay = path.done[dayIndex];
            if (nextDay.ts === timestamp) {
                dayObject[pathName].done = true;
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

export default new Vuex.Store({
    state: {
        user: {
            userId: '',
            paths: {
                first: {
                    name: 'Тест',
                    icon: '1',
                    days: [0, 1, 2, 3, 4, 5, 6],
                    // eslint-disable-next-line max-len
                    done: [{ ts: 1578344400000, start: true }, { ts: 1578430800000 }, { ts: 1578517200000 }, { ts: 1578603600000 }, { ts: 1578690000000 }, { ts: 1578776400000 }, { ts: 1578862800000 }, { ts: 1578949200000 }, { ts: 1579294800000, start: true }, { ts: 1579381200000 }, { ts: 1579467600000 }, { ts: 1579554000000 }, { ts: 1579640400000 }, { ts: 1579726800000 }, { ts: 1579813200000 }, { ts: 1579899600000 }, { ts: 1580245200000 }, { ts: 1580331600000 }, { ts: 1580418000000 }, { ts: 1580590800000 }, { ts: 1580677200000 }, { ts: 1580763600000 }, { ts: 1580850000000 }, { ts: 1580936400000 }, { ts: 1581022800000 }, { ts: 1581109200000 }, { ts: 1581195600000 }, { ts: 1581282000000 }, { ts: 1581368400000 }, { ts: 1581454800000 }, { ts: 1581541200000 }, { ts: 1581627600000 }, { ts: 1581714000000 }, { ts: 1581800400000 }, { ts: 1581886800000 }, { ts: 1581973200000 }, { ts: 1582059600000 }, { ts: 1582146000000 }, { ts: 1582232400000 }, { ts: 1582318800000 }, { ts: 1582405200000 }, { ts: 1582491600000 }, { ts: 1582578000000 }, { ts: 1582664400000 }, { ts: 1582750800000 }, { ts: 1582837200000 }, { ts: 1582923600000 }, { ts: 1583010000000 }, { ts: 1583096400000 }, { ts: 1583182800000 }, { ts: 1583269200000 }, { ts: 1583355600000 }, { ts: 1583442000000 }, { ts: 1583528400000 }, { ts: 1583614800000 }, { ts: 1583701200000 }, { ts: 1583787600000 }, { ts: 1583874000000 }, { ts: 1583960400000 }, { ts: 1584046800000 }, { ts: 1584133200000 }, { ts: 1584219600000 }, { ts: 1584306000000 }, { ts: 1584392400000 }, { ts: 1584478800000 }, { ts: 1584565200000 }, { ts: 1584651600000 }, { ts: 1584738000000 }, { ts: 1584824400000 }, { ts: 1584910800000 }, { ts: 1584997200000 }, { ts: 1585083600000 }, { ts: 1585170000000 }, { ts: 1585256400000 }, { ts: 1585342800000 }, { ts: 1585429200000 }, { ts: 1585515600000 }, { ts: 1585602000000 }, { ts: 1585688400000 }, { ts: 1585774800000 }, { ts: 1585861200000 }, { ts: 1585947600000 }, { ts: 1586034000000 }, { ts: 1586120400000 }, { ts: 1586206800000 }, { ts: 1586293200000 }, { ts: 1586379600000 }, { ts: 1586466000000 }, { ts: 1586552400000 }, { ts: 1586638800000 }, { ts: 1586725200000 }, { ts: 1586811600000 }],
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
        },
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
            return toMonday(ts);
        },
        allDays(state, getters) {
            const days = [];
            const now = new Date();
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
    },
    actions: {
        init({ commit }) {
            const userId = '55555';
            commit('setUserId', userId);
        },
    },
});
