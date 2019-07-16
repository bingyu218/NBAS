<template lang="jade">
div.layout-content-main
	site(:is="currentTab" keep-alive)
</template>

<script>
	import unit from './Maintain/Unit'
	import site from './Maintain/Site'
	import group from './Maintain/Group'
	import member from './Maintain/Member'
export default {
	data() {
		return {
			currentTab: 'unit'
		};	
	},
	components: { 
		unit,
		site,
		group,
		member
 },
 watch: {
		'currentTab':function(val){
			this.currentTab = currentTab
		}
 },
	methods: {
		toggleTab: function(TabPane) {
			this.currentTab = this.TabPane;
		}
	}
}
</script>

<style lang="css">
</style>
