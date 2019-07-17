<template>
    <div>
        <img :src="pic_src"/>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Component, Prop} from "vue-property-decorator";

    @Component({
        components: {
        }
    })
  export default class ProfilePic extends Vue {
        @Prop() user_image!: string;
        name: "ProfilePic"

        pic_src: string = null;

        mounted() {
            this.pic_src = window.localStorage.getItem(this.user_imgae);
        }

    }
</script>

<style scoped>

</style>