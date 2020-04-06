<template>
    <div class="calendar-line">
        <calendar-day
            v-for="day in days"
            :key="day.day"
            :day="day"
        />
        <div
            class="right-block"
            :class="{'c-day-back': days[6].evenMonth, 'c-day-back-alt': !days[6].evenMonth}"
        />
        <div v-if="isFirstLine" class="month-name-container">
            <div class="month-name">{{monthName}}</div>
        </div>
    </div>
</template>

<script>
import CalendarDay from './CalendarDay.vue';

export default {
    name: 'CalendarLine.vue',
    props: {
        lineNumber: {
            type: Number,
            required: true,
        },
    },
    computed: {
        days() {
            const days = [];
            for (let i = 0; i < 7; i++) {
                days.push(this.$store.getters.allDays[this.lineNumber * 7 + i]);
            }

            return days;
        },
        getMonth() {
            return (new Date(this.days[6].timestamp)).getMonth();
        },
        monthName() {
            const months = [
                'январь',
                'февраль',
                'март',
                'апрель',
                'май',
                'июнь',
                'июль',
                'август',
                'сентябрь',
                'октябрь',
                'ноябрь',
                'декабрь',
            ];
            return months[this.getMonth];
        },
        isFirstLine() {
            return this.lineNumber === 0 || this.days.some((x) => x.first);
        },
    },
    components: {
        CalendarDay,
    },
};
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .calendar-line {
        width: 100vw;
        display: flex;
    }

    .right-block {
        width: 5vw;
        margin-top: 4.3px;
        height: calc(15vw - 4.3px);
    }

    .month-name-container {
        float: right;
        width: 0;
        height: 0;
        text-align: center;
        overflow: visible;
        font-weight: bold;
        letter-spacing: 5px;
        font-size: 3.8vw;
        transform: rotate(-90deg) translateX(-60vw) translateY(-6vw);
    }

    .month-name {
        width: 60vw;
        text-align: center;
        color: #663b0ee0;
    }
</style>
