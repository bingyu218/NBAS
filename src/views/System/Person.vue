<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=30)
				Col(span=4)| &nbsp;
				Col(span=16)
					Card(style="height:500px")
						Col(span=15)
							Form(ref="form",:model="form",:rules="rules",:label-width="120")
								Row(:gutter="5")
									Col(span="20",offset="2")
										Form-item(:label="$t('nickname')",prop="name")
											Input(v-model="form.nickname")
										Form-item(:label="$t('role')")|{{role}}						
										//Form-item(label="所属单位",prop="unit") 
										//	Input(v-model="form.unit",placeholder="所属单位")
										Form-item(:label="$t('phone number')",prop="mobile") 
											Input(v-model="form.mobile")
										Form-item(:label="$t('email')",prop="email") 
											Input(v-model="form.email")
										Form-item(:label="$t('introduction')",prop="remark")
											textarea(v-model="form.introduction" style=" width:100%;height:70px")
						Col(span=9)
							div(style="height:300px; width:250px")
								upload(:before-upload='handleUpload')
									img(id="image" src="../../assets/admin.jpg" style="height:250px; width:250px; cursor: pointer;")
								Button(style="margin-left:0px" icon="ios-cloud-upload-outline",@click="confirm" v-if="upsuccess")|{{$t('upload portrait')}}
								Button(style="margin-left:0px" icon="ios-cloud-upload-outline",@click="confirm" v-if="!upsuccess" disabled)|{{$t('upload portrait')}}
								Col(span=24 style="margin-left:10px;color:#f11")
						Col(span=24)
							Col(span=8 align="center")
								Button(type="primary" ,@click="getData()")|{{$t('reset')}}
							Col(span=8 align="center")
								Button(type="success" ,@click="create('form'),$router.back(-1)",)|{{$t('submit')}}
							Col(span=8 align="center")
								Button(@click="$router.back(-1)")|{{$t('cancel')}} 
</template>

<script>
	export default{	
		data(){
			return{
				username:window.localStorage.getItem('username'),
				id:window.localStorage.getItem('id'),
				form:{
					id:'',
					nickname:'',
					sex:'保密',
					profession:'',
					authority:'',
					unit:'',
					email:'',
					mobile:'',
					introduction:'',
				},
				rules: {
					nickname: [{
						required: true,
						type: 'string',
						message: this.$t('Please fill the name'),
						trigger: 'blur'
					}],
					unit: [{
						required: false,
						type: 'string',
						message: '请填写所属单位',
						trigger: 'blur'
					}],
					mobile: [{
						required: false,
						type: 'string',
						message: this.$t('Please fill the correct phone number'),
						pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
						trigger: 'blur'
					}],
					email: [{
						required: false,
						type: 'string',
						message: this.$t('Please fill the correct email address'),
						pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
						trigger: 'blur'
					}],
				},
				list:[],
				query:{
					id:window.localStorage.getItem('id'),
					name:'',
				},
				ladList:[],
				ladder:{
					name:'',
					page: 1,
					num: 300,
					total: 0,
				},
				file:'',
				filename:'',
				upsuccess:false,
			}
		},
		computed: {
			role() {
				return this.username === 'admin' ? '超级管理员' : '普通用户';
			}
		},
		created(){
			this.getData();
		},
		mounted(){
			//document.getElementById('image').src=this.file
		},
		methods:{
			async getData(){
				let res = await this.$api.people({id:this.id,num:1,page:1})
				if (0 === res.data.code) {
					this.form = res.data.data.list[0]
					if (this.form.portrait != null) {document.getElementById('image').src='http://server.asynciot.com/getfile?filePath='+this.form.portrait}
					if (this.form.sex == 'male') {this.form.sex = '男'}
					if (this.form.sex == 'female') {this.form.sex = '女'}
					if (this.form.sex == 'secret') {this.form.sex = '保密'}
				}
			},
			async create(){
				// this.loading = true
// 				if (this.form.sex == '男') {sex = 'male'}
// 				if (this.form.sex == '女') {sex = 'female'}
// 				if (this.form.sex == '保密') {sex = 'secret'}
				let res = await this.$api.updatepeople({
					id:this.form.id,username:this.form.username,
					profession:this.form.profession,
					nickname:this.form.nickname,
					email:this.form.email,
					mobile:this.form.mobile,
					introduction:this.form.introduction,
				})
				if (res.data.code ==0) {
					this.$Notice.success({
					title: this.$t('success'),
					desc: this.$t('Personal information is updated')
					});
				}
				else {
					this.$Notice.error({
					title: this.$t('error'),
					desc: this.$t('Fail to submit information')
					});
				}
			},
			handleUpload (file) {
				var type = file.name.split('.')
				if (file.size<2097152){
				if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')||(type[1] == 'bmp')||(type[1] == 'jpeg')){
				this.file = new File([file], new Date().getTime()+".jpg",{type:"image/jpeg"});
				this.filename = this.file.name;
				this.upsuccess = true;
				
				  let url = null ;
				  if (window.createObjectURL!=undefined) { // basic
					url = window.createObjectURL(this.file) ;
				  }else if (window.webkitURL!=undefined) { // webkit or chrome
					url = window.webkitURL.createObjectURL(this.file) ;
				  }else if (window.URL!=undefined) { // mozilla(firefox)
					url = window.URL.createObjectURL(this.file) ;
				  }
				document.getElementById('image').src=url;
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
			async confirm(){
				var formData = new FormData()
				var formData = new window.FormData()
				formData.append('file',this.file)
				console.log(formData)
				let res = await this.$api.portrait(formData)
				if (res.data.code == 0){
				this.upsuccess=false
				this.$Notice.success({
					title: this.$t('success'),
					desc: (this.$t('successfully upload')+this.filename)
				})
				this.getData()
				this.filename='已上传'+this.filename
				}
				else{
					this.$Notice.error({
						title: this.$t('error'),
						desc: '上传失败'
					})
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
	
</style>
