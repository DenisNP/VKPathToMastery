<template>
    <div class="gong" @click="clicked">
        <div class="filter" :class="{dark: !pathExists}"  :style="`filter: ${filter};`">
            <img src="~@/assets/gong.png"/>
            <div class="icon-container icon-filter" v-if="pathExists">{{path.icon}}</div>
        </div>
        <f7-icon f7="plus_circle" class="icon-container plus-icon" v-if="!pathExists"></f7-icon>
    </div>
</template>

<script>
export default {
    name: 'Gong.vue',
    data() {
        return {
            timer: 0,
            awaitClick: false,
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
            return `hue-rotate(${c}deg) brightness(${brightness})`;
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
                this.clickedDouble();
            } else {
                this.awaitClick = true;
                this.timer = setTimeout(() => this.clickedOnce(), 250);
            }
        },
        clickedOnce() {
            this.awaitClick = false;
            this.timer = 0;
        },
        clickedDouble() {
            this.edit();
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
