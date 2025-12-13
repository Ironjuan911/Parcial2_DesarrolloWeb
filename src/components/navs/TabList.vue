<template>
    <div>
        <ul class="nav nav-tabs" role="tablist">
            <li v-for="(tab, index) in tabs" :key="index" class="nav-item" role="presentation">
                <button class="nav-link" :class="{ active: tab.isActive }" @click="selectTab(tab)" type="button"
                    role="tab" :aria-selected="tab.isActive">
                    {{ tab.title }}
                </button>
            </li>
        </ul>
        <div class="tab-content" style="padding-top: 20px;">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TabList',
    data() {
        return {
            tabs: []
        };
    },
    provide() {
        return {
            registerTab: this.registerTab
        };
    },
    methods: {
        registerTab(tab) {
            if (this.tabs.length === 0) {
                tab.isActive = true;
            }
            this.tabs.push(tab);
        },
        selectTab(selectedTab) {
            this.tabs.forEach(tab => {
                tab.isActive = (tab.name === selectedTab.name && tab.title === selectedTab.title);
            });
        }
    }
}
</script>
