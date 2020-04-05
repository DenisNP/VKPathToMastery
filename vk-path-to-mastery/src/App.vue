<template>
    <f7-app :params="f7params">
        <f7-view main class="safe-areas">
            <f7-page>
                <f7-navbar title="Путь к мастерству"></f7-navbar>
            </f7-page>
        </f7-view>
    </f7-app>
</template>

<script>
export default {
    data() {
        return {
            f7params: {
                theme: 'auto',
                name: 'Путь к мастерству',
                id: 'net.denisnp.pathtomastery',
            },
        };
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
    }
</style>
