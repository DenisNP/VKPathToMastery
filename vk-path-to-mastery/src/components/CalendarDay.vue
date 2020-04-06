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
        <div class="day-text">{{day.day}}</div>
        <div class="container">
            <div class="sub-container">
                <div class="icon first-done"></div>
            </div>
        </div>
        <div class="container">
            <div class="sub-container">
                <div class="icon first-line-back"></div>
            </div>
        </div>
        <div class="container">
            <div class="sub-container">
                <div class="icon first-line-next"></div>
            </div>
        </div>
<!--        <div class="container">-->
<!--            <div class="sub-container">-->
<!--                <div class="icon second-done"></div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="container">-->
<!--            <div class="sub-container">-->
<!--                <div class="icon second-line-back"></div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="container">-->
<!--            <div class="sub-container">-->
<!--                <div class="icon second-line-next"></div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="container">-->
<!--            <div class="sub-container">-->
<!--                <div class="icon third-done"></div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="container">-->
<!--            <div class="sub-container">-->
<!--                <div class="icon third-line-back"></div>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="container">-->
<!--            <div class="sub-container">-->
<!--                <div class="icon third-line-next"></div>-->
<!--            </div>-->
<!--        </div>-->
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

    .day-text {
        width: 20px;
    }

    .container {
        width: 0;
        height: 0;
        overflow: visible;
    }

    .sub-container {
        width: 14vw;
        overflow: hidden;
        transform: translate(calc(-10px - 50%), -50%);
    }

    .icon {
        background-image: url("~@/assets/strip_00000.png");
        background-size: 180vw 15vw;
        width: 180vw;
        height: 15vw;
    }

    .first-done {
        background-position: -0.5vw 0;
    }

    .second-done {
        background-position: -15.5vw 0;
    }

    .third-done {
        background-position: -30.5vw 0;
    }

    .first-line-back {
        background-position: -45.5vw 0;
    }

    .first-line-next {
        background-position: -60.5vw 0;
    }

    .second-line-back {
        background-position: -75.5vw 0;
    }

    .second-line-next {
        background-position: -90.5vw 0;
    }

    .third-line-back {
        background-position: -105.5vw 0;
    }

    .third-line-next {
        background-position: -120.5vw 0;
    }

    .first-milestone {
        background-position: -135.5vw 0;
    }

    .second-milestone {
        background-position: -150.5vw 0;
    }

    .third-milestone {
        background-position: -165.5vw 0;
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
