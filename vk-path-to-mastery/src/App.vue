<template>
    <f7-app :params="f7params">
        <f7-view :push-state="true" main url="/" class="safe-areas"/>
    </f7-app>
</template>

<script>
import Calendar from './components/Calendar.vue';
import CreatePath from './components/CreatePath.vue';
import EventBus from './event-bus';
import bridge from '@vkontakte/vk-bridge';

export default {
    data() {
        return {
            f7params: {
                theme: 'auto',
                name: 'Путь к мастерству',
                id: 'net.denisnp.pathtomastery',
                routes: [
                    {
                        path: '/',
                        component: Calendar,
                    },
                    {
                        path: '/path/:pathName',
                        component: CreatePath,
                    },
                ],
            },
        };
    },
    computed: {
        isLoading() {
            return this.$store.state.isLoading;
        },
    },
    watch: {
        isLoading(newState) {
            if (newState) {
                this.$f7.dialog.preloader('');
            } else {
                this.$f7.dialog.close();
            }
        },
    },
    async mounted() {
        window.addEventListener('contextmenu', (e) => { e.preventDefault(); });
        bridge.send('VKWebAppInit');

        await this.$store.dispatch('init');
        this.$nextTick(() => {
            EventBus.$emit('scroll');
        });
    },
};
</script>

<style>
    :root {
        --f7-theme-color: #b20101;
        --f7-theme-color-rgb: 178, 1, 1;
        --f7-theme-color-shade: #890101;
        --f7-theme-color-tint: #db0101;
        --f7-bars-bg-color: var(--f7-theme-color);
        --f7-bars-bg-color-rgb: var(--f7-theme-color-rgb);
        --f7-bars-translucent-opacity: 0.9;
        --f7-bars-text-color: #ffde00;
        --f7-bars-link-color: #ffde00;

        --f7-list-bg-color: rgba(255, 255, 255, 0.85);
        --f7-input-info-text-color: rgba(0, 0, 0, 0.25);
        --f7-label-font-size: 14px;
        --f7-list-item-title-font-size: var(--f7-label-font-size);
        --f7-block-margin-vertical: 30px;
        --f7-dialog-button-text-color: #5f0909;
    }
</style>
