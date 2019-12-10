<template>
  <div class="video-list" > 
    <template v-for="video in videoList">
      <div
        class="video-item"
        :video="video"
        :key="video.id"
      >
        <div class="address">
          {{ipAddress}}
        </div>
        <video
          controls
          autoplay
          playsinline
          ref="videos"
          :height="cameraHeight"
          :muted="video.muted"
          :id="video.id"
        />
      </div>
    </template>
  </div>
</template>

<script>
import RTCMultiConnection from 'rtcmulticonnection';

export default {
  name: 'vue-webrtc',
  data() {
    return {
      rtcmConnection: null,
      localVideo: null,
      videoList: [],
      canvas: null,
      ipAddress: '',
    };
  },
  props: {
    roomId: {
      type: String,
      default: 'public-room'
    },
    socketURL: {
      type: String,
      default: 'https://rtcmulticonnection.herokuapp.com:443/'
    },
    cameraHeight: {
      type: [Number, String],
      default: 160
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    screenshotFormat: {
      type: String,
      default: 'image/jpeg'
    },
    enableAudio: {
      type: Boolean,
      default: true
    },
    enableVideo: {
      type: Boolean,
      default: true
    },
    enableLogs: {
      type: Boolean,
      default: false
    },
  },
  mounted() {
    const pc = new RTCPeerConnection();
    
    pc.createOffer().then((info) => {
      const position = info.sdp.indexOf('IP4');
      const IP = info.sdp.substr(position).split('\n')[0];
      this.ipAddress = IP;
      pc.setLocalDescription(info);
    })
    
    
    this.rtcmConnection = new RTCMultiConnection();
    this.rtcmConnection.socketURL = this.socketURL;
    this.rtcmConnection.autoCreateMediaElement = false;
    this.rtcmConnection.enableLogs = this.enableLogs;
    this.rtcmConnection.session = {
      audio: this.enableAudio,
      video: this.enableVideo
    };
    this.rtcmConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: this.enableAudio,
      OfferToReceiveVideo: this.enableVideo
    };
    this.rtcmConnection.onstream = stream => {
      let found = this.videoList.find(video => {
        return video.id === stream.streamid
      })
      if (found === undefined) {
        let video = {
          id: stream.streamid,
          muted: stream.type === 'local'
        };

        this.videoList.push(video);

        if (stream.type === 'local') {
          this.localVideo = video;
        }
      }

      setTimeout(() => { 
        for (let i = 0, len = this.$refs.videos.length; i < len; i++) {
          if (this.$refs.videos[i].id === stream.streamid)
          {
            this.$refs.videos[i].srcObject = stream.stream;
            break;
          }
        }
      }, 1000);
      
      this.$emit('joined-room', stream.streamid);
    };
    this.rtcmConnection.onstreamended = stream => {
      let newList = [];
      this.videoList.forEach(item => {
        if (item.id !== stream.streamid) {
          newList.push(item);
        }
      });
      this.videoList = newList;
      this.$emit('left-room', stream.streamid);
    };


    
  },
  methods: {
    join() {
      this.rtcmConnection.openOrJoin(this.roomId, (isRoomExist, roomid) => {
        if (!isRoomExist && this.rtcmConnection.isInitiator) {
          this.$emit('opened-room', roomid);
        }
      });
    },
    leave() {
      this.rtcmConnection.attachStreams.forEach(localStream => {
        localStream.stop();
      });
      this.videoList = [];
    },
    capture() {
      return this.getCanvas().toDataURL(this.screenshotFormat);
    },
    getCanvas() {
      const video = this.getCurrentVideo();
      if (video !== null && !this.ctx) {
        let canvas = document.createElement('canvas');
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
      }
      const { ctx, canvas } = this;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas;
    },
    getCurrentVideo() {
      if (this.localVideo === null) {
        return null;
      }
      for (let i = 0, len = this.$refs.videos.length; i < len; i++) {
        if (this.$refs.videos[i].id === this.localVideo.id)
          return this.$refs.videos[i];
      }
      return null;
    },
  }
};
</script>
<style scoped>
.video-list {
  background: whitesmoke;
  height: auto;
  display: flex;
}

.video-list div {
  padding: 0px;
}

.video-item {
  background: #c5c4c4;
  display: inline-block;
  flex: 1;
  position: relative;
}

.video-item .address {
  position: absolute;
  z-index: 9;
  color: #fff;
}

.video-item video {
  transform: rotateY(180deg);
  width: 100%;
  height: 100%;
}
</style>
