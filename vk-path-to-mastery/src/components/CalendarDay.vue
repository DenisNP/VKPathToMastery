<template>
    <div
        class="calendar-day"
        :class="{
                weekend: day.weekend,
                'c-day-back': day.evenMonth,
                'c-day-back-alt': !day.evenMonth,
                today: day.today,
                first: day.first,
            }"
    >
        {{day.day}}
    </div>
</template>

<script>
export default {
    name: 'CalendarDay.vue',
    props: {
        day: {
            type: Object,
            required: true,
        },
    },
};
</script>

<!--suppress CssUnusedSymbol -->
<style>
    .c-day-back {
        background-color: rgba(255, 220, 192, 0.26);
    }

    .c-day-back-alt {
        background-color: rgba(199, 88, 0, 0.11);
        color: rgba(53, 20, 0, 0.66);
    }
</style>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .calendar-day {
        margin-top: 4.3px;
        height: calc(15vw - 4.3px);
        font-size: 17px;
        font-weight: 600;
        color: rgba(53, 20, 0, 0.54);
    }

    .weekend {
        color: var(--f7-theme-color-shade);
    }

    .first {
        border-left: 2px solid #867865a8;
    }

    .today {
        font-weight: bold;
        border: 2px solid var(--f7-theme-color);
    }

</style>
