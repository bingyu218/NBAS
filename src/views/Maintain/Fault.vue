<template lang="jade">
div.layout-content-main
	div.form
		Form(ref='form',:model="query",label-position="left",:label-width="72")
			Row(:gutter="20")
				Col(span="6")
					Form-item(label="工单编号：")
						Input(v-model="query.id",placeholder="请输入工单编号")
				Col(span="6")
					Form-item(label="电梯型号：")
						Input(v-model="query.deviceid",placeholder="请输入电梯型号")
				Col(span="6")
					Button.mr-10(type="primary",icon="search",@click="options.page=1,search()")|搜索
					router-link.mr-10(:to="{ name: 'maintainContractorNew'}")
						Button(type="success",icon="plus",)|添加工单
	Table(:columns="column",:data="list",:stripe="true")
	<Page class="pagination" show-elevator :total="options.total" :page-size="options.num" :current="options.page" @on-change="pageChange" show-total></Page>
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
					minWidth: 60,
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
										params.row.status = '已接单'
									}
								}
							}, '接单'),
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
										params.row.status = '未接单'
									}
								}
							}, '取消'),
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
			},{
				id:2,
				typeId:'控制柜',
				address:'山西长治襄垣县',
				code: 290,
				status:'未接单',
				creatTime:'2018-10-29 15:31:26',
			},{
				id:3,
				typeId:'控制柜',
				address:'天津天津和平区',
				code: 290,
				status:'未接单',
				creatTime:'2018-10-29 16:11:26',
			}],
			options: {
				name:'',
				type: 0,
				page: 1,
				num: 15,
				total: 3
			}
		}
	},
	created() {
		// this.getList()
	},
	methods: {
		pageChange(val) {
			this.options.page = val
			this.getList()
		},
		async deleteRow(params) {
// 				let res = await this.$api.removeEvent({id:params.row.id})
// 				this.$emit('on-custom-comp');
// 				this.list[params].id = null;
// 				if (0 === res.data.code) {
// 					this.$Message.info('操作成功');
// 				}else {
// 					this.$Message.info('操作失败');
// 				}
				this.list.splice(params,1)
				this.options.total = this.options.total-1
		},
// 		async getList() {
// 			this.loading = true
// 			let res = await this.$api.evnet(this.options)
// 			this.loading = false
// 			if (0 === res.data.code) {
// 				this.list = res.data.data.list
// 				for(var i=0;i<this.list.length;i++){
// 					this.list[i].address = this.list[i].province+this.list[i].city+this.list[i].district+this.list[i].address
// 				}
// 				this.options.total = res.data.data.totalNumber
// 			}
// 		},
		async search() {
// 			this.loading = true
// 			let res = await this.$api.event(this.query)
// 			this.loading = false
// 			if (0 === res.data.code) {
// 				this.list = res.data.data.list
// 			}
			let res = this.query
			this.list = this.list[0]
			
		}
	}
}
</script>

<style lang="css">
</style>
