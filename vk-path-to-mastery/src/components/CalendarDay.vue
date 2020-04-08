<template>
    <div
        ref="scrollDay"
        class="calendar-day"
        :class="{
                weekend: day.weekend,
                'c-day-back': day.evenMonth,
                'c-day-back-alt': !day.evenMonth,
                today: day.today,
                first: day.first,
            }"
        @click="showToast"
    >
        <div class="day-text">{{day.day}}</div>
        <div v-if="day.paths.first.done && !day.paths.first.checkpoint" class="container"
             :style="firstFilter"
        >
            <div class="sub-container">
                <div class="icon first-done"></div>
            </div>
        </div>
        <div v-if="day.paths.first.prev" class="container" :style="firstFilter">
            <div class="sub-container">
                <div class="icon first-line-back"></div>
            </div>
        </div>
        <div v-if="day.paths.first.next" class="container" :style="firstFilter">
            <div class="sub-container">
                <div class="icon first-line-next"></div>
            </div>
        </div>
        <div v-if="day.paths.first.checkpoint" class="container" :style="firstFilter">
            <div class="sub-container">
                <div class="icon first-milestone"></div>
            </div>
        </div>
        <div v-if="day.paths.second.done && !day.paths.second.checkpoint" class="container"
             :style="secondFilter"
        >
            <div class="sub-container">
                <div class="icon second-done"></div>
            </div>
        </div>
        <div v-if="day.paths.second.prev" class="container" :style="secondFilter">
            <div class="sub-container">
                <div class="icon second-line-back"></div>
            </div>
        </div>
        <div v-if="day.paths.second.next" class="container" :style="secondFilter">
            <div class="sub-container">
                <div class="icon second-line-next"></div>
            </div>
        </div>
        <div v-if="day.paths.second.checkpoint" class="container" :style="secondFilter">
            <div class="sub-container">
                <div class="icon second-milestone"></div>
            </div>
        </div>
        <div v-if="day.paths.third.done && !day.paths.third.checkpoint" class="container"
             :style="thirdFilter"
        >
            <div class="sub-container">
                <div class="icon third-done"></div>
            </div>
        </div>
        <div v-if="day.paths.third.prev" class="container" :style="thirdFilter">
            <div class="sub-container">
                <div class="icon third-line-back"></div>
            </div>
        </div>
        <div v-if="day.paths.third.next" class="container" :style="thirdFilter">
            <div class="sub-container">
                <div class="icon third-line-next"></div>
            </div>
        </div>
        <div v-if="day.paths.third.checkpoint" class="container" :style="thirdFilter">
            <div class="sub-container">
                <div class="icon third-milestone"></div>
            </div>
        </div>
        <div v-if="nextCheckpoints.length" class="container next-checkpoints">
            <div class="sub-container">
                <div class="icon first-milestone"></div>
            </div>
        </div>
    </div>
</template>

<script>
import EventBus from '../event-bus';
import { numPhrase } from '../utils';

export default {
    name: 'CalendarDay.vue',
    props: {
        day: {
            type: Object,
            required: true,
        },
    },
    computed: {
        firstFilter() {
            return `filter: hue-rotate(${this.$store.state.user.paths.first.color}deg);`;
        },
        secondFilter() {
            return `filter: hue-rotate(${this.$store.state.user.paths.second.color}deg);`;
        },
        thirdFilter() {
            return `filter: hue-rotate(${this.$store.state.user.paths.third.color}deg);`;
        },
        nextCheckpoints() {
            return Object.entries(this.$store.state.user.paths)
                .filter(([, p]) => p.nextCheckpoint && (p.nextCheckpoint.ts === this.day.timestamp))
                .map(([pName, p]) => [pName, p.nextCheckpoint.id]);
        },
    },
    methods: {
        scroll() {
            if (!this.day.aWeekAgo) return;
            this.$nextTick(() => {
                if (this.$refs.scrollDay) this.$refs.scrollDay.scrollIntoView();
            });
        },
        findCheckpointDays(cId) {
            const cp = this.$store.state.checkpoints.find((c) => c.id === cId);
            return `${cp.daysDone} ${numPhrase(cp.daysDone, 'день', 'дня', 'дней')}`;
        },
        getCheckpointText(pathName, checkpointId) {
            return `${this.$store.state.user.paths[pathName].name} — ${this.findCheckpointDays(checkpointId)}`;
        },
        showToast() {
            const nameDayPairs = this.nextCheckpoints
                .map(([pName, cId]) => this.getCheckpointText(pName, cId));

            Object.entries(this.day.paths).forEach(([pName, pDay]) => {
                if (pDay.checkpoint) {
                    nameDayPairs.push(this.getCheckpointText(pName, pDay.checkpoint));
                }
            });

            if (nameDayPairs.length === 0) return;

            let toastMessage = 'Веха на вашем Пути:<br><br>';
            toastMessage += nameDayPairs.join('<br>');

            const toast = this.$f7.toast.create({
                text: toastMessage,
                position: 'center',
                closeTimeout: 3000,
                destroyOnClose: true,
            });
            toast.open();
        },
    },
    mounted() {
        EventBus.$on('scroll', this.scroll);
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

    .next-checkpoints {
        filter: brightness(0.5) opacity(0.7);
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
