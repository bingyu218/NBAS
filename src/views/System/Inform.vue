<template lang="jade">
div.layout-content-main
	Row(:gutter=1)
		Col(span=2)
			Select.smr(v-model="done" style="width:100%;", :placeholder="$t('state')" @on-change="getList()")
				Option(key="1", :label="$t('all')" value='all')
				Option(key="2", :label="$t('read')" value="true")
				Option(key="3", :label="$t('unread')" value="false")
	div.form(style="margin-top:20px")
		Row(:gutter="30")
			Col(span="24")
				div(style="min-height: 450px;")
					Table(:stripe="true",:columns="column",:data="list",stripe size="small")
				Col(span=6)|&nbsp;
				Col(span=18)
				Page(show-elevator :total="options.total" ,:page-size="options.num" ,:current="options.page" ,@on-change="pageChange" show-total )
</template>

<script>
export default{	
	data(){
		return{
			done:'false',
			informtype:'all',
			haveread:'yes',
			info:{
				count: 0,
			},
			column:[{
				title: this.$t('sender'),
				key:'username',
				render: (h, params) => {
					return h('div', ['admin'])}
			},{
			    title: this.$t('title'),
				key:'title',
			},{
				title: this.$t('create time'),
				key:'createTime',
				render: (h, params) => {
					var time=this.$format(params.row.createTime, 'YYYY-MM-DD HH:mm:ss')
					return h('div', time)}
			},{
					title: this.$t('handle'),
					key: 'companyName',
					width: 400,
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
										 	name: 'readInform',
											params: {
												id: params.row.id
											}
										 })
									}
								}
							}, this.$t('watch')),
// 							h('Button', {
// 								props: {
// 									type: 'success',
// 									size: 'small'
// 								},
// 								style: {
// 									marginRight: '5px'
// 								},
// 								on: {
// 									click: () => {
// 										this.$router.push({
// 											name: 'writeInform',
// 											params: {
// 												id: params.row.id
// 											}
// 										})
// 									}
// 								}
// 							}, '回复'),
// 							h('Button', {
// 								props: {
// 									type: 'error',
// 									size: 'small'
// 								},
// 								on: {
// 									click: () => {	
// 										this.$Modal.confirm({
// 											title: '警告!',
// 											content: '<p>是否删除此项 ？</p>',
// 											onOk: () => {
// 												this.deleteRow(params)											
// 											},
// 											onCancel: () => {
// 											}
// 										})																																
// 									}
// 								}
// 							}, '删除'),
						]);
					}
				}],
			list: [],
			options: {
				name:'',
				done:'false',
				type: 1,
				page: 1,
				num: 10,
				total: 0
			}
			
		}
	},
	created(){
		this.getList()
	},
	methods:{
		Onchange: function(val) {
			this.$router.push({
				name: 'maintain'+val,
			})
		},
		pageChange(val) {
			this.options.page = val
			this.getList()
		},
		async getList(){
			if (this.done == 'all') {this.options.done = ''}
			else {this.options.done = this.done}
			let mes = await this.$api.message({num:10,page:1,done:this.options.done})
			if (mes.data.code == 0){
			this.list = mes.data.data.list
			}
			else {
				this.$Notice.error({
					title: this.$t('error'),
					desc: this.$t('Fail to send notice'),
				})
			}
		},
		formatDate(val, format) {
			return formatDate(val, format)
		},
	}
}
	
</script>

<style lang="scss" scoped>

	.box-header{
		font-size: 20px;
	}
</style>