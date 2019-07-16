<template lang="jade">
div.layout-content-main
	Tabs(value="name1",:animated="false",@on-click="Onchange")
		TabPane(label="未读",name="Unit")
		TabPane(label="已读",name="Site")
		TabPane(label="全部",name="all")
	div.form
		Row(:gutter="30" style="padding-bottom:5%")
			Col(span="24")
				Card()
					Table(:stripe="true",:columns="column",:data="list",stripe)
					Page(style="padding-right: 38%;" class="pagination" show-elevator :total="options.total" ,:page-size="options.num" ,:current="options.page" ,@on-change="pageChange()" show-total )
</template>

<script>
export default{	
	data(){
		return{
			info:{
				count: 0,
			},
			column:[{
				title: '发件人',
				key:'name',
			},{
			    title: '标题',
				key:'title',
			},{
			    title: '时间',
				key:'time',
			},{
				title: '操作',
				key: 'userName',
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
										name: 'readNotice',
									// 	params: {
									// 		id: params.row.id
									// 	}
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
						}, '删除'),
					]);
				}
			}],
			list: [{
				name:"王云辉",
				title:"关于群组人员的事",
				time: "2018-11-07 09:44"				
			}],
			options: {
				name: '',
				type:  1,
				page:  1,
				num:   3,
				total: 0,
			}
			
		}
	},
	methods:{
		Onchange: function(val) {
			this.$router.push({
				name: 'maintain'+val,
			})
		}
	}
}
	
</script>

<style lang="scss" scoped>

	.box-header{
		font-size: 20px;
	}
</style>