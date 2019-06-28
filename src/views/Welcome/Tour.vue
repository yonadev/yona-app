<template>
  <div id="tour">
    <div id="tour-slider">
      <div v-for="(slide, index) in slides" class="slide" :key="index+1" :class="['slide-'+index, {'': index===0}]">
        <p class="tour-title has-text-centered">
          {{slide.title}}
        </p>

        <div class="image-wrapper">
          <img class="tour-image" :src="require('@/assets/images/welcome/tour/tour_image_'+index+'.svg')" />
          <p class="tour-text">
            {{slide.text}}
          </p>
          <svg class="tour-svg" x="0px" y="0px" viewBox="0 0 200 1000">
            <polygon points="0,0 325,200 1000,1000 0,1000" />
          </svg>
        </div>
      </div>
    </div>
    <router-link :to="{name: 'Choose'}">
      <button class="skip-tour">
        <img class="skip-icon" src="../../assets/images/welcome/tour/icon_next.svg" />
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 200 160">
          <polygon points="0,160 240,240 240,0" />
        </svg>
      </button>
    </router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator'
import { tns } from '@/../node_modules/tiny-slider/src/tiny-slider'

@Component({})
export default class Tour extends Vue {
  private slides: Array <Object> = [
      { "title": "Transparantie", "text": "Persoonlijke keuze om transparant te zijn..." },
      { "title": "Delen", "text": "Je doelen delen met de persoon die je vertrouwt" },
      { "title": "Grenzen", "text": "Grenzen afspreken en daar anderen in betrekken" },
      { "title": "Tijdsbesteding", "text": "Controle houden over de tijd die je online bent" }
  ]

  //Cycle hooks
  mounted () {
      tns({
          mode: "gallery",
          container: '#tour-slider',
          items: 1,
          slideBy: 1,
          nav: true,
          controls: false,
          mouseDrag: true,
          autoplay:true,
          autoplayTimeout: 4000,
          autoplayButtonOutput: false
      });
  }
}
</script>

<style lang="scss">
  @import "../../sass/variables";
  #tour{
    height:100%;
    position: relative;
    overflow: hidden;
    .tns-outer{
      height:100%;
      #tour-slider-mw{
        height:100%;
      }
    }
    .slide{
      &.active{
        display:block;
      }
      //Set colors
      &.slide-0{
        .tour-title{
          color:$color-purple;
        }
        .image-wrapper{
          svg polygon{
            fill:$color-purple;
          }
        }
      }
      &.slide-1{
        .tour-title{
          color:$color-green;
        }
        .image-wrapper{
          svg polygon{
            fill:$color-green;
          }
        }
      }
      &.slide-2{
        .tour-title{
          color:$color-blue;
        }
        .image-wrapper{
          svg polygon{
            fill:$color-blue;
          }
        }
      }
      &.slide-3{
        .tour-title{
          color:$color-yellow;
        }
        .image-wrapper{
          svg polygon{
            fill:$color-yellow;
          }
        }
      }
    }
    .tns-nav{
      margin:30px 0;
      button{
        height:8px;
        width:8px;
        background-color:#d8d8d8;
        display:inline-block;
        margin:0 10px;
        border-radius:100%;
        border:none;
        padding:0;
        &.tns-nav-active{
          &:first-child{
            background-color:$color-purple;
          }
          &:nth-child(2){
            background-color:$color-green;
          }
          &:nth-child(3){
            background-color:$color-blue;
          }
          &:nth-child(4){
            background-color:$color-yellow;
          }
        }
      }
    }
    .tour-title{
      font-size:2rem;
      margin:30px 0;
    }
    .image-wrapper {
      position:relative;
      text-align: center;
      .tour-image {
        width: 70%;
      }
      .tour-svg{
        position:absolute;
        top:0;
        left:0;
        z-index:-1;
      }
      .tour-text{
        line-height:2rem;
        font-size:1.4rem;
        font-weight:300;
        margin:30px;
        color:#FFF;
      }
    }
    .skip-tour{
      position:fixed;
      width:40%;
      bottom:0;
      right:0;
      border:none;
      padding: 15px 23px;
      background-color: transparent;
      text-align:right;

      svg {
        position: absolute;
        z-index: -1;
        bottom: 0;
        right: 0;
        width: 100%;
        height: auto;
        polygon{
          fill:$color-purple-dark;
        }
      }
    }
  }
</style>