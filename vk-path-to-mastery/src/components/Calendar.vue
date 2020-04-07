<template>
    <f7-page>
        <f7-navbar title="Путь к мастерству"></f7-navbar>
        <f7-link href="/path/first">Create Path</f7-link>
        <div class="main-calendar">
            <calendar-line
                v-for="lineNumber in totalLines"
                :key="lineNumber"
                :lineNumber="lineNumber - 1"
            />
        </div>
    </f7-page>
</template>

<script>
import CalendarLine from './CalendarLine.vue';

export default {
    name: 'Calendar.vue',
    components: {
        CalendarLine,
    },
    computed: {
        totalLines() {
            return this.$store.getters.allDays.length / 7;
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
