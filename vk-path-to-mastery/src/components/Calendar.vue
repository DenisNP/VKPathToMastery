<template>
    <div class="main-calendar">
        <calendar-line
            v-for="line in totalLines"
            :key="line.date"
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
            return this.$store.getters.minTimestamp;
        },
        maxDate() {
            return this.$store.getters.maxTimestamp;
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
