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
					Button.mr-10(type="primary",icon="search",@click="options.page=1,search()")|搜索
	Table(:stripe="true",:columns="column",:data="list",stripe)
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
				nicname: '',
				name:'',
				id:'',
				count:0,
			},
			column: [
				{
					title: '工单编号',
					key: 'id',
				},
				{
					title: '型号',
					key: 'typeId',
				},
				{
					title: '详细地址',
					key: 'address',
				},
				{
					title: '错误码',
					key: 'code',
				},
				{
					title: '状态',
					key: 'status',
				},
				{
					title: '创建时间',
					key: 'creatTime',
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
									type: 'success',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.$router.push({
											name: 'editContractor',
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
				id:1,
				typeId:'控制柜',
				address:'北京北京朝阳区双井街道176号',
				code: 290,
				status:'已接单',
				creatTime:'2018-10-29 15:31:26',
			}],
			options: {
				name:'',
				type: 0,
				page: 1,
				num: 15,
				total: 1
			}
		}
	},
	methods: {
		async deleteRow(params) {		
			this.list.splice(params,1)
			let count = count-1
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
