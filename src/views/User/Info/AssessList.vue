<template lang="jade">
div.layout-content-main
	Tabs(value="name1",:animated="false",@on-click="Onchange")
		TabPane(label="基本信息",name="userInfo")
		TabPane(label="我的关注",name="followList")
		TabPane(label="我的维修",name="maintainList")
		TabPane(label="我的保养",name="upkeepList")
		TabPane(label="我的评估",name="assessList")
	div.form(padding-top="100")
		Form(ref='form',:model="query",label-position="left",:label-width="100")
			Row(:gutter="12")
				Col(span="6")
					Form-item(label="电梯编号：")
						Input(v-model="query.id",placeholder="请输入电梯编号")
				Col(span="6")
					Button.mr-10(type="primary",icon="search",:loading="loading",@click="options.page=1,search()")|搜索
	Table(:loading="loading",:stripe="true",:columns="column",:data="list",stripe)
	<Page style="padding-right: 38%;" class="pagination" show-elevator :total="options.total" :page-size="options.num" :current="options.page" @on-change="pageChange" show-total></Page>
</template>

<script>
export default {
	created() {
		this.getList()
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
					{
						title: '电梯编号',
						key: 'id',
					},{
						title: '维保站点',
						key: 'siteName',
					},
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
											// this.$router.push({
											// 	name: 'editMaterial',
											// 	params: {
											// 		id: params.row.id
											// 	}
											// })
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
				list: [],
				options: {
					name:'',
					page: 1,
					num: 15,
					total: 0
				}
			}
		},
	methods:{
		async deleteRow(params) {		
				let res = await this.$api.removeTeam({id:params.row.id})
				this.$emit('on-custom-comp');
				if (0 === res.data.code) {
					this.$Message.info('操作成功');
				}else {
					this.$Message.info('操作失败');
				}
		},
		pageChange(val) {
			this.options.page = val
			this.getList()
		},
		async getList() {
			this.loading = true
			let res = await this.$api.team(this.options)
			this.loading = false
			if (0 === res.data.code) {
				this.list = res.data.data.list
				this.options.total = res.data.data.totalNumber
			}
		},
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
				name: val,
			})
		}
	}
}
</script>

<style lang="scss" scoped>
</style>
