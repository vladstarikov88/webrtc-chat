<template>
  <section class="section">
    <div class="container">
      <card>
        <!-- <h2>Комната</h2> -->
        <input
          v-model="roomId"
          class="input"
          type="text"
          placeholder="Идентификатор комнаты"
        >
        <vue-webrtc
          class="video-container"
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

        <div class="buttons">
          <button
            type="button"
            class="button is-primary"
            @click="onJoin"
          >Присоединиться</button>
          <button
            type="button"
            class="button is-primary"
            @click="onLeave"
          >Покинуть</button>
        </div>
      </card>
    </div>
  </section>
</template>

<script>
import { WebRTC } from 'vue-webrtc';
import Card from '@/components/Card.vue';

export default {
  name: 'app',
  components: {
    'vue-webrtc': WebRTC,
    Card,
  },
  data() {
    return {
      img: null,
      roomId: '37537051',
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

<style lang="scss" scoped>
.input {
  margin-bottom: 2rem;
  max-width: 20rem;
}
.buttons {
  justify-content: center;
}
.video-container {
  background: unset;
  margin-bottom: 2rem;
}
</style>
