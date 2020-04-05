<template>
    <div class="main-calendar">
        <calendar-line
            v-for="line in totalLines"
            :key="line"
            :startDate="line.date"
            :totalFirst="line.totalFirst"
        />
    </div>
</template>

<script>
import CalendarLine from './CalendarLine.vue';

export default {
    name: 'Calendar.vue',
    components: {
        CalendarLine,
    },
    computed: {
        minDate() {
            const date = new Date();
            date.setDate(date.getDate() - 30);

            return this.toMonday(date).getTime();
        },
        maxDate() {
            const date = new Date();
            date.setDate(date.getDate() + 90);

            return this.toMonday(date).getTime();
        },
        totalLines() {
            const dates = [];
            let startDate = this.minDate;
            while (startDate < this.maxDate) {
                dates.push({
                    date: startDate,
                    totalFirst: startDate === this.minDate,
                });
                startDate += 7 * 24 * 3600000;
            }
            return dates;
        },
    },
    methods: {
        toMonday(date) {
            date.setHours(0, 0, 0, 0);

            let dayOfWeek = date.getDay() - 1;
            if (dayOfWeek < 0) dayOfWeek = 6;

            date.setDate(date.getDate() - dayOfWeek);
            return date;
        },
    },
};
</script>

<style scoped>
    .main-calendar {
        /*noinspection CssUnknownTarget*/
        background-image: url("~@/assets/wood.jpg");
        background-size: 100vw;
        background-repeat: no-repeat repeat;
        min-height: 100vh;
    }
</style>
