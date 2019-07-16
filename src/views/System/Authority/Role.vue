<template lang="jade">
	div.layout-content-main
		div.box
			div.box-header.with-border
				p.box-title 角色管理
			form.form-horizontal
				div.box-body
					Row(:gutter="10")
						Col(span="16")
							Card()
								p(slot="title")|当前已有角色
								div()
									Button.lp(v-for="role in roleList" ,:data="roleList" v-bind:key="role.id" type="primary" @click="goRole(role.id)")|{{role.name}}
				div.box-footer
					div.col-sm-offset-2
						Button.ml-5(@click="$router.back(-1)")|返回
</template>

<script>
	export default {
		data () {
			return {
				options: {
					page: 1,
					num: 10,
				},
				roleList:[],
			}
		},
		created() {
			this.getRole()
		},
		methods: {
			async getRole(){
				const res = await this.$api.getRole(this.options)
				if(res.data.code==0){
					this.roleList = res.data.data.list
				}
			},
			goRole(val){
				this.$router.push({
					name: 'editrole',
					params: {
						id: val,
					}
				})
			},
		}
	}
</script>

<style lang="css">
	.content{
		overflow: auto;
	}
	.lp{
		margin-right: 5px;
	}
	.layout-content-main{
		overflow-y: scroll !important;
	}
	.ml-5{
		margin-left: 5px;
	}
</style>