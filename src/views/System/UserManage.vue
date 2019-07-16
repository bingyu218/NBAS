<template lang="jade">
div.layout-content-main
	div.form
		Form(ref='form',:model="options",label-position="left",:label-width="120")
			Row(:gutter="16")
				Col(span="6")
					Form-item(:label="$t('user name')+'：'")
						Input(v-model="options.username",placeholder="")
				Col(span="6")
					Form-item(:label="$t('phone number')+'：'")
						Input(v-model="options.mobile",placeholder="")
				Col(span="6")
					Button.mr-10(type="primary",icon="ios-search",:loading="loading",@click="options.page=1,search()")|{{$t('search')}}
	div(style="min-height: 450px")
		Table(:loading="loading",:stripe="true",:columns="column",:data="list",stripe size="small")
	Col(span=6)|&nbsp;
	Col(span=18)
		Page(show-elevator :total="options.total" ,:page-size="options.num" ,:current="options.page" ,@on-change="pageChange" show-total )
</template>

<script>
export default {
	data() {
		return {
			loading: true,
			rmUser:this.global.functions.rem_user,
			options: {
				username: '',
				mobile: '',
				name:'',
				id:'',
				page: 1,
				num: 10,
				total: 0
			},
			column: [
				{
					title: this.$t('user name'),
					key: 'username',
				},
				{
					title: this.$t('user introduction'),
					key: 'introduction',
				},
// 				{
// 					title: this.$t('profession'),
// 					key: 'profession',
// 				},
				{
					title: this.$t('role'),
					render: (h, params) => {
						var authority;
						if (params.row.username=='admin') {authority='超级管理员'}
						else {authority='普通用户'}
						return h('div', authority)
					}
				},
				{
					title: this.$t('phone number'),
					key: 'mobile',
				},
				{
					title: this.$t('email'),
					key: 'email',
				},
				{
					title: this.$t('handle'),
					key: 'userName',
					width: 300,
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
											name: 'writeInform',
											params: {
												id: params.row.id,
												username: params.row.username,
												title: '',
											}
										})
									}
								}
							}, this.$t('sent notice')),
							h('Button', {
								props: {
									type: 'error',
									size: 'small',
									disabled:this.rmUser!=true,
								},			
								on: {
									click: () => {
										this.$Modal.confirm({
											title: this.$t('warning'),
											content: this.$t('Make sure you want to delete this item？'),
											onOk: () => {
												this.deleteRow(params)											
											},
											onCancel: () => {
											}
										})	
									}
								}
							}, this.$t('delete')),
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
		async deleteRow(params) {
				let res = await this.$api.removePeople({id:params.row.id})
				this.$emit('on-custom-comp');
				if (0 === res.data.code) {
					this.$Message.info('操作成功');
					this.getList()
				}else {
					this.$Message.info('操作失败');
				}
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
	}
}
</script>

<style lang="css">
</style>
