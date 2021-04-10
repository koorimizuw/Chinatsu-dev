<template>
  <img alt="Vue logo" class="element-plus-logo" src="../assets/logo.png" />
  <h1>{{ msg }}</h1>

  <el-button icon="el-icon-success" type="primary" @click="increment"
    >count is: {{ count }}</el-button
  >

  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
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
</style>