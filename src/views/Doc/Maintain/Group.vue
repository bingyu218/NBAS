<template lang="jade">
div.layout-content-main
	Tabs(value="name1",:animated="false",@on-click="Onchange")
		TabPane(label="维保单位",name="Unit")
		//TabPane(label="维保站点",name="Site")
		TabPane(label="维保群组",name="Group")
		TabPane(label="维保人员",name="Member")
	div.form(padding-top="100")
		Form(ref='form',:model="query",label-position="left",:label-width="100")
			Row(:gutter="12")
				Col(span="6")
					Form-item(label="班组名称：")
						Input(v-model="query.name",placeholder="请输入班组名称")
				Col(span="6")
					Form-item(label="手机号码：")
						Input(v-model="query.mobile",placeholder="请输入手机号码")
				Col(span="6")
					Button.mr-10(type="primary",icon="search",@click="options.page=1,search()")|搜索
					router-link(:to="{ name: 'maintainGroupNew'}")
						Button.mr-10(type="success",icon="plus",)|添加维保班组		
	div(style="min-height:450px")
		Table(:stripe="true",:columns="column",:data="list",stripe)
	div.form
		Col(span='24' style="text-align:center;")
			Page(show-elevator :total="options.total",:page-size="options.num",:current="options.page",@on-change="pageChange",show-total)
</template>

<script>
export default {
	created() {
		// this.getList()
	},
	data() {
		return {
			loading: true,
			query: {
				username: '',
				mobile: '',
				nicname: ''
			},
			column: [
// 				{
// 					title: '人员账号',
// 					key: 'username',
// 				},
				{
					title: '维保班组',
					key: 'name',
				},
				{
					title: '负责人',
					key: 'contactor',
				},
				{
					title: '联系方式',
					key: 'mobile',
				},
// 				{
// 					title: '维保站点',
// 					key: 'siteName',
// 				},
				{
					title: '维保单位',
					key: 'maintenanceCompanyName',
				},
				{
					title: '详细地址',
					key: 'address',
				},
				{
					title: '操作',
					key: 'companyName',
					width: 200,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										// this.$router.push({
										// 	name: 'infoMaterial',
										// 	params: {
										// 		id: params.row.id
										// 	}
										// })
									}
								}
							}, '查看'),
							h('Button', {
								props: {
									type: 'success',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.$router.push({
											name: 'maintainGroupNew',
											params: {
												id: params.row.id
											}
										})
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'error',
									size: 'small'
								},
								on: {
									click: () => {
										this.$Modal.confirm({
											title: '警告!',
											content: '<p>是否删除此项 ？</p>',
											onOk: () => {
												this.deleteRow(params)											
											},
											onCancel: () => {
											}
										})	
									}
								}
							}, '删除')
						]);
					}
				}
			],
			list: [{
				name:'测试一组',
				contactor:'管理员A',
				mobile:'12345678910',
				maintenanceCompanyName:'上海江菱',
				address:'浙江省宁波市',
			}],
			options: {
				name:'',
				page: 1,
				num: 15,
				total: 0
			}
		}
	},

	methods: {
		async deleteRow(params) {		
				let res = await this.$api.removeTeam({id:params.row.id})
				this.$emit('on-custom-comp');
				if (0 === res.data.code) {
					this.$Message.info('操作成功');
					this.getList()
				}else {
					this.$Message.info('操作失败');
				}
		},
		pageChange(val) {
			this.options.page = val
			this.getList()
		},
// 		async getList() {
// 			this.loading = true
// 			let res = await this.$api.team(this.options)
// 			this.loading = false
// 			if (0 === res.data.code) {
// 				this.list = res.data.data.list
// 				this.options.total = res.data.data.totalNumber
// 			}
// 		},
		async search() {
			this.loading = true
			let res = await this.$api.team(this.query)
			this.loading = false
			if (0 === res.data.code) {
				this.list = res.data.data.list
				this.options.total = res.data.data.totalNumber
			}
		},
		Onchange: function(val) {
			this.$router.push({
				name: 'maintain'+val,
			})
		}
	}
}
</script>

<style lang="css">
</style>
