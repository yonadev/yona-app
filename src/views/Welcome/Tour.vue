<template>
  <div id="tour">
    <div v-for="(slide, index) in slides" class="slide" :key="index+1" :class="['slide-'+index, {'active': index===0}]">
      <div class="dots has-text-centered">
        <div v-for="n in 4" :class="{'active': index === (n-1)}" :key="'dot-'+n"></div>
      </div>

      <p class="tour-title has-text-centered">
        {{slide.title}}
      </p>

      <div class="image-wrapper">
        <img class="tour-image" :src="require('@/assets/tour_images/tour_image_'+index+'.svg')" />
        <p class="tour-text">
          {{slide.text}}
        </p>
        <svg class="tour-svg" x="0px" y="0px" viewBox="0 0 200 1000">
          <polygon points="0,0 325,200 1000,1000 0,1000" />
        </svg>
      </div>

      <button class="skip-tour">
        <img class="skip-icon" src="../../assets/tour_images/icon_next.svg" />
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 200 160">
          <polygon points="0,160 240,240 240,0" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import {Prop, Watch} from 'vue-property-decorator'

@Component({})
export default class Tour extends Vue {

  @Prop() slides: Array = [
      { "title": "Transparantie", "text": "Persoonlijke keuze om transparant te zijn..." },
      { "title": "Delen", "text": "Je doelen delen met de persoon die je vertrouwt" },
      { "title": "Grenzen", "text": "Grenzen afspreken en daar anderen in betrekken" },
      { "title": "Tijdsbesteding", "text": "Controle houden over de tijd die je online bent" }
  ]

  //Cycle hooks
  mounted () {
  }

  //Computed properties
  get computedMsg () : string {
      return '';
  }

  //Methods
  methodFunction () {
  }
}
</script>

<style lang="scss">
  
  #tour{
    height:100%;
    position: relative;
    overflow: hidden;
    .slide{
      display:none;
      &.active{
        display:block;
      }
      //Set colors
      &.slide-0{
        .tour-title{
          color:#e8308a;
        }
        .image-wrapper{
          svg polygon{
            fill:#e8308a;
          }
        }
        .dots{
          div.active{
            background-color:#e8308a;
          }
        }
      }
      &.slide-1{
        .tour-title{
          color:#95c11f;
        }
        .image-wrapper{
          svg polygon{
            fill:#95c11f;
          }
        }
        .dots{
          div.active{
            background-color:#95c11f;
          }
        }
      }
      &.slide-2{
        .tour-title{
          color:#1d71b8;
        }
        .image-wrapper{
          svg polygon{
            fill:#1d71b8;
          }
        }
        .dots{
          div.active{
            background-color:#1d71b8;
          }
        }
      }
      &.slide-3{
        .tour-title{
          color:#f9b233;
        }
        .image-wrapper{
          svg polygon{
            fill:#f9b233;
          }
        }
        .dots{
          div.active{
            background-color:#f9b233;
          }
        }
      }
    }
    .dots{
      margin:30px 0;
      div{
        height:8px;
        width:8px;
        background-color:#d8d8d8;
        display:inline-block;
        margin:0 10px;
        border-radius:100%;
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
          fill:#6c2a58;
        }
      }
    }
  }
</style>