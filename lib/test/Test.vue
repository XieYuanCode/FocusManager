<template>
  <div>
    <input type="text">
    <input type="text">
    <input type="text">
    <input type="text">
    <input type="text">
  </div>
</template>

<script>
import FocusManager from "../focus-manager";
import VueDispatcher from "../../vue-dispatcher";

FocusManager.configure({
  dispatcher: new VueDispatcher()
});
/* eslint-disable */
export default {
  mounted() {
    FocusManager.attach(this);
  }
};
</script>

<style>
</style>
