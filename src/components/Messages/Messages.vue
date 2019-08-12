<template>
  <div id="messages">
    <div class="message-bar" v-if="threadMessages.length">
      <img :src="require('../../assets/images/icons/icn_comment.svg')" />
      <span class="chat-icon"></span>
    </div>
    <div class="thread-messages" v-if="!replying">
      <div v-for="(thread, t_index) in threadMessages" :key="'t' + t_index">
        <div
          class="columns is-mobile has-text-left"
          v-for="(message, index) in thread.messages"
          :key="index"
        >
          <div class="column is-3 user-photo">
            <profile-pic
              v-if="index === 0"
              :src="
                message._links['yona:buddy']
                  ? buddy(message._links['yona:buddy'].href)._embedded[
                      'yona:user'
                    ]._links.self.href
                  : 'user_image'
              "
            ></profile-pic>
          </div>
          <div class="column text">
            <p class="username is-vcentered" :class="{ replies: index !== 0 }">
              <profile-pic
                class="profile-img"
                v-if="index !== 0"
                :src="
                  message._links['yona:buddy']
                    ? buddy(message._links['yona:buddy'].href)._embedded[
                        'yona:user'
                      ]._links.self.href
                    : 'user_image'
                "
              ></profile-pic>
              <span :class="{ 'with-img': index !== 0 }">{{
                message.nickname
              }}</span>
            </p>
            <p class="message">{{ message.message }}</p>
          </div>
        </div>
        <div class="columns is-mobile">
          <div class="column is-3 user-photo"></div>
          <div class="column has-text-left">
            <a
              class="react-to"
              v-if="thread.reply_link"
              @click="replyToMessage(thread)"
              >Beantwoorden</a
            >
            <hr />
          </div>
        </div>
      </div>
      <div
        class="infinite-scroll"
        :class="{ loading }"
        v-observe-visibility="
          (isVisible, entry) => this.getMessages(isVisible, entry, nextMessages)
        "
      ></div>
    </div>
    <div class="thread-messages" v-if="replying">
      <div
        class="columns is-mobile has-text-left"
        v-for="(message, index) in replyingMessage.messages"
        :key="index"
      >
        <div class="column is-3 user-photo">
          <profile-pic
            v-if="index === 0"
            :src="
              message._links['yona:buddy']
                ? buddy(message._links['yona:buddy'].href)._embedded[
                    'yona:user'
                  ]._links.self.href
                : 'user_image'
            "
          ></profile-pic>
        </div>
        <div class="column text">
          <p class="username is-vcentered" :class="{ replies: index !== 0 }">
            <profile-pic
              class="profile-img"
              v-if="index !== 0"
              :src="
                message._links['yona:buddy']
                  ? buddy(message._links['yona:buddy'].href)._embedded[
                      'yona:user'
                    ]._links.self.href
                  : 'user_image'
              "
            ></profile-pic>
            <span :class="{ 'with-img': index !== 0 }">{{
              message.nickname
            }}</span>
          </p>
          <p class="message">{{ message.message }}</p>
          <br />
        </div>
      </div>
    </div>
    <div
      class="text-bar"
      v-if="buddy_href || (replyingMessage && replyingMessage.reply_link)"
    >
      <textarea v-model="newMessage"></textarea>
      <button @click="submitMessage">VERSTUREN</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Prop, Component } from "vue-property-decorator";
import axios from "@/utils/axios/axios";
import ProfilePic from "@/components/ProfilePic/ProfilePic.vue";
import { Buddy } from "@/store/buddies/types";
import { Getter } from "vuex-class";

@Component({
  components: { ProfilePic }
})
export default class Messages extends Vue {
  @Prop({ default: "" }) message_link!: string;
  @Prop({ default: "" }) buddy_href!: string;
  @Prop() thread!: any;
  loading: boolean = false;
  newMessage: string = "";
  gettingMessages: boolean = false;
  nextMessages: string = "";
  replying: boolean = false;
  replyingMessage: any = [];
  threadMessages: any = [];

  @Getter("buddy", { namespace: "buddies" })
  public buddy!: (href: string) => Buddy;

  async mounted() {
    if (this.thread) {
      this.gettingMessages = true;
      this.threadMessages.push({
        threadHeadMessageId: this.thread.threadHeadMessageId,
        reply_link: this.thread._links["yona:reply"].href,
        messages: [this.thread]
      });

      this.replying = true;
      this.replyingMessage = this.threadMessages[0];
    } else {
      await this.getMessages(true, true, this.message_link);
    }
  }

  replyToMessage(thread: any) {
    this.replying = true;
    this.replyingMessage = thread;
  }

  async getMessages(isVisible: boolean, entry: any, href: string) {
    if (isVisible && !this.gettingMessages && !this.loading) {
      this.loading = true;
      if (href) {
        let self = this;

        this.gettingMessages = true;

        let messages: any = await axios.get(href).catch(error => {
          console.log(error);
        });

        this.loading = false;

        if (messages) {
          if (messages.data._links.next) {
            this.nextMessages = messages.data._links.next.href;
            this.gettingMessages = false;
          } else {
            this.nextMessages = "";
          }

          if (messages.data._embedded) {
            messages.data._embedded["yona:messages"].forEach((message: any) => {
              let threads = self.threadMessages.find((mes: any) => {
                return mes.threadHeadMessageId === message.threadHeadMessageId;
              });

              if (threads) {
                if (message._links["yona:reply"]) {
                  threads.reply_link = message._links["yona:reply"].href;
                }
                threads.messages.push(message);
              } else {
                self.threadMessages.push({
                  threadHeadMessageId: message.threadHeadMessageId,
                  reply_link: message._links["yona:reply"]
                    ? message._links["yona:reply"].href
                    : "",
                  messages: [message]
                });
              }
            });
          }
        }
      }
    }
  }

  async submitMessage() {
    let message_href, body;

    if (this.replyingMessage && this.replyingMessage.reply_link) {
      message_href = this.replyingMessage.reply_link;
      body = {
        properties: {
          message: this.newMessage
        }
      };
    } else {
      message_href = this.message_link;
      body = {
        message: this.newMessage
      };
    }

    let new_message_response: any = await axios
      .post(message_href, body)
      .catch(error => {
        console.log(error);
      });

    if (new_message_response) {
      this.threadMessages = [];
      this.gettingMessages = false;
      await this.getMessages(true, true, this.message_link);
      this.newMessage = "";
      this.replyingMessage = "";
      this.replying = false;
    }
  }
}
</script>

<style lang="scss">
@import "../../sass/variables";
#messages {
  .message-bar {
    position: relative;
    background-color: #d8d8d8;
    text-align: left;
    padding: 15px 0 10px 35px;
    z-index: 1;
    img {
      height: 18px;
    }
    .chat-icon {
      height: 15px;
      width: 15px;
      background-color: #f3f3f3;
      display: block;
      transform: rotate(45deg);
      position: absolute;
      bottom: -10px;
      z-index: 9;
    }
  }
  .text-bar {
    position: fixed;
    bottom: 51px;
    background-color: #f3f3f3;
    display: block;
    min-height: 30px;
    text-align: left;
    z-index: 10;
    height: 45px;
    width: 100%;
    box-sizing: border-box;
    textarea {
      background-color: #f3f3f3;
      border: none;
      border-top: 1px solid #d5d5d5;
      z-index: 10;
      height: 100%;
      width: 63%;
      box-sizing: border-box;
    }
    button {
      vertical-align: top;
      color: #fff;
      border: none;
      background-color: $color-blue;
      height: 100%;
      padding: 0 15px;
      width: 37%;
    }
  }
  .thread-messages {
    background-color: #f3f3f3;
    padding-bottom: 45px;
    .columns {
      margin: 0;

      .user-photo {
        max-width: 60px;
        height: auto;
        margin-top: 5px;
        svg {
          height: 60px;
          width: 60px;
        }
      }

      img {
        border-radius: 50%;
      }
      .text {
        .username {
          margin-top: 10px;
          margin-bottom: 5px;
          &.replies {
            margin-top: 0;
          }
          span {
            opacity: 0.4;
            &.with-img {
              line-height: 35px;
              display: inline-block;
              vertical-align: top;
              margin-left: 10px;
            }
          }
          .profile-img {
            display: inline-block;
            width: 40px;
            height: 40px;
          }
        }
        .message {
          margin: 5px 0;
          word-break: break-all;
        }
      }
    }
    hr {
      width: 100%;
      border: 1px solid #e7e7e7;
      float: left;
      display: block;
      margin: 0;
    }

    .react-to {
      display: block;
      margin-top: 0px;
      margin-bottom: 15px;
      color: $color-blue;
    }
  }
}
</style>
