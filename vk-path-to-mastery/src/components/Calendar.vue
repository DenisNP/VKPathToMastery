<template>
    <f7-page>
        <f7-navbar title="Путь к мастерству"></f7-navbar>
        <div class="bar"><img src="~@/assets/bar.jpg"/></div>
        <div class="calendar-container">
            <div class="main-calendar">
                <calendar-line
                    v-for="lineNumber in totalLines"
                    :key="lineNumber"
                    :lineNumber="lineNumber - 1"
                />
            </div>
        </div>
        <div class="footer">
            <gong path-name="second" style="margin-left: 6vw;"/>
            <gong path-name="first" style="margin-left: 6.5vw;"/>
            <gong path-name="third" style="margin-left: 6.5vw;"/>
        </div>
    </f7-page>
</template>

<script>
import CalendarLine from './CalendarLine.vue';
import Gong from './Gong.vue';

export default {
    name: 'Calendar.vue',
    components: {
        CalendarLine,
        Gong,
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
        margin-top: 2.5vw;
    }

    .calendar-container {
        height: calc(100vh - var(--f7-navbar-height) - var(--f7-safe-area-top) - 34.9vw);
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .bar {
        position: fixed;
        top: calc(var(--f7-navbar-height) + var(--f7-safe-area-top));
        z-index: 21;
        box-shadow: 0 0 10px rgba(0,0,0,0.75);
    }

    .bar > img {
        width: 100vw;
        height: 3.5vw;
        display: block;
    }

    .footer {
        position: fixed;
        bottom: 0;
        width: 100vw;
        height: 34.9vw;

        background-image: url("~@/assets/bottom.jpg");
        background-size: 100vw;
        background-repeat: no-repeat;

        z-index: 21;
        display: flex;
    }
</style>
