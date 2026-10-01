<template>
     <!-- wwFront:start -->
    <router-view />
    <Analytics />
    <!-- wwFront:end -->
</template>

<script>
import { reactive, computed, provide, onMounted, watch } from 'vue';
import { Analytics } from '@vercel/analytics/vue';

 
export default {
    components: { Analytics },
    setup() {
        const wwFrontState = reactive({
            lang: computed(() => wwLib.$store.getters['front/getLang']),
            pageId: computed(() => wwLib.$store.getters['websiteData/getPageId']),
            screenSize: computed(() => wwLib.$store.getters['front/getScreenSize']),
            screenSizes: computed(() => wwLib.$store.getters['front/getScreenSizes']),
        });
        provide('wwFrontState', wwFrontState);

     },
};
</script>

<style>
 </style>
