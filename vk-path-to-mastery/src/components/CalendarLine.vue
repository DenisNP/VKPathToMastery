<template>
    <div class="calendar-line">
        <div
            class="calendar-day"
            v-for="day in days"
            :key="day"
            :class="{
                weekend: day.weekend,
                background: day.evenMonth,
                'back-alt': !day.evenMonth,
                today: day.today,
                first: day.first,
            }"
        >
            {{day.day}}
        </div>
        <div
            class="right-block"
            :class="{background: days[6].evenMonth, 'back-alt': !days[6].evenMonth}"
        />
        <div v-if="isFirstLine" class="month-name-container">
            <div class="month-name">{{monthName}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CalendarLine.vue',
    props: {
        startDate: {
            type: Number,
            required: true,
        },
        totalFirst: {
            type: Boolean,
            required: true,
        },
    },
    computed: {
        days() {
            const days = [];
            const now = new Date();

            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(this.startDate);
                currentDate.setDate(currentDate.getDate() + i);

                days.push({
                    day: currentDate.getDate(),
                    weekend: i >= 5,
                    evenMonth: currentDate.getMonth() % 2 === 0,
                    today: now.getMonth() === currentDate.getMonth()
                        && now.getDate() === currentDate.getDate()
                        && now.getFullYear() === currentDate.getFullYear(),
                    first: currentDate.getDate() === 1,
                    last: i === 6,
                });
            }

            return days;
        },
        getMonth() {
            return (new Date(this.startDate + 7 * 24 * 3600000)).getMonth();
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
            return this.totalFirst || this.days.some((x) => x.first);
        },
        isEvenMonth() {
            return this.getMonth % 2 === 0;
        },
    },
};
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
    .calendar-line {
        width: 100vw;
        display: flex;
    }

    .calendar-day {
        margin-top: 4.3px;
        height: calc(15vw - 4.3px);
        font-size: 17px;
        font-weight: 600;
        color: rgba(53, 20, 0, 0.54);
    }

    .background {
        background-color: rgba(255, 220, 192, 0.26);
    }

    .back-alt {
        background-color: rgba(199, 88, 0, 0.11);
        color: rgba(53, 20, 0, 0.66);
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

    .right-block {
        width: 20px;
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
