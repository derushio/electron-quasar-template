<template lang='pug'>
.hello-world
    p {{ msg }}
    q-btn(@click='onClick') button
</template>

<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import { aswait } from '@/utils/AsyncTimeout';
import { QBtn } from 'quasar';

// electron側のファイルを読み込むサンプル
import RandomUtil from '%/utils/RandomUtil';

@Component({
    components: { QBtn },
})
export default class HelloWorld extends Vue {
    @Prop({ type: String, default: () => '' })
    protected msg!: string;

    protected async mounted() {
        await this.$qqLoading.async(async () => {
            await aswait(1000);
        });

        const result = await this.$qqDialog.prompt('test', false);
        this.$logger.log(result);
    }

    protected async onClick() {
        await this.$qqNotify.open(`test: ${RandomUtil.rand(3)}`);
    }
}
Vue.component('HelloWorld', HelloWorld);
</script>

<style lang='stylus' scoped>
@require '~@/assets/styles/entry/_variable.styl';

.hello-world {}
</style>
