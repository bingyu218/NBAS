<template lang="jade">
	div.layout-content-main
		div.box
			div.box-header.with-border
				p.box-title 角色分配
			form.form-horizontal
				div.box-body
					Row(:gutter="10")
						Col(span="16")
							Card()
								p(slot="title")|当前已有角色
								div()
									Button.lp(v-for="role in roleList" ,:data="roleList" v-bind:key="role.id" type="primary" @click="submit(role.id)")|{{role.name}}
				div.box-footer
					div.col-sm-offset-2
						Button.ml-5(@click="$router.back(-1)")|取消
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
			submit(val){
				this.$Modal.confirm({
					title: '确定要分配该角色吗？',
					content:'',
					onOk: async () => {
						let res = await this.$api.confer({
							id:val,
							userId:this.$route.params.userId,
						})
						if(res.data.code==0){
							this.$Notice.success({
								title: '成功',
								desc: '角色分配成功！'
							});
							this.$router.back(-1)
						}else{
							this.$Notice.error({
								title: '失败',
								desc: '角色分配失败！'
							});
						}
					},
					onCancel: () => {
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