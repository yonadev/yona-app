<template>
  <span>
    <img width="100%" v-if="pic_data && pic_data.src" :src="pic_data.src" />
    <svg
      style="min-height: 2.5rem; min-width: 2.5rem"
      viewBox="0 0 50 50"
      v-else-if="pic_data"
    >
      <circle
        cx="25"
        cy="25"
        r="25"
        :fill="pic_data.type === 'buddy' ? '#6c2a58' : '#1d71b8'"
      />
      <text
        dominant-baseline="middle"
        text-anchor="middle"
        font-size="1.25rem"
        fill="white"
        x="25"
        y="26"
      >
        {{ pic_data.text }}
      </text>
    </svg>
  </span>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class ProfilePic extends Vue {
  @Prop() src!: string;
  @Prop() data!: {
    type: string;
    text: string;
  };

  pic_data: {} = {};

  mounted() {
    if (this.src) {
      const pic_src = window.localStorage.getItem(this.src);

      if (pic_src !== null) {
        this.pic_data = JSON.parse(pic_src);
      }
    } else if (this.data) {
      this.pic_data = this.data;
    }
  }
}
</script>

<style scoped lang="scss">
div {
  display: inline-block;

  img {
    border-radius: 50%;
  }
}
</style>
