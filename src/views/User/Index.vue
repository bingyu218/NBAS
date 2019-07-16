<template lang="jade">
div.layout-content-main
	site(:is="currentTab" keep-alive)
</template>

<script>
import followList from "./Info/FollowList"
import userInfo from "./Info/UserInfo"
import upkeepList from "./Info/UpkeepList"
import maintainList from "./Info/MaintainList"
import assessList from "./Info/AssessList"
export default {
	data() {
		return {
			currentTab: 'userInfo'
		};	
	},
	components: { 
		userInfo,
		followList,
		maintainList,
		upkeepList,
		assessList,
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
