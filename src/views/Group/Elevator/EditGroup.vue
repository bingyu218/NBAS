<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=5)
				Col(span=9)
					Card
						Row
							Form(ref="form",:data="form",:rules="rules",:label-width="80")
								Col(span=22)
									Form-item(label="电梯组名:" v-model="form.name")
										Input(:value="form.name")
									Form-item(label="创建人:" v-model="form.leader")
										Input(:value="form.leader" disabled)
									Form-item(label="所在区域",prop="location",data-toggle="distpicker")
										Cascader(:data="region" v-model="form.region")
									Form-item(label="电话:" v-model="form.phone")
										Input(:value="form.mobile")
									Col.ta(span="8")
										Button(type="success" @click="upGroup()" ,:loading="loading")|提交
									Col.ta(span="8")
										Button(type="primary" @click="getList2(),dislist=true")|设备列表
									Col.ta(span="8")
										Button(@click="$router.back(-1)")|取消
				Col(span=15)
					Card
						Row
							div.form
								Form(ref='query',:model="query",label-position="right",:label-width="100" @keydown.enter.native.prevent="search()")
									div
										Row(:gutter=5)
											Col(span="9" style="margin-bottom:5px")
												Input(v-model="options.search_info",placeholder="请输入搜索内容" style="width:60%")
												Button.ml-10(type="primary",icon="ios-search",:loading="loading",@click="options.page=1,search()")
											Col(span="9" style="margin-bottom:5px")
												Input(v-model="options.install_addr",placeholder="请输入安装地址" style="width:60%")
												Button.ml-10(type="primary",icon="ios-search",:loading="loading",@click="options.page=1,search()")
							div.minheight
								Table(border,:columns="columns1",:data="list",size="small" stripe)
						Row
							Col.ta(span="24")
								Page(show-elevator :total="list.length",:page-size="options.num",:current="options.page",@on-change="pageChange",show-total)
		el-dialog(:visible.sync="dislist")
			Row(:gutter=5)
				Col.list(span="24")|设备列表
			Table(border,:columns="columns2",:data="list1",size="small" stripe)
</template>

<script>
	import region from '@/views/region.json'
	export default{
		data(){
			return{
				region: region,
				dislist:false,
				cityList: [],
				districtList: [],
				loading:false,
				IMEI:'',
				options:{
					install_addr:'',
					search_info:'',
					total:10,
					num:10,
					page:1,
					state:'',
				},
				query:{
					group_id:this.$route.params.id,
					num:10,
					page:1,
				},
				form:{},
				rules: {
					groupname: [{
						required: true,
							type: 'string',
							message: '请填写电梯组名称',
							trigger: 'blur'
					}],
					username: [{
						required: false,
						type: 'string',
						message: '请填写电梯组负责人',
						trigger: 'blur'
					}],
					phone: [{
						required: false,
						type: 'string',
						pattern:/^1(3|4|5|7|8)\d{9}$/,
						message: '请填写正确的号码',
						trigger: 'blur'
					}],
				},
				list:[],
				list1:[],
				columns1: [
				{
					title: '电梯别名',
					key: 'name',
				},
				{
					title: '安装地址',
					key: 'install_addr',
				},
				{
					title: '操作',
					key: 'IMEI',
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
									click:()=>{
										this.$router.push({
											name: 'ladderInfo',
											params: {
												id: params.row.id
											}
										})
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
									click:()=>{
										this.updateLadder(params.row.id)
									}
								}
							}, '添加')
						]);
					}
				}],
				columns2: [
				{
					title: '电梯别名',
					key: 'name',
				},
				{
					title: '安装地址',
					key: 'install_addr',
				},
				{
					title: '操作',
					key: 'IMEI',
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
									click:()=>{
										this.$router.push({
											name: 'ladderInfo',
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
								style: {
									marginRight: '5px'
								},
								on: {
									click:()=>{
										this.rmLadder(params.row.id)
									}
								}
							}, '删除')
						]);
					}
				}],
			}
		},
		created(){
			this.getList()
			this.getGroup()
		},
		methods:{
			async search() {
				this.options.page = 1
				this.getList()
			},
			pageChange(val) {
				this.options.page = val
				this.getList()
			},
			async getGroup(){
				const res = await this.$api.readGroup({
					id:this.$route.params.id,
					nums:1,
					page:1,
				})
				this.form = res.data.data.list[0]
				this.form.region = this.form.region.split(',')
				delete this.form.t_create
			},
			async getList() {
				const res = await this.$api.reLadder(this.options)
				this.list = res.data.data.list
				this.total = res.data.data.totalNumber
			},
			async getList2() {
				const res = await this.$api.reLadder(this.query)
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
			async upGroup(){
				this.loading = true
				this.form.region = this.form.region[0].toString()+','+this.form.region[1].toString()+','+this.form.region[2].toString()
				const res = await this.$api.updateGroup(this.form)
				if (res.data.code == 0) {
					this.loading = false
					this.$Notice.success({
						title: '成功',
						desc: '添加成功！'
					});
				}else{
					this.loading = false
					this.$Notice.error({
					title: '失败',
					desc: '添加失败'
					});
				}
			},
			async updateLadder(val){
				let res = await this.$api.upLadderGroup({
					id:this.$route.params.id,
					ladder_id:val,
				})
				if (res.data.code == 0) {
					this.loading = false
					this.$Notice.success({
						title: '成功',
						desc: '添加成功！'
					});
				}else{
					this.loading = false
					this.$Notice.error({
					title: '失败',
					desc: '添加失败'
					});
				}
			},
			async rmLadder(val){
				let res = await this.$api.rmLadderGroup({
					ladder_id:val,
				})
				if (res.data.code == 0) {
					this.$Notice.success({
						title: '成功',
						desc: '删除成功！'
					});
					this.getList2()
				}else{
					this.$Notice.error({
					title: '失败',
					desc: '删除失败'
					});
				}
			}
		}
	}	
</script>

<style lang="scss" scoped>
	.inline{
		display: inline-block;
	}
	.username{
		font-size: 30px;
		color: #222;
		display: inline-block;
	}
	.role{
		font-size: 14px;
		color: #999;
		display: inline-block;
	}
	.ta{
		text-align: center;
	}
	.minheight{
		min-height: 450px;
	}
	.ml-10{
		margin-left: 5px;
	}
	.list{
		text-align: center;
		font-size: 20px;
		margin-bottom:20px;
	}
</style>
