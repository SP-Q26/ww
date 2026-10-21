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

        function loadScript(src) {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.defer = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(src));
                document.head.appendChild(script);
            });
        }

        onMounted(async () => {
            if (!document.querySelector('link[href="/ww-tour-modal.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/ww-tour-modal.css';
                document.head.appendChild(link);
            }
            try {
                await loadScript('/ww-site-config.js');
                await loadScript('/ww-tour-modal.js');
                await loadScript('/ww-site-bridge.js');
            } catch (e) {
                console.warn('[ww-tour] bridge load failed', e);
            }
        });
     },
};
</script>

<style>
 </style>
