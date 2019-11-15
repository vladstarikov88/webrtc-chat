<template>
  <div class="container">
    <h2>Room</h2>
    <input v-model="roomId">
    <vue-webrtc
      ref="webrtc"
      width="100%"
      :roomId="roomId"
      @joined-room="logEvent"
      @left-room="logEvent"
      @open-room="logEvent"
      @error="onError"
      @opened-room="logEvent"
      @share-started="logEvent"
      @share-stopped="logEvent"
    />
    <button
      type="button"
      @click="onJoin"
    >Join</button>
    <button
      type="button"
      @click="onLeave"
    >Leave</button>
  </div>
</template>

<script>
import { WebRTC } from 'vue-webrtc';

export default {
  name: 'app',
  components: {
    'vue-webrtc': WebRTC,
  },
  data() {
    return {
      img: null,
      roomId: 'public-room',
    };
  },
  methods: {
    onJoin() {
      // какой долбаеб писал?
      console.log('dsa');
      this.$refs.webrtc.join();
    },
    onLeave() {
      // кайф
      this.$refs.webrtc.leave();
    },
    onError(error, stream) {
      console.log('On Error Event', error, stream);
    },
    logEvent(event) {
      console.log('Event : ', event);
    },
  },
};
</script>
