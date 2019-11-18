<template>
  <div class="card">
    <div class="card-image">
      <slot name="image" />
    </div>
    <div class="card-content">
      <div class="media">
        <slot name="media" />
      </div>

      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style>

</style>
