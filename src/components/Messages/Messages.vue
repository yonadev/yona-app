<template>
  <div id="messages">
    <div class="message-bar">
      <img :src="require('../../assets/images/icons/icn_comment.svg')"/>
      <span class="chat-icon"></span>
    </div>
    <div class="message">
      <div class="columns is-mobile has-text-left" v-for="(message, index) in messages" :key="index">
        <div class="column is-3 user-photo">
          <profile-pic :src="(message._links['yona:user'] ? 'user_image' : '')"></profile-pic>
        </div>
        <div class="column text">
          <p class="username">{{message.nickname}}</p>
          <p class="message">{{message.message}}</p>
          <hr/>
        </div>
      </div>
    </div>
    <div class="text-bar">
      <textarea v-model="newMessage"></textarea>
      <button @click="submitMessage">VERSTUREN</button>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import {Prop, Component} from 'vue-property-decorator'
  import axios from "@/utils/axios/axios"
  import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
  import {Buddy} from "@/store/buddies/types";
  import {Getter} from "vuex-class";

  @Component({
    components: {ProfilePic},
  })
  export default class Messages extends Vue {
    @Prop({default: ''}) message_link!: string;
    messages: any = [];
    newMessage: string = '';
    gettingMessages: boolean = false;
    nextMessages: string = '';

    @Getter("buddy", { namespace: "buddies" })
    public buddy!: (href: string) => Buddy;

    async mounted(){
      await this.getMessages(this.message_link);

      const  f = async (evt: any) => {
        if (Math.round(window.innerHeight + window.scrollY) >= document.body.scrollHeight && !this.gettingMessages) {
          this.gettingMessages = true;
          await this.getMessages(this.nextMessages);
        }
      };

      window.addEventListener("scroll", f);
    }

    async getMessages(href: string){
      if(href) {
        let self = this;
        let messages: any = await axios.get(href).catch((error) => {
          console.log(error)
        });

        if (messages) {
          if (messages.data._links.next) {
            this.nextMessages = messages.data._links.next.href;
            this.gettingMessages = false;
          } else {
            this.nextMessages = '';
          }
          messages.data._embedded['yona:messages'].forEach((message: any) => {
            self.messages.push(message);
          });
        }
      }
    }

    async submitMessage(){
      let new_message_response: any = await axios.post(this.message_link, {
        message: this.newMessage
      }).catch((error) => {
        console.log(error)
      });

      if(new_message_response){
        this.messages.push(new_message_response.data);
        this.newMessage = '';
      }
    }
  }
</script>

<style lang="scss">
  @import "../../sass/variables";
  #messages{
    padding-bottom:45px;
    .message-bar {
      position: relative;
      background-color: #d8d8d8;
      text-align: left;
      padding:15px 0 10px 35px;
      z-index:1;
      img{
        height: 18px;
      }
      .chat-icon{
        height:15px;
        width:15px;
        background-color:#f3f3f3;
        display:block;
        transform: rotate(45deg);
        position: absolute;
        bottom:-10px;
        z-index:9;
      }
    }
    .text-bar{
      position: fixed;
      bottom:51px;
      background-color:#f3f3f3;
      display:block;
      min-height:30px;
      text-align:left;
      z-index:10;
      height:45px;
      width:100%;
      box-sizing:border-box;
      textarea{
        background-color:#f3f3f3;
        border:none;
        border-top:1px solid #d5d5d5;
        z-index:10;
        height:100%;
        width:63%;
        box-sizing:border-box;
      }
      button{
        vertical-align: top;
        color:#fff;
        border:none;
        background-color:$color-blue;
        height:100%;
        padding:0 15px;
        width: 37%;
      }
    }
    .message{
      background-color:#f3f3f3;
      .columns{
        margin: 0;
        padding: 10px 0 5px;

        img{
          border-radius:50%;
        }
        .text{
          .username{
            margin-top:20px;
            opacity:0.4;
          }
        }
        hr{
          display:none;
        }

        &:not(:last-of-type){
          hr{
            width: 90%;
            border: 1px solid #e7e7e7;
            float:left;
            display:block;
          }
        }
      }
    }
  }
</style>