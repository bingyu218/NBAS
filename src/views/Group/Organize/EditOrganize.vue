<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=5)
				Col(span=9)
					Card(style="margin-top:0px;height:550px")
						Col(span=22)
							Form(ref="form",:data="form",:rules="rules",:label-width="80")
								Form-item(label="群组名:" v-model="form.name")
									Input(:value="form.name")
								Form-item(label="负责人:" v-model="form.leader")
									Input(:value="form.leader" disabled)
								Form-item(label="所在区域",prop="location",data-toggle="distpicker")
									Cascader(:data="region" v-model="value2")
						Col(span=12)
							Form(ref="form",:data="form",:rules="rules",:label-width="80")
								Col(span=22)
									Form-item(label="背景1:")
										ColorPicker(v-model="color1")
									Form-item(label="背景2:")
										ColorPicker(v-model="color2")
									Form-item(label="背景3:")
										RadioGroup(v-model="color3")
											Radio(label="light")
											Radio(label="dark")
											Radio(label="primary")
						Col(span=12)
							upload(:before-upload='handleUpload' action='')
								img(:src="logo" onerror="src='../../static/logo-menu.png'" style="padding-left: 30%;cursor: pointer;width: 200px;height:150px")
						Col(span=24)
							Col.ta(span="8")
								Button(type="success" @click="upOrganize()" ,:loading="loading")|提交
							Col.ta(span="8")
								Button(type="primary" @click="getList2(),dislist=true")|人员列表
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
							div.minheight
								Table(border,:columns="columns1",:data="list",size="small" stripe)
						Row
							Col.ta(span="24")
								Page(show-elevator :total="list.length",:page-size="options.num",:current="options.page",@on-change="pageChange",show-total)
		el-dialog(:visible.sync="dislist")
			Row(:gutter=5)
				Col.list(span="24")|人员列表
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
				value2:['','',''],
				districtList: [],
				loading:false,
				IMEI:'',
				logo:'',
				file:'',
				color1:'#19be6b',
				color2:'#19be6b',
				color3:'#19be6b',
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
					title: '电梯组名',
					key: 'name',
				},
				{
					title: '安装地址',
					key: 'region',
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
											name: 'editElevator',
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
										this.bindGroup(params.row.id)
									}
								}
							}, '绑定')
						]);
					}
				}],
				columns2: [
				{
					title: '成员',
					key: 'username',
				},
				{
					title: '操作',
					key: 'IMEI',
					render: (h, params) => {
						return h('div', [
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
										this.rmGroup(params.row.id)
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
			this.getOrganize()
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
			async getOrganize(){
				const res = await this.$api.readOrganize({
					id:this.$route.params.id,
					nums:1,
					page:1,
				})
				this.form = res.data.data.list[0]
				this.form.value2 = this.form.region.split(',')
				this.logo='http://server.asynciot.com/getfile?filePath='+res.data.data.list[0].logo
				delete this.form.t_create
			},
			async getList() {
				let res = await this.$api.readGroup({
					page:1,
					nums:10,
				})
				this.list = res.data.data.list
				this.total = res.data.data.totalNumber
			},
			async getList2() {
				const res = await this.$api.getOrganization(this.query)
				
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
			handleUpload (file) {
				var type = file.name.split('.')
				if (file.size<2097152){
				if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')||(type[1] == 'bmp')||(type[1] == 'jpeg')){
				this.file = new File([file], new Date().getTime()+".jpg",{type:"image/jpeg"});
				// this.filename = this.file.name;
				// this.upsuccess = true;
				
				  let url = null ;
				  if (window.createObjectURL!=undefined) { // basic
					url = window.createObjectURL(this.file) ;
				  }else if (window.webkitURL!=undefined) { // webkit or chrome
					url = window.webkitURL.createObjectURL(this.file) ;
				  }else if (window.URL!=undefined) { // mozilla(firefox)
					url = window.URL.createObjectURL(this.file) ;
				  }
				this.logo=url;
				return false;
				}
				else{
					this.$Notice.warning({
						title: this.$t('warning'), 
						desc: this.$t('File type must be picture')
					})
				}
				}
				else{
					this.$Notice.warning({
						title: this.$t('warning'),
						desc: this.$t('File size must be less than 2M')
					})
				}
			},
			async upOrganize(){
				this.loading = true
				console.log('value2')
				console.log(this.form.region)
				this.form.region = this.value2[0]+','+this.value2[1]+','+this.value2[2]
				
				var formData = new FormData()
				var formData = new window.FormData()
				formData.append('logo',this.file)
				formData.append('bg1',this.color1)
				formData.append('bg2',this.color2)
				formData.append('bg3',this.color3)
				formData.append('id',this.form.id)
				formData.append('leader',this.form.leader)
				formData.append('name',this.form.name)
				formData.append('region',this.form.region)
				formData.append('organize_id',this.form.organize_id)
				formData.append('number',this.form.number)
				const res = await this.$api.updateOrganize(formData)
				if (res.data.code == 0) {
					this.loading = false
					this.$Notice.success({
						title: '成功',
						desc: '编辑成功！'
					});
					this.$router.back(-1)
				}else{
					this.loading = false
					this.$Notice.error({
					title: '失败',
					desc: '编辑失败'
					});
				}
			},
			async rmGroup(val){
				const res = await this.$api.rmGroup({
					id:val,
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
					desc: '删除失败！'
					});
				}
			},
			async bindGroup(val){
				const res = await this.$api.bindGroup({
					id:this.$route.params.id,
					group_id:val,
				})
				if (res.data.code == 0) {
					this.$Notice.success({
						title: '成功',
						desc: '绑定成功！'
					});
					this.getList2()
				}else{
					this.$Notice.error({
					title: '失败',
					desc: '绑定失败！'
					});
				}
			},
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
