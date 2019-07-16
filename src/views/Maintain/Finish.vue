<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=30)
				Col(span=5)| &nbsp;
				Col(span=14)
					Card(style="height:600px")
						Col(span=24)
							Form(ref="form",:model="form",:label-width="120")
								Row(:gutter="0")
									Col(span="24",offset="0")
										Col(span="8" style="margin-top:10px")|{{$t('order ID')}}:{{list.order_id}}
										Col(span="8" style="margin-top:10px")|{{$t('device name')}}:{{list.device_name}}
										Col(span="8" style="margin-top:10px")|IMEI:{{list.IMEI}}
										Col(span="8" style="margin-top:10px" v-if="list.state == 'treated'")|{{$t('state')}}:{{$t('treated')}}--{{list.result}}
										Col(span="8" style="margin-top:10px" v-if="list.state == 'untreated'")|{{$t('state')}}:{{$t('treating')}}
										Col(span="8" style="margin-top:10px")|{{$t('confirm time')}}:{{list.confirm_time}}
										Col(span='24' style="margin-top:10px")
											textarea(v-model='ps' style="width:100%;height:60px", :placeholder="$t('Description of maintenance')")
									Col(span=24 style="margin-top:10px")|{{$t('photo before treating')}}:
									Col(span='8' style='height: 160px')
										upload(:before-upload='before1')
											img(id="before1" src='../../assets/add.jpg' style="height:130px; width:80%; cursor: pointer;")
									Col(span='8' style='height: 160px')
										upload(:before-upload='before2')
											img(id="before2" src='../../assets/add.jpg' style="height:130px; width:80%; cursor: pointer;")
									Col(span='8' style='height: 160px')
										upload(:before-upload='before3')
											img(id="before3" src='../../assets/add.jpg' style="height:130px; width:80%; cursor: pointer;")
									Col(span=24 style="margin-top:0px")|{{$t('photo after treating')}}:
									Col(span='8' style='height: 160px')
										upload(:before-upload='after1')
											img(id="after1" src='../../assets/add.jpg' style="height:130px; width:80%; cursor: pointer;")
									Col(span='8' style='height: 160px')
										upload(:before-upload='after2')
											img(id="after2" src='../../assets/add.jpg' style="height:130px; width:80%; cursor: pointer;")
									Col(span='8' style='height: 160px')
										upload(:before-upload='after3')
											img(id="after3" src='../../assets/add.jpg' style="height:130px; width:80%; cursor: pointer;")
						Col(span=24 style="margin-top: 10px")
							Col(span=6 align="center")
								Button(type="success",@click="finish('finish')" disabled v-if="list.state == 'treated'")|已{{list.result}}
								Button(type="success",@click="finish('finish')" v-if="((list.state != 'treated')&&(!sent)&&(dispatch!= true))" disabled='false')|完成工单
								Button(type="success",@click="finish('finish')" v-else)|{{$t('complete')}}
							Col(span=6 align="center")
								Button(type="primary",@click="examine()",v-if="dispatch != true" disabled='false')|{{$t('reprieve')}}
								Button(type="primary",@click="examine()",v-else)|{{$t('reprieve')}}
							Col(span=6 align="center")
								Button(type="warning",@click="finish('transfer')" disabled v-if="list.state == 'treated'")|已{{list.result}}
								Button(type="warning",@click="finish('transfer')" v-if="((list.state != 'treated')&&(!sent)&&(dispatch != true))" disabled='false')|转办
								Button(type="warning",@click="finish('transfer')" v-else)|{{$t('transfer')}}
							Col(span=6 align='center')
								Button(@click="$router.back(-1)")|{{$t('cancel')}}
</template>

<script>
	export default{	
		data(){
			return{
				sent:false,
				username:window.localStorage.getItem('username'),
				id:window.localStorage.getItem('id'),
				fault:[0,0,0,0,0,0,0,0],
				form:{
					type:'1',
				},
				beforefile1:'',
				beforefile2:'',
				beforefile3:'',
				afterfile1:'',
				afterfile2:'',
				afterfile3:'',
				faultcode:false,
				list:[],
				query:{
					username:window.localStorage.getItem('username'),
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
				ps:'',
				dispatch:this.global.functions.work_dispatch,
			}
		},
		computed: {
			role() {
				return this.username === 'admin' ? '超级管理员' : '普通用户';
			},
		},
		created(){
			this.getData();
		},
		methods:{
			code(){
				if (this.form.type == '1'){
					this.faultcode=false;
				}
				else {
					this.faultcode=true;
				}
			},
			async getData(){
				let res =await this.$api.getRepair({id:this.$route.params.id,page:1,num:1})
				if (res.data.code === 0) {
					let ech = await this.$api.devices({device_id:res.data.data.list[0].device_id,num:10,page:1})
					res.data.data.list[0].device_name = ech.data.data.list[0].device_name
					res.data.data.list[0].IMEI = ech.data.data.list[0].IMEI
					res.data.data.list[0].install_addr = ech.data.data.list[0].install_addr
					res.data.data.list[0].cell_address = ech.data.data.list[0].cell_address
					if (res.data.data.list[0].result == 'transfer') {res.data.data.list[0].result='转办'}
					else {res.data.data.list[0].result='完成'}
					this.list = res.data.data.list[0]
					
					var before=this.list.before_pic.split(';')
					var after=this.list.after_pic.split(';')
					if (before.length > 1) {document.getElementById('before1').src='http://server.asynciot.com/getfile?filePath='+before[0];}
					if (before.length > 2) {document.getElementById('before2').src='http://server.asynciot.com/getfile?filePath='+before[1];}
					if (before.length > 3) {document.getElementById('before3').src='http://server.asynciot.com/getfile?filePath='+before[2];}
					if (after.length > 1) {document.getElementById('after1').src='http://server.asynciot.com/getfile?filePath='+after[0];}
					if (after.length > 2) {document.getElementById('after1').src='http://server.asynciot.com/getfile?filePath='+after[1];}
					if (after.length > 3) {document.getElementById('after1').src='http://server.asynciot.com/getfile?filePath='+after[2];}
				} else {
					this.$Notice.error({
						title: '错误',
						desc: '获取列表失败'
					});
				}
			},
			before1 (file) {
				if (this.list.state != "treated"){
					var type = file.name.split('.')
					if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')||(type[1] == 'bmp')||(type[1] == 'jpeg')){
					if (file.size>2097000) {
						this.$Notice.warning({
							title: '警告',
							desc: '不能上传2M以上的图片'
						})
					}
					else {
						this.$Notice.warning({
							title: '警告',
							desc: '1'
						})
					this.beforefile1 = new File([file], 'before'+file.name,{type:"image/jpeg"});
// 					this.$Notice.warning({
// 						title: '警告',
// 						desc: '2'
// 					})
					let url = null;
					if (window.createObjectURL!=undefined) { // basic
						url = window.createObjectURL(this.beforefile1) ;
					}else if (window.webkitURL!=undefined) { // webkit or chrome
						url = window.webkitURL.createObjectURL(this.beforefile1) ;
					}else if (window.URL!=undefined) { // mozilla(firefox)
						url = window.URL.createObjectURL(this.beforefile1) ;
					}
// 					this.$Notice.warning({
// 						title: '警告',
// 						desc: '3'
// 					})
					document.getElementById('before1').src=url;
					return false;
					}
					}
					else{
						this.$Notice.warning({
							title: '警告',
							desc: '只能上传图片类型的文件'
						})
					}
				}
				else{
					this.$Notice.warning({
						title: '抱歉',
						desc: '暂不支持补传图片'
					})
				}
			},
			before2 (file) {
				if (this.list.state != "treated"){
				var type = file.name.split('.')
				if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')||(type[1] == 'bmp')||(type[1] == 'jpeg')){
				this.beforefile2 = new File([file], 'before'+file.name,{type:"image/jpeg"});
				if (file.size>2097000) {
					this.$Notice.warning({
						title: '警告',
						desc: '不能上传2M以上的图片'
					})
				}
				else {
				let url = null;
				if (window.createObjectURL!=undefined) { // basic
					url = window.createObjectURL(this.beforefile2) ;
				}else if (window.webkitURL!=undefined) { // webkit or chrome
					url = window.webkitURL.createObjectURL(this.beforefile2) ;
				}else if (window.URL!=undefined) { // mozilla(firefox)
					url = window.URL.createObjectURL(this.beforefile2) ;
				}
				document.getElementById('before2').src=url;
				return false;
				}
				}
				else{
					this.$Notice.warning({
						title: '警告',
						desc: '只能上传图片类型的文件'
					})
				}
				}
				else{
					this.$Notice.warning({
						title: '抱歉',
						desc: '暂不支持补传图片'
					})
				}
			},
			before3 (file) {
				if (this.list.state != "treated"){
					var type = file.name.split('.')
					if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')||(type[1] == 'bmp')||(type[1] == 'jpeg')){
						if (file.size>2097000) {
							this.$Notice.warning({
								title: '警告',
								desc: '不能上传2M以上的图片'
							})
						}else {
							this.beforefile3 = new File([file], 'before'+file.name,{type:"image/jpeg"});
							let url = null;
							if (window.createObjectURL!=undefined) { // basic
								url = window.createObjectURL(this.beforefile3) ;
							}else if (window.webkitURL!=undefined) { // webkit or chrome
								url = window.webkitURL.createObjectURL(this.beforefile3) ;
							}else if (window.URL!=undefined) { // mozilla(firefox)
								url = window.URL.createObjectURL(this.beforefile3) ;
							}
							document.getElementById('before3').src=url;
							return false;
						}
					}else {
						this.$Notice.warning({
							title: '警告',
							desc: '只能上传图片类型的文件'
						})
					}
				}else {
					this.$Notice.warning({
						title: '抱歉',
						desc: '暂不支持补传图片'
					})
				}
			},
			after1 (file) {
				if (this.list.state != "treated"){
					var type = file.name.split('.')
					if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')||(type[1] == 'bmp')||(type[1] == 'jpeg')){
						if (file.size>2097000) {
							this.$Notice.warning({
								title: '警告',
								desc: '不能上传2M以上的图片'
							})
						}else {
							this.afterfile1 = new File([file], 'after'+file.name,{type:"image/jpeg"});
							let url = null;
							if (window.createObjectURL!=undefined) { // basic
								url = window.createObjectURL(this.afterfile1) ;
							}else if (window.webkitURL!=undefined) { // webkit or chrome
								url = window.webkitURL.createObjectURL(this.afterfile1) ;
							}else if (window.URL!=undefined) { // mozilla(firefox)
								url = window.URL.createObjectURL(this.afterfile1) ;
							}
							document.getElementById('after1').src=url;
							return false;
						}
					}else{
						this.$Notice.warning({
							title: '警告',
							desc: '只能上传图片类型的文件'
						})
					}
				}else{
					this.$Notice.warning({
						title: '抱歉',
						desc: '暂不支持补传图片'
					})
				}
			},
			after2 (file) {
				if (this.list.state != "treated"){
					var type = file.name.split('.')
					if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')||(type[1] == 'bmp')||(type[1] == 'jpeg')){
						if (file.size>2097000) {
							this.$Notice.warning({
								title: '警告',
								desc: '不能上传2M以上的图片'
							})
						}else {
							this.afterfile2 = new File([file], 'after'+file.name,{type:"image/jpeg"});
							let url = null;
							if (window.createObjectURL!=undefined) { // basic
								url = window.createObjectURL(this.afterfile2) ;
							}else if (window.webkitURL!=undefined) { // webkit or chrome
								url = window.webkitURL.createObjectURL(this.afterfile2) ;
							}else if (window.URL!=undefined) { // mozilla(firefox)
								url = window.URL.createObjectURL(this.afterfile2) ;
							}
							document.getElementById('after2').src=url;
							return false;
						}
					}else{
						this.$Notice.warning({
							title: '警告',
							desc: '只能上传图片类型的文件'
						})
					}
				}else{
					this.$Notice.warning({
						title: '抱歉',
						desc: '暂不支持补传图片'
					})
				}
			},
			after3 (file) {
				if (this.list.state != "treated"){
					var type = file.name.split('.')
					if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')||(type[1] == 'bmp')||(type[1] == 'jpeg')){
						if (file.size>2097000) {
							this.$Notice.warning({
								title: '警告',
								desc: '不能上传2M以上的图片'
							})
						}else {
							this.afterfile3 = new File([file], 'after'+file.name,{type:"image/jpeg"});
							let url = null;
							if (window.createObjectURL!=undefined) { // basic
								url = window.createObjectURL(this.afterfile3) ;
							}else if (window.webkitURL!=undefined) { // webkit or chrome
								url = window.webkitURL.createObjectURL(this.afterfile3) ;
							}else if (window.URL!=undefined) { // mozilla(firefox)
								url = window.URL.createObjectURL(this.afterfile3) ;
							}
							document.getElementById('after3').src=url;
							return false;
						}
					}else{
						this.$Notice.warning({
							title: '警告',
							desc: '只能上传图片类型的文件'
						})
					}
				}else{
					this.$Notice.warning({
						title: '抱歉',
						desc: '暂不支持补传图片'
					})
				}
			},
			async finish(val){
				this.sent=true
				var formData = new FormData()
				var formData = new window.FormData()
				formData.append('file1',this.beforefile1)
				formData.append('file2',this.beforefile2)
				formData.append('file3',this.beforefile3)
				formData.append('file4',this.afterfile1)
				formData.append('file5',this.afterfile2)
				formData.append('file6',this.afterfile3)
				formData.append('id',this.$route.params.id)
				formData.append('result',val)
				let res = await this.$api.finish(formData)
				this.sent=false
				if (res.data.code == 0){
					this.$Notice.success({
						title: '成功',
						desc: '完成工单'
					});
					this.$router.back(-1)
				}
				else{
					this.$Notice.error({
						title: '错误',
						desc: '发生错误'
					});
					this.getList()
				}
			},
			async examine(){
				let res = await this.$api.dispatchExamine({
					id:this.$route.params.id,
					remarks:this.ps,
				})
				this.$Notice.success({
					title: '成功',
					desc: '已提交，正在审核请等待！'
				});
				this.$router.back(-1)
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
	
</style>
