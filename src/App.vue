<template lang="jade">
div#app
	transition(name="fade")
		router-view
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss" scoped>
#app {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    min-width: 1200px;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-active {
    opacity: 0;
}
  @import "./assets/demo/css/main.css";
  @import "./assets/demo/css/color-dark.css";     /*深色主题*/
</style>
