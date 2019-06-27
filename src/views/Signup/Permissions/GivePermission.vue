<template>
  <div id="intro" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      CONNECT
    </div>
    <div class="wrapper">
      <p class="icon-title">
        Stap {{parseInt($route.params.id)+1}}
      </p>
      <div class="progress-bar">
        <div class="progress" :style="'width:'+(25*$route.params.id) +'%'"></div>
      </div>
      <p class="icon-text">
        {{permissions[$route.params.id].title}}
      </p>
      <img class="step-icon" :src="require('../../../assets/images/signup/permission/'+permissions[$route.params.id].icon)" />
      <p class="step-text">
        {{permissions[$route.params.id].text}}
      </p>
    </div>
    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'Intro'}">DOORGAAN</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator'

@Component({})
export default class Intro extends Vue {
  private permissions: Array <Object> = [
      { "key": "tracking", "title": "Zet app-usage aan", "text": "Yona wil het gebruik van je apps graag kunnen meten. Deze data is compleet veilig en zal nooit gedeeld worden met derden.", "icon": "tracking_icon_small.svg", "is_allowed": false },
      { "key": "store_files", "title": "Geef Yona toestemming om bestanden op te slaan", "text": "Yona wil bestanden op je telefoon bewaren. We zullen nooit bestanden van je telefoon bekijken of gegevens doorgeven aan derden.", "icon": "store_files_icon_small.svg", "is_allowed": false },
      { "key": "certificate", "title": "Accepteer Yona certificaat", "text": "Voor een veilige verbinding is het nodig een certificaat te installeren. Het certificaat zorgt ervoor dat je data nergens weg kan lekken.", "icon": "certificate_icon_small.svg", "is_allowed": false },
      { "key": "vpn", "title": "Activeer VPN verbinding", "text": "Bijna klaar. Nu het certificaat is geaccepteerd kan er een veilige VPN verbinding worden gemaakt. Ook hier is jouw toestemming nodig.", "icon": "vpn_profile_icon_small.svg", "is_allowed": false }
  ];

  mounted () {

  }
}
</script>

<style lang="scss">
  #intro{
    img.step-icon{
      margin-top:40px;
      width:100px;
    }
    .step-text{
      font-weight:300;
      font-size: 1.2rem;
      margin-top:30px;
      padding:0 40px;
      color:#fff;
    }
    .bottom-aligned{
      .button{
        width:100%;
        border:0;
      }
    }
  }
</style>