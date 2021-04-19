<template>
  <div class="container">
    <h1>Welcome to Chinatsu.</h1>
    <p>メニューから項目を選択してください。</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const count = computed(() => store.state.count);
const increment = () => store.commit("increment");
</script>

<style lang="scss" scoped>
.element-plus-logo {
  width: 50%;
}
a {
  color: #42b983;
}
.container {
  margin: 0 10px;
}
</style>