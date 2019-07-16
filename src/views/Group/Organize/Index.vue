<template lang="jade">
	div.layout-content-main
		div.form
			Form(ref='query',:model="query",label-position="right",:label-width="100" @keydown.enter.native.prevent="getOrganize()")
				div(style="padding-bottom:5px")
					Row(:gutter=5)
						Col(span="19")
							Button.mr-10(type="success",icon="md-add",:loading="loading",@click="goOrganize()")|添加群组
						Col(span="5")
							Button.mr-10(type="primary",icon="ios-search",:loading="loading",@click="options.page=1,getOrganize()")
							Input(v-model="query.number",placeholder="请输入搜索内容" style="width:75%;")
		div(style="min-height:450px")
			Table(:columns="columns",:data="list",size="small" stripe)
		Col(span="24" style="text-align:center;")
			Page(show-elevator :total="options.total",:page-size="options.num",:current="options.page" on-change="pageChange",show-total)
		el-dialog(:visible.sync="dislist" width="80%")
			Table.bt-10(border,:columns="columns2",:data="list1",size="large" stripe)
</template>

<script>
	export default {
		data() {
			return {
				username:window.localStorage.getItem("username"),
				options:{
					page:1,
					nums:10,
					total:0,
				},
				query:{
					page:1,
					nums:10,
					number:'',
				},
				dislist:false,
				list:[],
				list1:[],
				loading:false,
				columns: [{
					title: '群号',
					key: 'number',
				},{
					title: '组名',
					key: 'name',
				},{
					title: '创建人',
					key: 'leader',
				},{
					title: '地址',
					key: 'region',
				},{
					title: '操作',
					key: 'IMEI',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'success',
									size: 'small',
									disabled:this.username==params.row.leader,
									loading: this.loading,
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click:()=>{
										this.joinGroup(params.row.number)
									}
								}
							}, '加入'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									loading: this.loading,
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click:()=>{
										this.$router.push({
											name: 'editOrganize',
											params:{
												id: params.row.id
											}
										})
									}
								}
							}, '编辑'),
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									loading: this.loading,
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click:()=>{
										this.dislist=true
										this.getGroup(params.row.organize_id)
									}
								}
							}, '设备'),
							h('Button', {
								props: {
									type: 'error',
									size: 'small',
									loading: this.loading,
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click:()=>{
										this.rmOrganize(params.row.id)
									}
								}
							}, '删除'),
						]);
					}
				}],
				columns2: [{
					title: '设备名称',
					key: 'name',
				},{
					title: '地址',
					key: 'install_addr',
				},{
					title: '控制柜',
					key: 'ctrl',
				},{
					title: '门机',
					key: 'door1',
				},{
					title: '门机',
					key: 'door2',
				},],
			}
		},
		created() {
			this.Organize()
		},
		methods:{
			goOrganize(){
				this.$router.push({
					name:'addOrganize',
				})
			},
			async Organize(){
				this.loading = true
				const res = await this.$api.readOrganize({
					username:window.localStorage.getItem("username"),
					nums:10,
					page:1,
				})
				if(res.data.code == 0){
					this.list = res.data.data.list
					this.options.total = res.data.data.totalNumber
				}
				this.loading = false
			},
			async getOrganize(){
				this.loading = true
				if(this.query.number==null||this.query.number==""){
					this.$Notice.error({
						title: '失败',
						desc: '请输入搜索内容！'
					});
				}else{
					const res = await this.$api.readOrganize(this.query)
					if(res.data.code == 0){
						this.list = res.data.data.list
						this.options.total = res.data.data.totalNumber
					}
				}
				this.loading = false
			},
			async rmOrganize(val){
				this.loading = true
				const res = await this.$api.rmOrganize({
					id:val,
				})
				if(res.data.code == 0){
					this.$Notice.success({
						title: '成功',
						desc: '删除成功！'
					});
						this.getOrganize()
				}else{
					this.$Notice.error({
						title: '失败',
						desc: '删除失败'
					});
				}
				this.loading = false
			},
			async joinGroup(val){
				this.loading = true
				const res = await this.$api.joinGroup({
					number:val,
				})
				if(res.data.code == 0){
					this.$Notice.success({
						title: '成功',
						desc: '加入成功！'
					});
					this.getOrganize()
				}else{
					this.$Notice.error({
						title: '失败',
						desc: '加入失败'
					});
				}
				this.loading = false
			},
			async getGroup(val){
				const res = await this.$api.reLadder({
					num:10,
					page:1,
					group_id:val,
				})
				if (res.data.code === 0) {
					this.list1 = res.data.data.list
					this.total = res.data.data.totalNumber
				} else {
					this.$Notice.error({
						title: '错误',
						desc: '获取列表失败'
					});
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mr-10{
		margin-right: 10px;
	}
	.ta{
		text-align: center;
	}
	.bt-10{
		margin-top: 10px;
		width: 100%;
	}
</style>
