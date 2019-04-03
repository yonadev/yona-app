<template>
  <div id="intro" class="colored-background purple-dark pincode-template">
    <div class="nav-title">
      DOE MEE
    </div>
    <div class="wrapper">
      <p class="icon-title">
        Bedankt voor het registreren!
      </p>
      <div class="progress-bar">
        <div class="progress"></div>
      </div>
      <p class="icon-text">
        Laten we Yona actief en werkend krijgen
      </p>
      <ul class="permissions-list">
        <li v-for="(permission, index) in permissions" :key="index" class="columns is-mobile">
          <img class="column is-2" :src="require('../../../assets/images/signup/permission/'+permission.icon)" />
          <p class="column">
            {{permission.title}}
          </p>
          <div class="column is-1">
            <img v-if="permission.is_allowed" class="check" :src="require('../../../assets/images/signup/permission/icon_check_green.svg')" />
            <img v-else="" class="check not-allowed" :src="require('../../../assets/images/signup/permission/icon_check_white.svg')" />
          </div>
        </li>
      </ul>
    </div>
    <div class="is-centered bottom-aligned">
      <router-link class="button" :to="{name: 'GivePermission', params: { id: 0 }}">VOLGENDE</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Component} from 'vue-property-decorator'

@Component({})
export default class Intro extends Vue {
  private permissions: Array <Object> = [
      { "key": "tracking", "title": "Maak app-tracking mogelijk", "icon": "tracking_icon_small.svg", "is_allowed": false },
      { "key": "store_files", "title": "Geef Yona toestemming om bestanden op te slaan", "icon": "store_files_icon_small.svg", "is_allowed": false },
      { "key": "certificate", "title": "Accepteer Yona certificaat", "icon": "certificate_icon_small.svg", "is_allowed": false },
      { "key": "vpn", "title": "Activeer VPN verbinding", "icon": "vpn_profile_icon_small.svg", "is_allowed": false }
  ]
}
</script>

<style lang="scss">
  #intro{
    .progress-bar{
      .progress{
        width:100%;
      }
    }
    .permissions-list{
      margin-top:60px;
      list-style:none;
      color:#fff;
      padding:0;
      text-align: left;
      li{
        .column{
          display:inline-flex;
          align-items:center;
        }
        p{
          margin:0;
          line-height:1.5rem;
          font-weight:300;
        }
        img.not-allowed{
          opacity:0.3;
        }
      }
    }
    .bottom-aligned{
      .button{
        width:100%;
        border:0;
      }
    }
  }
</style>