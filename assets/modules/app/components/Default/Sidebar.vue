<template>
    <Sidebar class="sidebar-lg-collapse">
        <SidebarBrand>
            <img width="25" alt="Encyclopedia logo" src="/images/icon.png"/>
            <span class="sidebar-content">{{ $t('brand_name') }}</span>
        </SidebarBrand>

        <SidebarNav>
            <SidebarAction icon="home">{{ $t('home') }}</SidebarAction>
            <SidebarAction icon="cubes" to="/instances">{{ $t('instances') }}</SidebarAction>
            <SidebarAction icon="server" to="/servers">{{ $t('servers') }}</SidebarAction>
            <SidebarAction icon="route" to="/configurations">{{ $t('configurations') }}</SidebarAction>
        </SidebarNav>

        <SidebarTitle>
            <h5>{{ $t('application') }}</h5>
        </SidebarTitle>

        <SidebarNav>
            <SidebarItem icon="sync-alt" @click="checkUpdate">{{ $t('app_check_update') }}</SidebarItem>
            <SidebarItem icon="power-off" @click="restartApplication">{{ $t('app_reload') }}</SidebarItem>
        </SidebarNav>

        <SidebarFooter>
            {{ projectVersion }} [{{ projectEnv }}]
            <a :href="privacyPolicyUrl" target="_blank">{{ $t('privacy_policy') }}</a>
        </SidebarFooter>
    </Sidebar>
</template>

<script>
import Sidebar from "../../../ui/components/sidebar/Sidebar.vue";
import SidebarBrand from "../../../ui/components/sidebar/SidebarBrand.vue";
import SidebarNav from "../../../ui/components/sidebar/SidebarNav.vue";
import SidebarAction from "../../../ui/components/sidebar/SidebarAction.vue";
import SidebarTitle from "../../../ui/components/sidebar/SidebarTitle.vue";
import SidebarItem from "../../../ui/components/sidebar/SidebarItem.vue";
import SidebarFooter from "../../../ui/components/sidebar/SidebarFooter.vue";

export default {
    components: {
        SidebarFooter,
        Sidebar,
        SidebarItem,
        SidebarTitle,
        SidebarAction,
        SidebarNav,
        SidebarBrand
    },

    inject: ['config', 'application'],

    computed: {
        projectVersion() {
            return `v${this.config.version}`;
        },

        projectEnv() {
            return this.config.env;
        },

        privacyPolicyUrl() {
            return `//firewall.oauthorize.tk/privacy-policy?client_id=${this.config.name}`;
        },
    },

    methods: {
        restartApplication() {
            window.localStorage.clear();
            window.location.reload(true);
        },

        checkUpdate() {
            this.application.checkUpdate();
        }
    }
}
</script>
