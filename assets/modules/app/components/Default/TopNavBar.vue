<template>
    <TopNavbar>
        <Button class="ms-0 sidebar-lg-toggle" outline level="secondary" @click="toggleSidebar">
            <Icon icon="bars"></Icon>
        </Button>
        <slot></slot>
    </TopNavbar>
</template>

<script>
import TopNavbar from "../../../ui/components/navbar/TopNavbar.vue";
import Button from "../../../ui/components/elements/Button.vue";
import Icon from "../../../ui/components/elements/Icon.vue";
import AuthNav from "../../../auth/components/AuthNav.vue";

export default {
    components: {
        AuthNav,
        Icon,
        Button,
        TopNavbar
    },

    inject: ['emitter'],

    methods: {
        toggleSidebar() {
            this.emitter.emit('sidebar:toggle');
        }
    }
}
</script>
