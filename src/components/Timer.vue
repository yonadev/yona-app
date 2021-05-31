<template>
  <div class="timer">
    <p class="hours">
      {{ hours | twoDigits }}<span>{{ $t("timer_hour") }}</span>
    </p>
    <p class="minutes">
      {{ minutes | twoDigits }}<span>{{ $t("timer_minute") }}</span>
    </p>
    <p class="seconds">
      {{ seconds | twoDigits }}<span>{{ $t("timer_second") }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";

@Component({})
export default class PinCode extends Vue {
  @Prop() time!: number;
  private now: number = Math.trunc(new Date().getTime() / 1000);

  mounted() {
    window.setInterval(() => {
      this.now = Math.trunc(new Date().getTime() / 1000);
    }, 1000);
  }

  get seconds() {
    return (this.time - this.now) % 60;
  }

  get minutes() {
    return Math.trunc((this.time - this.now) / 60) % 60;
  }

  get hours() {
    return Math.trunc((this.time - this.now) / 60 / 60);
  }
}

Vue.filter("twoDigits", function (value: any) {
  if (value.toString().length <= 1) return "0" + value.toString();

  return value.toString();
});
</script>

<style lang="scss">
.timer {
  p {
    margin: 15px 0;
    display: inline-block;
    padding: 10px;
    color: #fff;
    font-size: 4rem;
    span {
      vertical-align: top;
      font-size: 1.3rem;
      opacity: 0.4;
      margin-top: 7px;
      display: inline-block;
    }
  }
}
</style>
