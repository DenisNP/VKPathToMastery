<template>
    <f7-page>
        <f7-navbar>
            <f7-nav-left>
                <f7-link back icon-f7="multiply"/>
            </f7-nav-left>
            <f7-nav-title>{{isCreating ? "Новый Путь" : "Изменить Путь"}}</f7-nav-title>
        </f7-navbar>
        <div class="create-path-container">
            <f7-block class="create-form-title">
                {{title}}
            </f7-block>
            <f7-list no-hairlines-between style="margin: 0;">
                <f7-list-input
                    label="Иконка"
                    type="text"
                    info="Эмодзи или другой символ"
                    class="margin-bottom"
                    :value="icon"
                    @input="(e) => filter(e.target.value)"
                />
                <f7-list-input
                    label="Название"
                    type="text"
                    placeholder="Учусь играть на гитаре"
                    validate
                    pattern=".{1,30}"
                    error-message="Слишком длинное название"
                    class="margin-bottom"
                    :value="name"
                    @input="name = $event.target.value"
                />
                <f7-list-item title="В какие дни"/>
                <f7-list-item class="buttons-item margin-bottom">
                    <div class="buttons-line">
                        <f7-button
                            v-for="(dayName, day) in ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']"
                            :key="dayName"
                            class="day-btn"
                            :outline="!days.includes(day)"
                            :fill="days.includes(day)"
                            @click="() => toggleDay(day)"
                        >{{dayName}}</f7-button>
                    </div>
                </f7-list-item>
                <f7-list-item title="Цвет значков в календаре"/>
                <f7-list-item class="bottom-item">
                    <div
                        slot="media"
                        class="color-show"
                        :style="`filter: hue-rotate(${color}deg);`"
                    />
                    <f7-range
                        :min="0"
                        :max="359"
                        :step="1"
                        :value="color"
                        color="red"
                        @range:change="onColorChange"
                    ></f7-range>
                </f7-list-item>
                <f7-block class="end-block">
                    <f7-button
                        class="end-button margin-bottom"
                        :class="{disabled: buttonsDisabled}"
                        large
                        fill
                        @click="createEditPath">
                        {{isCreating ? 'Начать Путь' : 'Сохранить'}}
                    </f7-button>
                    <f7-button
                        v-if="!isCreating"
                        class="end-button"
                        :class="{disabled: buttonsDisabled}"
                        large
                        style="background-color: #ffffff99;"
                        @click="deletePath"
                    >
                        Завершить Путь
                    </f7-button>
                </f7-block>
            </f7-list>
        </div>
    </f7-page>
</template>

<script>
export default {
    name: 'CreatePath.vue',
    data() {
        return {
            color: 0,
            days: [],
            name: '',
            icon: '',
            oldIcon: '',
        };
    },
    computed: {
        path() {
            return this.$store.state.user.paths[this.pathName];
        },
        isCreating() {
            return !this.path.name;
        },
        title() {
            return this.isCreating
                ? 'Здесь вы создаете новое занятие, выполнение которого будете отслеживать'
                : `Изменить данные для Пути «${this.path.name}»`;
        },
        buttonsDisabled() {
            return !this.name || this.days.length === 0 || !this.icon;
        },
    },
    methods: {
        onColorChange(value) {
            this.color = value;
        },
        toggleDay(d) {
            const idx = this.days.indexOf(d);
            if (idx === -1) {
                this.days.push(d);
            } else {
                this.days.splice(idx, 1);
            }
        },
        fancyCount(str) {
            const joiner = '\u{200D}';
            const split = str.split(joiner);
            let count = 0;

            // eslint-disable-next-line no-restricted-syntax
            for (const s of split) {
                // removing the variation selectors
                const num = Array.from(s.split(/[\ufe00-\ufe0f]/).join('')).length;
                count += num;
            }

            // assuming the joiners are used appropriately
            return Math.floor(count / split.length);
        },
        filter(icon) {
            const len = this.fancyCount(icon);
            if (len <= 1) {
                this.icon = icon;
                this.oldIcon = icon;
            } else {
                this.icon = this.oldIcon;
            }
        },
        async createEditPath() {
            if (this.buttonsDisabled) return;

            const data = {};
            data[this.pathName] = {
                color: this.color,
                days: this.days,
                name: this.name,
                icon: this.icon,
            };
            await this.$store.dispatch('createEditPath', data);
            this.$f7.views.main.router.back();
        },
        deletePath() {
            if (this.buttonsDisabled) return;

            this.$f7.dialog.create({
                title: this.path.name,
                text: 'Вы достигли цели вашего Пути?',
                buttons: [
                    {
                        text: 'Я успешно прошёл Путь',
                        onClick: () => this.deletePathConfirm(true),
                    },
                    {
                        text: 'Просто удалить Путь',
                        onClick: () => this.deletePathConfirm(false),
                    },
                    {
                        text: 'Отмена',
                        close: true,
                        color: 'red',
                    },
                ],
                verticalButtons: true,
            }).open();
        },
        async deletePathConfirm(archive) {
            await this.$store.dispatch('deletePath', { pathName: this.pathName, archive });
            this.$f7.views.main.router.back();
        },
    },
    mounted() {
        const path = this.$store.state.user.paths[this.pathName];
        this.days = path.days;
        this.color = path.color;
        this.name = path.name;
        this.icon = path.icon || '🥋';
        this.oldIcon = this.icon;
    },
    props: {
        pathName: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
    .create-path-container {
        background-image: url("~@/assets/wood2.jpg");
        background-size: 100vw;
        background-repeat: no-repeat repeat;
        min-height: 100%;
    }

    .create-form-title {
        margin: 0;
        padding-top: 15px;
        padding-bottom: 15px;
        font-size: 16px;
        color: rgb(99, 41, 20);
        background-color: var(--f7-list-bg-color);
    }

    .bottom-item {
        padding-bottom: 15px;
        box-shadow: 0 5px 5px rgba(0,0,0,0.2);
    }

    .end-button {
        box-shadow: 0 0 9px rgba(0,0,0,0.35);
    }

    .end-block {
        padding-top: var(--f7-block-margin-vertical);
        padding-bottom: var(--f7-block-margin-vertical);
        margin: 0;
    }

    .day-btn {
        width: 12vw;
        margin: 1vw;
        padding: 0;
    }

    .buttons-line {
        margin: 0 1vw;
        display: flex;
    }

    .margin-bottom {
        margin-bottom: 12px;
    }

    .disabled {
        opacity: 0.5;
    }

    .color-show {
        width: 25px;
        height: 25px;
        border-radius: 25px;
        background: red;
    }
</style>

<style>
    .buttons-item > div {
        padding-left: 0!important;
        padding-right: 0!important;
    }

    .range-bar-active {
        background: none!important;
    }
</style>
