<template lang="jade">
div.layout-content-main
	div.form
		Form(ref='form',:model="query",label-position="left",:label-width="100")
			Row(:gutter="16")
				Col(span="6")
					Form-item(label="单位名称：")
						Input(v-model="query.name",placeholder="请输入使用单位名")
				Col(span="6")
					Form-item(label="手机号码：")
						Input(v-model="query.mobile",placeholder="请输入手机号码")
				Col(span="6")
					Button.mr-10(type="primary",icon="search",:loading="loading",@click="options.page=1,search()")|搜索
					router-link.mr-10(:to="{ name: 'maintainUseDepNew'}")
						Button(type="success",icon="plus",:loading="loading")|添加联系人
	Table(:loading="loading",:stripe="true",:columns="column",:data="list",stripe)
	Page(style="padding-right: 38%;" class="pagination" show-elevator :total="options.total" ,:page-size="options.num" ,:current="options.page" ,@on-change="pageChange()" show-total )
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
				id:''
			},
			column: [
				{
					title: '单位名称',
					key: 'name',
				},
				{
					title: '单位编号',
					key: 'id',
				},
				{
					title: '详细地址',
					key: 'address',
				},
				{
					title: '电梯数',
					key: 'nicname',
				},
				{
					title: '联系方式',
					key: 'mobile',
				},
// 				{
// 					title: '维保班组',
// 					key: 'groupName',
// 				},
// 				{
// 					title: '维保站点',
// 					key: 'siteName',
// 				},
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
										// 	name: 'editProperty',
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
											name: 'editUseDep',
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
				type: 3,
				page: 1,
				num: 15,
				total: 0
			}
		}
	},
	methods: {
		async deleteRow(params) {		
				let res = await this.$api.removeCompany({id:params.row.id})
				this.$emit('on-custom-comp');
				if (0 === res.data.code) {
					this.$Message.info('操作成功');
				}else {
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
				this.options.total = res.data.data.totalNumber
			}
		}
	}
}
</script>

<style lang="css">
</style>
