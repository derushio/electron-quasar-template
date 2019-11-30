<template lang='pug'>
#Home
    .main-pane
        hello-world(msg='HelloWorld')
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import '@/components/HelloWorld.vue';

@Component
export default class Home extends Vue {}
</script>

<style lang='stylus'>
@require '~@/assets/styles/entry/view.styl';

html
    scroll-view: true;
    // static-view: true;

#Home
    .main-pane
        main-pane();
</style>
