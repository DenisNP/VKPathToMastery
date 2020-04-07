<template>
    <div
        class="gong"
        @touchstart="mousedown"
        @touchend="mouseup"
        @touchcancel="mouseup"
    >
        <div class="filter" :class="{dark: !pathExists}"  :style="`filter: ${filter};`">
            <img src="~@/assets/gong.png"/>
            <div class="icon-container icon-filter" v-if="pathExists">{{path.icon}}</div>
        </div>
        <f7-icon f7="plus_circle" class="icon-container plus-icon" v-if="!pathExists"></f7-icon>
        <div v-if="pathExists && canBeDone" class="fill-frame">
            <div class="fill" :style="`transform: translateY(${43 * (0.6 - progress * 0.6)}vw);`"/>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Gong.vue',
    data() {
        return {
            timer: 0,
            awaitClick: false,
            touchStartTime: 0,
            progress: 0,
            interval: 0,
            waitTime: 2000,
        };
    },
    computed: {
        path() {
            return this.$store.state.user.paths[this.pathName];
        },
        pathExists() {
            return !!this.path.name;
        },
        canBeDone() {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const existsInDone = this.path.done.some((d) => d.ts === now.getTime());
            let dayOfWeek = now.getDay() - 1;
            if (dayOfWeek < 0) dayOfWeek = 6;

            return this.pathExists && !existsInDone && this.path.days.includes(dayOfWeek);
        },
        filter() {
            const c = this.path.color;
            let brightness = 1.0;
            if (c >= 10 && c <= 90) {
                const dist = Math.abs(c - 50);
                brightness = (1 - (dist / 40)) * 0.7 + 1;
            }
            return `hue-rotate(${c}deg) brightness(${brightness}) ${this.canBeDone ? '' : 'saturate(0.4)'}`;
        },
    },
    props: {
        pathName: {
            type: String,
            required: true,
        },
    },
    methods: {
        edit() {
            this.$f7router.navigate(`/path/${this.pathName}`);
        },
        clicked() {
            if (this.awaitClick) {
                this.awaitClick = false;
                clearTimeout(this.timer);
                this.timer = 0;
                this.touchStartTime = 0;
                this.clickedDouble();
            } else {
                this.awaitClick = true;
                this.timer = setTimeout(() => this.clickedOnce(), 250);
            }
        },
        mousedown() {
            this.touchStartTime = 0;
            clearInterval(this.interval);
            this.progress = 0;

            if (!this.pathExists) {
                this.edit();
            } else if (this.canBeDone) {
                this.touchStartTime = (new Date()).getTime();
                this.interval = setInterval(this.calculateProgress, 10);
            }
        },
        mouseup() {
            if (this.canBeDone) {
                const diff = (new Date()).getTime() - this.touchStartTime;
                this.touchStartTime = 0;
                clearInterval(this.interval);

                if (diff < this.waitTime) {
                    this.touchStartTime = 0;
                    this.progress = 0;
                    this.timer = 0;
                    this.clicked();
                } else {
                    this.setDone();
                }
            } else if (this.pathExists) {
                this.clicked();
            }
        },
        clickedOnce() {
            this.awaitClick = false;
            this.touchStartTime = 0;
            this.timer = 0;
            this.showToast();
        },
        clickedDouble() {
            this.edit();
        },
        setDone() {
            this.touchStartTime = 0;
            clearInterval(this.interval);
            this.progress = 0;

            this.$store.dispatch('setDone', this.pathName);
        },
        showToast() {
            let toastMessage = `<b>${this.path.name}</b>`;
            if (this.canBeDone) {
                toastMessage += '<br><br>Долгое нажатие — сделать шаг по Пути!';
            } else {
                toastMessage += '<br><br>Сегодня ещё рано делать шаг по этому Пути.';
            }
            toastMessage += '<br><br>Двойное нажатие — редактировать.';

            const toast = this.$f7.toast.create({
                text: toastMessage,
                position: 'center',
                closeTimeout: 5000,
                destroyOnClose: true,
            });
            toast.open();
        },
        calculateProgress() {
            this.progress = ((new Date()).getTime() - this.touchStartTime) / this.waitTime;
            if (this.progress > 1) {
                this.setDone();
            }
        },
    },
};
</script>

<style scoped>
    .gong {
        width: 25vw;
        height: 25vw;
        margin-top: 7vw;
    }

    .gong img {
        height: 100%;
        width: 100%;
    }

    .fill-frame {
        width: 25vw;
        height: 25vw;
        border-radius: 25vw;
        overflow: hidden;
        transform: translateY(-43vw);
    }

    .fill {
        width: 25vw;
        height: 25vw;
        background-color: rgba(255, 194, 0, 0.5);
    }

    .toast {
        padding: 10px;
        text-align: center;
    }

    .icon-container {
        width: 100%;
        text-align: center;
        transform: translateY(calc(-12.5vw - 61%));
    }

    .icon-filter {
        font-size: 12vw;
        color: #00000033;
        text-shadow: 0 0 0 #b7562f, 1px 1px 1px #dac5716e, -1px -1px 1px #593702;
    }

    .plus-icon {
        color: #fdaf0061;
        font-size: 9vw;
        transform: translateY(calc(-12.5vw - 55%));
    }

    .dark {
        filter: saturate(0.5) brightness(0.85) contrast(0.85) opacity(0.5)!important;
    }
</style>
