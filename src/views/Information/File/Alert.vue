<template lang="jade">
	div
		div.form
			Row(:gutter=30)
				Col(span=7)| &nbsp;
				Col(span=10)
					Card(style="height:500px")
						Col(span=24)
							Form(ref="form",:model="form",:rules="rules",:label-width="120")
								Row(:gutter="5")
									Col(span="20",offset="2")
										Form-item(label="设备名称")|{{list.device_name}}
										Form-item(label="设备类型" v-if="list.device_type==240")|控制柜
										Form-item(label="设备类型" v-if="list.device_type==15")|控制器
										Form-item(label="IMEI号")|{{list.IMEI}}
										Form-item(label="工单类型")
											RadioGroup(v-model="form.type")
												Radio(key="1" label="故障" value='1')
												Radio(key="2" label="保养" value='2')
												Radio(key="3" label="校检" value='3')
										Form-item(label="故障代码" v-if="(form.type == '故障')&&(list.device_type==15)" prop="door")
											Select(v-model="doorCode" style="width:200px")
												Option(v-for="item in dcode" ,:value="item.value" ,:key="item.value")|{{item.label}}
										Form-item(label="故障代码" v-if="(form.type != '故障')&&(list.device_type==15)")
											Select(v-model="doorCode" style="width:200px" disabled)
												Option(v-for="item in dcode" ,:value="item.value" ,:key="item.value")|{{item.label}}
										Form-item(label="故障代码" v-if="(form.type == '故障')&&(list.device_type==240)" prop="ctrl")
											Input(style="width:50px;" maxlength="2" v-model='ctrlfault')
										Form-item(label="故障代码" v-if="(form.type != '故障')&&(list.device_type==240)")
											Input(style="width:50px" maxlength="2" readonly)
						Col(span=24)
							Col(span=12 align="center")
								Button(type="success",icon="plus",@click="sentalert()" v-if="up != true" disabled="false")|创建工单
								Button(type="success",icon="plus",@click="sentalert()" v-else)|创建工单
							Col(span=12 align='center')
								Button(icon="close",@click="$router.back(-1)")|取消
</template>

<script>
	export default{	
		data(){
			return{
				username:window.localStorage.getItem('username'),
				id:window.localStorage.getItem('id'),
				fault:[0,0,0,0,0,0,0,0],
				ctrlfault:'',
				form:{
					type:'故障',
				},
				code:'',
				doorCode:'',
				dcode:[
					{
						value:'1',
						label:'开关门受阻'
					},{
						value:'2',
						label:'飞车保护'
					},{
						value:'16',
						label:'电机过载'
					},{
						value:'32',
						label:'输出过流'
					},{
						value:'64',
						label:'输入电压过低'
					},{
						value:'128',
						label:'输入电压过高'
					},
				],
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
				up:this.global.functions.work_up,
				
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
			async getData(){
				let res =await this.$api.devices({IMEI: this.$route.params.IMEI})
				if (0 === res.data.code) {
					this.list = res.data.data.list[0]
				}
			},
			async sentalert(){
				var type=''
				var device_type=''
				var fault=parseInt('0x'+this.ctrlfault)
				if (this.list.device_type == '240') {
					device_type ='ctrl'
				}
				if (this.list.device_type == '15') {
					device_type ='door'
				}
				if (this.form.type=='故障') {
					type=1
					if(this.list.device_type == '15'){
						fault=this.doorCode
					}
				}else if (this.form.type=='保养') {
					type=2
					fault=''
				}else if (this.form.type=='校检') {
					type=3
					fault=''
				}
				let res = await this.$api.alert({code:fault,type:type,device_type:device_type,producer:this.username,device_id:this.list.device_id})
				let ret = await this.$api.fault({
					page: 1,
					num:10,
					search_info: '',
					isreg: "True",
					state: 'untreated',
					type: type,
					device_type: device_type,
					device_id: this.list.device_id,
					islast: 1,
				})
				this.id = ret.data.data.list[0].id
				let thr = await this.$api.orderExamine({id:this.id})
				if(res.data == 'ok'){
					this.$Notice.success({
						title: '成功',
						desc: '发送成功，等待处理'
					});
					this.$router.back(-1)
				}else{
					if (res.data == 'already in db') {
						this.$Notice.error({
							title: '失败',
							desc: '该设备已经告警'
						});
						this.$router.back(-1)
					}
					else{
						if (res.data.code != 605){
							this.$Notice.error({
								title: '失败',
								desc: '发送失败'
							});
							this.$router.back(-1)
						}
					}
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
	
</style>
