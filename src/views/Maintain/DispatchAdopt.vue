<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=30)
				Col(span=10)
					Card(style="height:500px")
						Col(span=24)
							Form(ref="form",:model="form",:rules="rules",:label-width="120")
								Row(:gutter="5")
									Col(span="20",offset="2")
										Form-item(label="设备名称:")|{{list.device_name}}
										Form-item(label="设备类型:" v-if="list.device_type==240")|控制柜
										Form-item(label="设备类型:" v-if="list.device_type==15")|控制器
										Form-item(label="IMEI号:")|{{list.IMEI}}
										Form-item(label="事件类型:")|{{list.type}}
										Form-item(label="故障原因:" v-if="list.type == '故障'")|{{list.code}}
										Form-item(label="基站定位:")|{{list.cell_address}}
										Form-item(label="安装地址:")|{{list.install_addr}}
										Form-item(label="提交时间:")|{{this.$format(parseInt(list.createTime), 'YYYY-MM-DD HH:mm:ss')}}
				Col(span=10)
					Card()
						Row
							Col(span=24)
								Form(ref="form",:model="form",:rules="rules",:label-width="120" style="height:200px")
									Row(:gutter="5")
										Col(span="20",offset="2")
											Form-item(label="详细说明:")|{{ps}}
							Col(span=24)
								Col(span=12 align="center")
									Button(type="success",icon="plus",@click="adopt",:disabled='upsuccess')|同意
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
			if(this.username=="demo"){
				this.upsuccess = true 
			}
		},
		methods:{
			code(){
				if (this.form.taype == '1'){
					this.faultcode=false;
				}
				else {
					this.faultcode=true;
				}
			},
			adopt(){
				this.$api.adopt({id:this.$route.params.id})
				this.$Notice.success({
					title: '成功',
					desc: '已通过审核！'
				})
				this.$router.back()
			},
			async getData(){
				let res = await this.$api.getRepair({num:1,page:1,id:this.$route.params.id})
				if (0 === res.data.code) {
					let ech = await this.$api.devices({device_id:res.data.data.list[0].device_id,num:10,page:1})
					res.data.data.list[0].device_name = ech.data.data.list[0].device_name
					res.data.data.list[0].device_type = ech.data.data.list[0].device_type
					res.data.data.list[0].IMEI = ech.data.data.list[0].IMEI
					if(res.data.data.list[0].type == 1){
						res.data.data.list[0].type = '故障'
					}
					if(res.data.data.list[0].type == 2){
						res.data.data.list[0].type = '保养'
					}
					if(res.data.data.list[0].type == 3){
						res.data.data.list[0].type = '校检'
					}
					res.data.data.list[0].cell_address = ech.data.data.list[0].cell_address
					res.data.data.list[0].ipaddr = ech.data.data.list[0].ip_country+ech.data.data.list[0].ip_region+ech.data.data.list[0].ip_city
					res.data.data.list[0].install_addr = ech.data.data.list[0].install_addr
					var type=''
					if((res.data.data.list[0].type == '故障')&&(res.data.data.list[0].code != null))
					for (var i=7;i>=0;i--){
						if(res.data.data.list[0].code>=Math.pow(2,i)){
							res.data.data.list[0].code=res.data.data.list[0].code-Math.pow(2,i)
							if(i==7){
								type="输出过流"
							}else if(i==6){
								type="电机过载"
							}else if(i==5){
								type="飞车保护"
							}else if(i==4){
								type="开关门受阻"
							}else if (i==1) {
								type="输入电压过高"
							}else if(i==0){
								type="输入电压过低"
							}
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
