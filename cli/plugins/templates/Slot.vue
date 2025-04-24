<template>
  <div>
    lang?.hello_world
    <br>I am slot!
  </div>
</template>

<script lang="ts">
  import { Component } from 'vue-property-decorator';
  import { DocHubComponentProto } from 'dochub-sdk/classes/vue2';

  @Component
  export default class Slot extends DocHubComponentProto {
  }

</script>

<style scoped>

</style>
