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
					Button.mr-10(type="primary",icon="search",:loading="loading",@click="options.page=1,search()")|搜索
					router-link.mr-10(:to="{ name: 'maintainContractorNew'}")
						Button(type="success",icon="plus",:loading="loading")|添加工单
	Table(:loading="loading",:stripe="true",:columns="column",:data="list",stripe)
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
			},
			column: [
				{
					title: '工单编号',
					key: 'id',
				},{
					title: '型号',
					key: 'deviceid',
				},{
					title: '故障等级',
					key: 'time',
				},{
					title: '错误码',
					key: '',
				},{
					title: '创建时间',
					key: 'time',
				},{
					title: '详细地址',
					key: 'address',
				},{
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
										// 	name: 'infoContractor',
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
			list: [],
			options: {
				name:'',
				type: 0,
				page: 1,
				num: 15,
				total: 0
			}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		pageChange(val) {
			this.options.page = val
			this.getList()
		},
		async deleteRow(params) {
				let res = await this.$api.removeCompany({id:params.row.id})
				this.$emit('on-custom-comp');
				if(0 === res.data.code){
					this.$Message.info('操作成功');
				}else{
					this.$Message.info('操作失败');
				}
		},
		async getList() {
			this.loading = true
			let res = await this.$api.company(this.options)
			this.loading = false
			if (0 === res.data.code) {
				this.list = res.data.data.list
				for(var i=0;i<this.list.length;i++){
					this.list[i].address = this.list[i].province+this.list[i].city+this.list[i].district+this.list[i].address
				}
				this.options.total = res.data.data.totalNumber
			}
		},
		async search() {
			this.loading = true
			let res = await this.$api.company(this.query)
			this.loading = false
			if (0 === res.data.code) {
				this.list = res.data.data.list
			}
		}
	}
}
</script>

<style lang="css">
</style>
