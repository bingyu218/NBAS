<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=30)
				Col(span=7)| &nbsp;
				Col(span=10)
					Card(style="height:540px")
						Col(span=24)
							Form(ref="form",:model="form",:rules="rules",:label-width="120")
								Row(:gutter="5")
									Col(span="20",offset="2")
										Form-item(label="设备名称")|{{list.device_name}}
										Form-item(label="设备类型" v-if="list.device_type==240")|控制柜
										Form-item(label="设备类型" v-if="list.device_type==15")|控制器
										Form-item(label="IMEI号")|{{list.IMEI}}
										Form-item(label="事件类型")|{{list.type}}
										Form-item(label="故障原因" v-if="list.type == '故障'")|{{list.code}}
										Form-item(label="基站定位")|{{list.cell_address}}
										Form-item(label="安装地址")|{{list.install_addr}}
										Form-item(label="预计完成时间")
											DatePicker(type="date" placeholder="截止日期" format="yyyy-MM-dd" v-model="expect" style='' @on-change="check()")
						Col(span=24)
							Col(span=12 align="center")
								Button(type="success",icon="plus",@click="order()")|确认接单
							Col(span=12 align='center')
								Button(icon="close",@click="$router.back(-1)")|取消
</template>

<script>
	export default{	
		data(){
			return{
				username:window.localStorage.getItem('username'),
				id:window.localStorage.getItem('id'),
				mobile:window.localStorage.getItem('mobile'),
				fault:[0,0,0,0,0,0,0,0],
				form:{
					type:'1',
				},
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
				expect:'',
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
			check(){
				if (Date.parse(this.expect)+86400000<Date.parse(new Date())){
					this.$Notice.warning({
						title: '最快也只能今天完成',
						desc: '如果不确定就空着吧',
						})
					this.expect=this.$format(Date.parse(new Date()),'YYYY-MM-DD')
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
			async order(){
				var time = ''
				if (this.expect != '') {time =Date.parse(this.expect).toString()}
				let res = await this.$api.order({order_id:this.list.id,mobile:this.mobile,expect_time:time})
				if (res.data.code == 0) {
					this.$Notice.success({
					title: '成功',
					desc: '已接单，可在工单界面查看'
					});
					this.$router.back(-1)
				}
				else {
					this.$Notice.error({
					title: '失败',
					desc: '接单失败'
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
	
</style>
