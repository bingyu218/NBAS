<template lang="jade">
div.layout-content-main
	div.form
		Form(ref='form',:model="query",label-position="left",:label-width="72")
			Row(:gutter="20")
				Col(span="6")
					Form-item(label="工单编号：")
						Input(v-model="query.id",placeholder="请输入工单编号")
				Col(span="6")
					Form-item(label="电梯型号：",)
						Input(v-model="query.deviceid",placeholder="请输入电梯型号")
				Col(span="6")
					Button.mr-10(type="primary",icon="search",@click="options.page=1,search()")|搜索
					router-link.mr-10(:to="{ name: 'maintainContractorNew'}")
						Button(type="success",icon="plus",)|添加工单
	Table(:columns="column",:data="list",:stripe="true")
	<Page style="padding-right: 38%;" class="pagination" show-elevator :total="options.total" :page-size="options.num" :current="options.page" @on-change="pageChange" show-total></Page>
</template>

<script>
export default {
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
					maxWidth:90,
				},
				{
					title: '型号',
					key: 'typeId',
					maxWidth:80,
				},
				{
					title: '详细地址',
					key: 'address',
					minWidth: 120,
				},
				{
					title: '检验单位',
					key: 'code',
					minWidth: 80,
				},
				{
					title: '检验时间',
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
									type: 'primary',
									size: 'small'
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.$router.push({
											name: 'upkeepInfo',
											params: {
												id: params.row.id
											}
										})
									}
								}
							}, '查看'),
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
				code: '北京市特种设备检测中心',
				creatTime:'2018-10-29 15:31:26',
			},{
				id:2,
				typeId:'控制柜',
				address:'山西长治襄垣县',
				code: '长治特种设备检测中心',
				creatTime:'2018-10-29 15:31:26',
			},{
				id:3,
				typeId:'控制柜',
				address:'天津天津和平区',
				code: '天津市特种设备检测中心',
				creatTime:'2018-10-29 16:11:26',
			}],
			options: {
				name:'',
				type: 0,
				page: 1,
				num: 15,
				total: 3,
			}
		}
	},

	methods: {
		pageChange(val) {
			this.options.page = val
		},
		async deleteRow(params) {		
			this.list.splice(params,1)
			this.options.total = this.options.total-1
		},
	}
}
</script>

<style lang="css">
</style>
