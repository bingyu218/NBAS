<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=30)
				Col(span=6 align="center")|&nbsp;
				Col(span=12 align="center")
					Card()
						p(slot="title")|订阅内容
						Row
							CheckboxGroup(v-model="social")
								Col(span=8)
									Checkbox(label="故障推送")
								Col(span=8)
									Checkbox(label="报表订阅")
						Row(style="padding-top:30px;")
							Col(span=24)
								Col(span=12 align="center")
									Button(type="success",icon="plus",@click="test")|同意
								Col(span=12 align='center')
									Button(icon="close",@click="$router.back(-1)")|取消
</template>

<script>
	export default{	
		data(){
			return{
				username:window.localStorage.getItem('username'),
				id:window.localStorage.getItem('id'),
				form:{
					type:'1',
				},
				faultcode:false,
				ps:'因零件未到位，请求搁置3日后维修。',
				list:[],
				query:{
					username:window.localStorage.getItem('username'),
					name:'',
				},
				social:[],
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
			},
		},
		created(){
			this.getData();
		},
		mounted(){
			//document.getElementById('image').src=this.file
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
			test(){
				if(this.social.length==0){
					this.$Notice.info({
						title: '提示',
						desc: '请选择订阅内容！'
					})
				}else{
					this.$Notice.success({
						title: '成功',
						desc: '订阅成功！'
					})
					this.$router.back()
				}
			},
			async getData(){
				let res = await this.$api.fault({num:1,page:1,id:this.$route.params.id})
				if (0 === res.data.code) {
					let ech = await this.$api.devices({device_id:res.data.data.list[0].device_id,num:10,page:1})
					res.data.data.list[0].device_name = ech.data.data.list[0].device_name
					res.data.data.list[0].device_type = ech.data.data.list[0].device_type
					res.data.data.list[0].IMEI = ech.data.data.list[0].IMEI
					if (res.data.data.list[0].type == 1) {res.data.data.list[0].type = '故障'}
					if (res.data.data.list[0].type == 2) {res.data.data.list[0].type = '保养'}
					if (res.data.data.list[0].type == 3) {res.data.data.list[0].type = '校检'}
					res.data.data.list[0].cell_address = ech.data.data.list[0].cell_address
					res.data.data.list[0].ipaddr = ech.data.data.list[0].ip_country+ech.data.data.list[0].ip_region+ech.data.data.list[0].ip_city
					res.data.data.list[0].install_addr = ech.data.data.list[0].install_addr
					var type=''
					if ((res.data.data.list[0].type == '故障')&&(res.data.data.list[0].code != null))
					for (var i=7;i>=0;i--){
						if (res.data.data.list[0].code>=Math.pow(2,i)) {
							res.data.data.list[0].code=res.data.data.list[0].code-Math.pow(2,i)
							if (i==7) {type=type+"输出过流;"}
							if (i==6) {type=type+"电机过载;"}
							if (i==5) {type=type+"飞车保护;"}
							if (i==4) {type=type+"开关门受阻;"}
							if (i==1) {type=type+"输入电压过高;"}
							if (i==0) {type=type+"输入电压过低;"}
						}
					}
					res.data.data.list[0].code=type
					this.list = res.data.data.list[0]
				}
				else{}
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
