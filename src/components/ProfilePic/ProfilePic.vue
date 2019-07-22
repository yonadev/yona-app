<template>
  <div>
    <img width="100%" v-if="pic_data && pic_data.src" :src="pic_data.src" />
    <svg width="100%" height="35px" viewBox="0 0 50 50" v-else-if="pic_data">
      <circle
        cx="25"
        cy="25"
        r="25"
        :fill="pic_data.type === 'buddy' ? '#6c2a58' : '#1d71b8'"
      />
      <text
        dominant-baseline="middle"
        text-anchor="middle"
        font-size="15"
        fill="white"
        x="25"
        y="26"
      >
        {{ pic_data.text }}
      </text>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  components: {}
})
export default class ProfilePic extends Vue {
  @Prop() src!: string;

  pic_data: {} = {};

  mounted() {
    const pic_src = window.localStorage.getItem(this.src);

    if (pic_src !== null) {
      this.pic_data = JSON.parse(pic_src);
    }
  }
}
</script>

<style scoped>
div {
  display: inline-block;
}
</style>
