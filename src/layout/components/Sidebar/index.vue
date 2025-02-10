<template>
    <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu
                :default-active="activeMenu"
                :collapse="isCollapse"
                :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
                :text-color="settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                :unique-opened="true"
                :active-text-color="settings.theme"
                :collapse-transition="false"
                mode="vertical"
            >
                <sidebar-item
                    v-for="(route, index) in sidebarRouters"
                    :key="route.path  + index"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
        <div class="version-container" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
            <span class="version-text" :style="{ color: settings.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor }">
                v{{ version }}<span class="environment-badge">{{ environment }}</span>
            </span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/assets/styles/variables.scss";

export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapState(["settings"]),
        ...mapGetters(["sidebarRouters", "sidebar"]),
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        },
        showLogo() {
            return this.$store.state.settings.sidebarLogo;
        },
        variables() {
            return variables;
        },
        isCollapse() {
            return !this.sidebar.opened;
        },
        version() {
            return process.env.VERSION || '1.0.0'
        },
        environment() {
            const env = process.env.NODE_ENV;
            const envMap = {
                'development': 'Dev',
                'staging': 'UAT',
                'production': 'Prod'
            };
            return envMap[env] || 'Dev';
        }
    }
};
</script>

<style lang="scss" scoped>
.version-container {
    position: fixed;
    bottom: 0;
    width: inherit;
    padding: 8px 16px;
    font-size: 12px;
    text-align: center;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s;

    .version-text {
        opacity: 0.7;
        
        .environment-badge {
            margin-left: 8px;
            padding: 2px 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
    }
}
</style>
