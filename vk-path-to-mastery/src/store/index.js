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
                    done: [1578344400000, 1578430800000, 1578517200000, 1578603600000, 1578690000000, 1578776400000, 1578862800000, 1578949200000, 1579294800000, 1579381200000, 1579467600000, 1579554000000, 1579640400000, 1579726800000, 1579813200000, 1579899600000, 1580245200000, 1580331600000, 1580418000000, 1580590800000, 1580677200000, 1580763600000, 1580850000000, 1580936400000, 1581022800000, 1581109200000, 1581195600000, 1581282000000, 1581368400000, 1581454800000, 1581541200000, 1581627600000, 1581714000000, 1581800400000, 1581886800000, 1581973200000, 1582059600000, 1582146000000, 1582232400000, 1582318800000, 1582405200000, 1582491600000, 1582578000000, 1582664400000, 1582750800000, 1582837200000, 1582923600000, 1583010000000, 1583096400000, 1583182800000, 1583269200000, 1583355600000, 1583442000000, 1583528400000, 1583614800000, 1583701200000, 1583787600000, 1583874000000, 1583960400000, 1584046800000, 1584133200000, 1584219600000, 1584306000000, 1584392400000, 1584478800000, 1584565200000, 1584651600000, 1584738000000, 1584824400000, 1584910800000, 1584997200000, 1585083600000, 1585170000000, 1585256400000, 1585342800000, 1585429200000, 1585515600000, 1585602000000, 1585688400000, 1585774800000, 1585861200000, 1585947600000, 1586034000000, 1586120400000, 1586206800000, 1586293200000, 1586379600000, 1586466000000, 1586552400000, 1586638800000, 1586725200000, 1586811600000],
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
                .map((p) => (p.done.length === 0 ? Infinity : p.done[0]));

            const minTs = Math.min(...stamps);
            const ts = Math.min(new Date().getTime() - 30 * 24 * 3600000, minTs);
            return toMonday(ts);
        },
        maxTimestamp(state) {
            const stamps = Object.values(state.user.paths)
                .map((p) => (p.done.length === 0 ? 0 : p.done[p.done.length - 1]));

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
                    timestamp: currentDate.getTime(),
                    day: currentDate.getDate(),
                    weekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
                    evenMonth: currentDate.getMonth() % 2 === 0,
                    today: now.getMonth() === currentDate.getMonth()
                        && now.getDate() === currentDate.getDate()
                        && now.getFullYear() === currentDate.getFullYear(),
                    first: currentDate.getDate() === 1,
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
