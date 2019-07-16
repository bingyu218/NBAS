<template lang="jade">
div.layout-content-main
	div.form
		Form(ref='form',:model="options",label-position="left",:label-width="60" @keydown.enter.native.prevent="options.page=1,search()")
			div(style="padding-bottom:5px")
				Row(:gutter="10")
					Col(span="2")
						Select(style="width:100%" placeholder="全部")
							Option(key="1" label="全部" value="all")
							Option(key="2" label="游客" value="all")
							Option(key="3" label="普通用户" value="all")
							Option(key="4" label="超级管理员" value="all")
					Col(span="17")
						Button.mr-10(type="success",icon="md-add",:loading="loading",@click="newRole()" v-if="newRoles!=true" disabled="false")|添加角色
						Button.mr-10(type="success",icon="md-add",:loading="loading",@click="newRole()" v-else)|添加角色
						Button.mr-10(type="primary",:loading="loading",@click="goRole()")|角色管理
					Col(span="5")
						Button.mr-10(type="primary",icon="ios-search",:loading="loading",@click="options.page=1,search()")
						Input(v-model="options.username",placeholder="请输入搜索内容" style="width:75%;")
	div(style="min-height: 450px")
		Table(:loading="loading",:stripe="true",:columns="column",:data="list",stripe size="small")
	Col(span=24 style="text-align:center;")
		Page(show-elevator :total="options.total" ,:page-size="options.num" ,:current="options.page" ,@on-change="pageChange" show-total )
</template>

<script>
export default {
	data() {
		return {
			loading: true,
			options: {
				username: '',
				mobile: '',
				name:'',
				id:'',
				page: 1,
				num: 10,
				total: 0
			},
			newRoles:this.global.functions.new_roles,
			roles:this.global.functions.assign_roles,
			column: [
				{
					title: '用户名称',
					key: 'username',
				},
				{
					title: '用户描述',
					key: 'introduction',
				},
				{
					title: '职务',
					key: 'profession',
				},
				{
					title: '角色',
					render: (h, params) => {
						var authority;
						if (params.row.username=='admin') {authority='超级管理员'}
						else {authority='普通用户'}
						return h('div', authority)
					}
				},
				{
					title: '电话',
					key: 'mobile',
				},
				{
					title: '邮箱',
					key: 'email',
				},

				{
					title: '操作',
					key: 'userName',
					width: 300,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									disabled:this.roles != true,
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.$router.push({
											name: 'confer',
											params: {
												userId: params.row.id,
											}
										})
									}
								}
							}, '角色分配'),
						]);
					}
				}
			],
			list: [],
		}
	},
	created() {
		this.loading = false
		this.getList()
	},
	methods: {
		pageChange(val) {
			this.options.page = val
			this.getList()
		},
		async getList() {
			this.loading = true
			let res = await this.$api.people(this.options)
			this.loading = false
			if (0 === res.data.code) {
				this.list = res.data.data.list
				this.options.total = res.data.data.totalNumber
			}
		},
		async search() {
			this.loading = true
			let res = await this.$api.people(this.options)
			this.loading = false
			if (0 === res.data.code) {
				this.list = res.data.data.list
			}
		},
		goRole(){
			this.$router.push({
				name: 'role',
			})
		},
		newRole(){
			this.$router.push({
				name: 'addrole',
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.mr-10{
		margin-right: 10px;
	}
</style>
