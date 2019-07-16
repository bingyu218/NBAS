<template lang="jade">
div
	div.form
		Row(:gutter="30")
			Col(span="16")
				Card()
					p(slot="title")|{{$t('Basic Information')}}
					Row(:gutter="30")
						Col(span="12")|{{$t('device name')}}:
							input(v-model="list.device_name" style="border: 0" @input="" maxlength='10')
							span.pd(style="color:gray;margin-left:5px" class="fa fa-pencil fa-1x")
						Col(span="12")|{{$t('device ID')}}:
							input(v-model="list.device_id" style="border: 0" readonly)
					Row(:gutter="30" style="padding-top:10px")
						Col(span="12")|IMEI:
							input(v-model="list.IMEI" style="border: 0" maxlength='15' readonly)
						Col(span="12")|IMSI:
							input(v-model="list.device_IMSI" style="border: 0" maxlength='15' readonly)
					Row(:gutter="30" style="padding-top:10px" )
						Col(span="12" v-if="list.device_type==15")|{{$t('device type')}}:{{$t('door')}}
						Col(span="12" v-if="list.device_type==240")|{{$t('device type')}}:{{$t('ctrl')}}
						Col(span="12" v-if="list.device_model==1")|{{$t('model')}}:NSFC01-01B
						Col(span="12" v-if="list.device_model==2")|{{$t('model')}}:NSFC01-02T
				Card(v-if="list.device_type == 15" style="margin-top:5px")
					p(slot="title")|{{$t('Parameter')}}
					Row(:gutter="30")
						Col(span="12")|{{$t('report time')}}:
							input(v-model="parameter.reporttime" style="border: 0" readonly)
						Col(span="12")
							div()|{{$t('RSSI')}}:&nbsp;&nbsp;
								icon(name="sign0",width="24",height="24",slot="prepend" v-if="sign==0")
								icon(name="sign1",width="24",height="24",slot="prepend" v-if="sign==1")
								icon(name="sign2",width="24",height="24",slot="prepend" v-if="sign==2")
								icon(name="sign3",width="24",height="24",slot="prepend" v-if="sign==3")
								icon(name="sign4",width="24",height="24",slot="prepend" v-if="sign==4")
								icon(name="sign5",width="24",height="24",slot="prepend" v-if="sign==5")
					Row(:gutter="30" style="padding-top:10px")
						Col(span="12")|{{$t('last event')}}ID:
							input(v-model="parameter.waveid" style="border: 0" readonly)
						Col(span="8")|{{$t('event number in cache')}}:
							input(v-model="parameter.wavenumber" style="border: 0;;width:50%" readonly)
						Col(span="4")
							Button(@click="getList();history=true")|{{$t('history fault')}}
				Card(v-if="list.device_type == 240" style="margin-top:5px")
					p(slot="title")|{{$t('Parameter')}}
					Row(:gutter="30" style="padding-top:10px")
						Col(span="12")|{{$t('usage count')}}:
							input(v-model="parameter.runcount" style="border: 0" readonly)
						Col(span="12")|{{$t('operating time')}}(s):
							input(v-model="parameter.uptime" style="border: 0" readonly)
					Row(:gutter="30" style="padding-top:10px")
						Col(span="12")
							div()|{{$t('RSSI')}}:&nbsp;&nbsp;
								icon(name="sign0",width="24",height="24",slot="prepend" v-if="sign==0")
								icon(name="sign1",width="24",height="24",slot="prepend" v-if="sign==1")
								icon(name="sign2",width="24",height="24",slot="prepend" v-if="sign==2")
								icon(name="sign3",width="24",height="24",slot="prepend" v-if="sign==3")
								icon(name="sign4",width="24",height="24",slot="prepend" v-if="sign==4")
								icon(name="sign5",width="24",height="24",slot="prepend" v-if="sign==5")
						Col(span="8")|{{$t('recent fault floor')}}:
							input(v-model="parameter.faultfloor" style="border: 0;width:50%" readonly)
						Col(span="4")
							Button(@click="getList();history=true")|{{$t('history fault')}}
				Card(style="margin-top:5px")
					p(slot="title")|{{$t('Maintenance Remind')}}
					Row(:gutter="30")
						Col(span="12")|{{$t('next maintenance')}}:
							DatePicker(type="date", :placeholder="$t('next maintenance')" format="yyyy-MM-dd" v-model="options.maintenance_nexttime" style='width: 50%; margin-left:20px')
							span.pd(style="color:gray;margin-left:5px" class="fa fa-pencil fa-1x")
						Col(span="12")|{{$t('remind in advance(Days)')}}:
							input( style="border: 0" v-model="options.maintenance_remind")
							span.pd(style="color:gray;margin-left:5px" class="fa fa-pencil fa-1x")
					Row(:gutter="30")
						Col(span="12")|{{$t('maintenance type')}}:
							Select(v-model="list.maintenance_type" style="width:50%; margin-left:20px" placeholder="类型" @on-change="search()")
								Option(key="1", :label="$t('fault')" value='1')
								Option(key="2", :label="$t('maintain')" value="2")
								Option(key="3", :label="$t('check')" value="3")
							span.pd(style="color:gray;margin-left:5px" class="fa fa-pencil fa-1x")
						Col(span="12")|{{$t('last maintenance')}}:{{options.maintenance_lasttime}}
				Card(style="margin-top:5px")
					p(slot="title")|{{$t('System')}}

					Row(:gutter="30" style="padding-top:10px")
						Col(span="12")|{{$t('install address')}}:
							input(v-model="list.install_addr" style="border: 0" @input="" maxlength='18')
							span.pd(style="color:gray;margin-left:5px" class="fa fa-pencil fa-1x")
						Col(span="12")|{{$t('install date')}}:
							input(v-model="options.install_date" style="border: 0" readonly)
			Col(span="7" )
				Card()
					img(src="../../../assets/ladder.jpg" width="100%")
				Col(span = 12 style="margin-top:5px")
					Col(span=4)
						span.pd(id="green" style="color:green;cursor: pointer;" class="fa fa-tag fa-2x",@click="checkcolor(0)")
					Col(span=4)
						span.pd(id="red" style="color:red;cursor: pointer;" class="fa fa-tag fa-2x",@click="checkcolor(1)")
					Col(span=4)
						span.pd(id="yellow" style="color:yellow;cursor: pointer;" class="fa fa-tag fa-2x",@click="checkcolor(2)")
					Col(span=4)
						span.pd(id="blue" style="color:blue;cursor: pointer;" class="fa fa-tag fa-2x",@click="checkcolor(3)")
					Col(span=4)
						span.pd(id="gray" style="color:gray;cursor: pointer;" class="fa fa-tag fa-2x",@click="checkcolor(4)")
					Col(span=4)
						span.pd(id="black" style="color:black;cursor: pointer;" class="fa fa-tag fa-2x",@click="checkcolor(5)")
				Col(span=24)
					Col(span=12)
						Button(@click="burnn()" type="primary" v-if="(list.register != 'registered')&&(list.commond !='contract')" style="margin-top: 20px; width: 92%" ,:disabled='upsuccess')|{{$t('register device')}}
						Button(@click="clearr()" type="primary" v-if="(list.register == 'registered')&&(list.commond !='contract')" style="margin-top: 20px; width: 92%" ,:disabled='upsuccess')|{{$t('deregister')}}
						Button(disabled= true type="primary" v-if="list.commond =='contract'" style="margin-top: 20px; width: 92%")|{{$t('registering')}}
					Col(span=11)
						Button(@click="burn()" type="warning" v-if="(list.register != 'registered')&&(list.commond !='contract')" style="margin-top: 20px; width: 100%" ,:disabled='upsuccess')|{{$t('marked as registered')}}
						Button(@click="clear()" type="warning" v-if="(list.register == 'registered')&&(list.commond !='contract')" style="margin-top: 20px;width: 100%" ,:disabled='upsuccess')|{{$t('marked as unregistered')}}
						Button(disabled= true type="primary" v-if="list.commond =='contract'" style="margin-top: 20px; width: 100%")|{{$t('registering')}}
				Col(span=24)
					Col(span=12)
						Button(@click="update()" type="success" style="margin-top: 20px; width: 92%" v-if='(!sent)&&(updevices!=true)' disabled='false')|{{$t('submit information')}}
						Button(@click="update()" type="success" style="margin-top: 20px; width: 92%" v-else)|{{$t('submit information')}}
					Col(span=11)
						Button(@click="del()" type="error" style="margin-top: 20px;width: 100%" v-if='(!sent)&&(rmdevices!=true)' disabled='false')|{{$t('reset information')}}
						Button(@click="del()" type="error" style="margin-top: 20px;width: 100%" v-else)|{{$t('reset information')}}
				Col(span=24)
					Col(span=12)
						Button(@click="newladder()" type="info" style="margin-top: 20px; width: 92%" v-if='(addladder!=true)' disabled='false')|{{$t('new elevator')}}
						Button(@click="newladder()" type="info" style="margin-top: 20px; width: 92%" v-else)|{{$t('new elevator')}}
					Col(span=12)
						Button(@click="adladder()"  style="margin-top: 20px; width: 92%")|{{$t('bind to an elevator')}}
	el-dialog(:title="$t('history fault')", :visible.sync="history" width="50%")
		Table(:columns="column",:data="data",:stripe="true")
		span(slot="footer" class="dialog-footer")
			div(style="height:40px")
				Col(span='6')
					Page(show-elevator :total="total", :page-size="fault.num",:current="fault.page" @on-change="pageChange" show-total style="margin-left:60px;margin-top:10px" simple)
				Col(span='18')
					el-button(type="primary" @click="history = false")|{{$t('OK')}}
</template>

<script>
	import {
		api,
		ladderApi,
		formatDate,
		array2obj,
		buffer2hex,
		parseBuffer,
		parseEvent,
		parseInfo,
		parseMsg
	} from '@/utils'
export default {
	data() {
		const type= {
		15: '控制器',
		240: '控制柜',
		};
		return {
			column: [
				{
					title: this.$t('order ID'),
					key: 'order_id',
					width:90,
					render: (h, params) => {
						h('div',[
							h('Button', {
								props: {
									type: 'text',
									size: "small",
								},
								style: {
									paddingRight: '4px',
									paddingLeft: '4px',
								},
								on: {
									click: () => {
										this.$router.push({
											name: 'finish',
											params: {
												id: params.row.id
											}
										})
									}
								}
							}, params.row.order_id)],
						)
					}
				},{
					title: this.$t('phone'),
					key: 'phone',
					width: 140,
				},{
					title: this.$t('accept time'),
					key: 'create_time',
					// width:150,
					render: (h, params) => {
						return h('p',this.$format(parseInt(params.row.create_time), 'YYYY-MM-DD HH:mm:ss'))
					}
				},{
					title: this.$t('finish time'),
					key: 'finish_time',
					// width:150,
					render: (h, params) => {
						return h('p',this.$format(parseInt(params.row.finish_time), 'YYYY-MM-DD HH:mm:ss'))
					}
				},
				],
				
			history:false,
			sent:false,
			color:[false,false,false,false,false,false],
			col:['green','red','yellow','blue','gray','black'],
			options: {
				page: 1,
				num: 10,
				total: 0,
				id:'',
				deviceName:'',
				typeId:'',
				maintenance_lasttime:'',
				maintenance_nexttime:'',
				maintenance_remind:'',
				install_date:'',
			},
			total:'',
			fault:{
				page: 1,
				num: 1,
				state:'',
				device_id:'',
			},
			parameter:{
				reporttime: '',
				rssi: '',
				moment: '',
				wavenumber: '',
				waveid: '',	
				runcount: '',
				uptime: '',
				faultcode: '',
				faultfloor: '',
				faulttime: '',
			},
			refreshNum: 0,
			list: '',
			data: '',
			sign:'',
			maintain:[],
			loading: false,
			updevices:this.global.functions.update_devices,
			rmdevices:this.global.functions.rem_devices,
			addladder:this.global.functions.new_ladder,
			columns: [
			{
				title: '设备类型',
				key: 'typeId',
				render: (h, params) => {
					return h('p',type[params.row.typeId]||'')
				}
			}]	
		}
	},
	created(){
		this.getData()
		this.getList()
		if(this.username=="demo"){
			this.upsuccess = true 
		}
	},
	methods: {
		pageChange(val) {
			this.fault.page = val
			this.getList()
		},
		async getList() {
			this.fault.device_id=this.list.device_id
			let res = await this.$api.getRepair(this.fault)
			var length=res.data.data.list.length
			if (res.data.code === 0) {
				for (var i=0;i<length;i++) {
					const ech = await this.$api.devices({device_id:res.data.data.list[i].device_id,num:10,page:1})
					res.data.data.list[i].device_name = ech.data.data.list[0].device_name
					res.data.data.list[i].IMEI = ech.data.data.list[0].IMEI
					res.data.data.list[i].install_addr = ech.data.data.list[0].install_addr
					res.data.data.list[i].cell_address = ech.data.data.list[0].cell_address
					res.data.data.list[i].ipaddr = ech.data.data.list[0].ip_country+ech.data.data.list[0].ip_region+ech.data.data.list[0].ip_city
				}
				this.data = res.data.data.list
				this.total = res.data.data.totalNumber
			} else {
				this.$Notice.error({
					title: '错误',
					desc: '获取列表失败'
				});
			}
		},
		async update(){
			this.sent=true
			if(this.options.maintenance_nexttime!=null){
				this.list.maintenance_nexttime=Date.parse(this.options.maintenance_nexttime)
			}else{
				this.list.maintenance_nexttime=null
			}
			this.list.maintenance_remind=this.options.maintenance_remind*86400000
			
			let res =await this.$api.setdevices(this.list)
			this.sent=false
			if (res.data.code == 0){
				this.$Notice.success({
					title: '成功',
					desc: '已提交信息'
				});
			}else {
				this.$Notice.error({
					title: '失败',
					desc: '更新信息失败'
				});
			}
		},
		async getData() {
			var buffer;
			var time;
			let res =await this.$api.devices({IMEI: this.$route.params.IMEI})
			this.list = res.data.data.list[0]
			setTimeout(()=>{
				this.showcolor()
			}, 300)
			if (this.list.rssi != ''){
				if (this.list.rssi==0) {
					this.sign=0
				}else if(this.list.rssi<=2){
					this.sign=1
				}else if (this.list.rssi<=4) {
					this.sign=2
				}else if (this.list.rssi<=8) {
					this.sign=3
				}else if (this.list.rssi<=16) {
					this.sign=4
				}else if (this.list.rssi<=32) {
					this.sign=5
				}
			}
			let run =await this.$api.runtime({page:1,num:20,device_id:this.list.id})
			if (this.list.device_type == 15) {
				run.data.data.list.forEach(item=>{
					if (item.type == 4096) {
						buffer = base64url.toBuffer(item.data)
						time=buffer[0]*16777216+buffer[1]*65536+buffer[2]*256+buffer[3]
						if(time == 0){
							this.parameter.reporttime=''
						}else {
							this.parameter.reporttime=new Date(time*1000+1262275200000)
						}
						this.parameter.rssi=buffer[4]
						this.parameter.wavenumber=buffer[14]*256+buffer[15]
						this.parameter.waveid=buffer[16]*256+buffer[17]
					}
				})
			}
			if (this.list.device_type == 240) {
				run.data.data.list.forEach(item=>{
					if(item.type == 8192) {
						buffer = base64url.toBuffer(item.data)
						time=buffer[0]*16777216+buffer[1]*65536+buffer[2]*256+buffer[3]
						if(time == 0){
							this.parameter.reporttime=''
						}else {
							this.parameter.reporttime=new Date(time*1000+1262275200000)
						}
						time=buffer[20]*16777216+buffer[21]*65536+buffer[22]*256+buffer[23]
						if(time == 0) {
							this.parameter.faulttime=''
						}else {
							this.parameter.faulttime=new Date(time*1000+1262275200000)
						}
						this.parameter.rssi=buffer[4]
						this.parameter.runcount=buffer[10]*16777216+buffer[11]*65536+buffer[12]*256+buffer[13]
						this.parameter.uptime=buffer[14]*16777216+buffer[15]*65536+buffer[16]*256+buffer[17]
						this.parameter.faultfloor=buffer[19]
					}
				})
			}
			this.options.install_date=this.$format(this.list.install_date, 'YYYY-MM-DD')
			this.list.maintenance_nexttime=parseInt(this.list.maintenance_nexttime)
			this.list.maintenance_lasttime=parseInt(this.list.maintenance_lasttime)
			this.options.maintenance_nexttime=this.$format(this.list.maintenance_nexttime, 'YYYY-MM-DD')
			this.options.maintenance_lasttime=this.$format(this.list.maintenance_lasttime, 'YYYY-MM-DD')
			this.options.maintenance_remind=this.list.maintenance_remind/86400000
		},
		showcolor(){
			var getcolor=this.list.tagcolor.split(';')
			for (var i=0;i<getcolor.length;i++){
				for (var j=0;j<6;j++){
					if (getcolor[i]==this.col[j]) {
						this.color[j]=true
						document.getElementById(this.col[j]).className="fa fa-bookmark fa-2x"
					}
				}
			}
		},
		async checkcolor(c) {
			this.color[c]=!this.color[c]
			if (this.color[c]) {
				document.getElementById(this.col[c]).className="fa fa-bookmark fa-2x"
			}else {
				document.getElementById(this.col[c]).className="fa fa-tag fa-2x"
			}
			this.list.tagcolor=''
			for (var i=0;i<6;i++) {
				if (this.color[i]) {
					if (this.list.tagcolor!='') {
						this.list.tagcolor=this.list.tagcolor+';'
					}
					this.list.tagcolor=this.list.tagcolor+this.col[i]
				}
			}
		},
		newladder(){
			this.$Modal.confirm({
				title: this.$t('new elevator'),
				content:this.$t('Do you want to create a new elevator?'),
				onOk: () => {
					this.$router.push({
						name: 'addladder',
						params: {
							IMEI: this.list.IMEI,
							type: this.list.device_type,
						}
					})
				},
				onCancel: () => {}
			})
		},
		adladder(){
			this.$Modal.confirm({
				title: this.$t('bind to an elevator'),
				content:this.$t('Bind this device to an existing elevator?'),
				onOk: () => {
					this.$router.push({
						name: 'coverladder',
						params: {
							IMEI: this.list.IMEI,
							type: this.list.device_type,
						}
					})
				},
				onCancel: () => {
				}
			})
		},
		burnn() {
			this.$Modal.confirm({
				title: this.$t('register device'),
				content:'',
				onOk: () => {
					this.toburnn()
				},
				onCancel: () => {
				}
			})
		},
		burn() {
			this.$Modal.confirm({
				title: this.$t('Are you sure to marked as registered?'),
				content:this.$t('Error messages may be generated!'),
				onOk: () => {
					this.toburn()
				},
				onCancel: () => {
				}
			})
		},
		clearr() {
			this.$Modal.confirm({
				title: this.$t('deregister device'),
				content:'',
				onOk: () => {
					this.toclearr()
				},
				onCancel: () => {
				}
			})	
		},
		clear() {
			this.$Modal.confirm({
				title: this.$t('Are you sure to marked as unregistered?'),
				content:this.$t('Error messages may be generated!'),
				onOk: () => {
					this.toclear()
				},
				onCancel: () => {
				}
			})	
		},
		async toburnn() {
			this.list.commond = "contract"
			let res = await this.$api.regdevices({id: this.list.id,IMSI: this.list.device_IMSI, IMEI: this.list.IMEI,op:"register"})
			if (res.data.code === 0) {
				this.refreshNum = 2
				this.refresh()
				this.$Notice.success({
					title: this.$t('success'),
					desc: this.$t('Start to register!Show the device later in the Operations Interface')
				});
			} else {
				this.list.commond = "ok"
				this.$Notice.error({
					title: this.$t('error'),
					desc: this.$t('Fail to register')
				});
			}
		},
		async toburn() {
			this.list.commond = "contract"
			let res = await this.$api.regdevices({id: this.list.id,IMSI: this.list.device_IMSI, IMEI: this.list.IMEI,op:"register"})
			if (res.data.code === 0) {
				this.refreshNum = 2
				this.refresh()
				this.$Notice.success({
					title: this.$t('success'),
					desc: this.$t('Start to register!Show the device later in the Operations Interface')
				});
			}else {
				let ress=await this.$api.setdevices
				({id: this.list.id,IMEI: this.list.IMEI,isreg: True})
				if (ress.data.code === 0){
					this.$Notice.success({
						title: this.$t('success'),
						desc: this.$t('Fail to register,but it marked as registered')
					});
				}else {
					this.list.commond = "ok"
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('Fail to register')
					});
				}
			}
		},
		async toclearr() {
			let res = await this.$api.regdevices({id: this.list.id,IMSI: this.list.device_IMSI, IMEI: this.list.IMEI,op:"unregister"})
			if (res.data.code === 0) {
				this.$Notice.success({
					title: this.$t('success'),
					desc: this.$t('Start to deregister!')
				});
				this.list.commond = "contract"
			}else {
				this.list.commond = "ok"
				this.$Notice.error({
					title: this.$t('error'),
					desc: this.$t('Fail to register!')
				});
			}
		},
		async toclear() {
			let res = await this.$api.regdevices({id: this.list.id,IMSI: this.list.device_IMSI, IMEI: this.list.IMEI,op:"unregister"})
			if (res.data.code === 0) {
				this.$Notice.success({
					title: this.$t('success'),
					desc: this.$t('Start to deregister!')
				});
				this.list.commond = "contract"
			}else {
				let ress=await this.$api.setdevices({id: this.list.id,IMEI: this.list.IMEI,IMSI: this.list.IMSI,isreg: False})
				if (ress.data.code === 0){
					this.list.commond = "contract"
					this.$Notice.success({
						title: this.$t('success'),
						desc: this.$t('Fail to register,but it marked as unregistered')
					});
				}else {
						this.list.commond = "ok"
						this.$Notice.error({
							title: this.$t('error'),
							desc: this.$t('Fail to register!')
					});
				}
			}
		},
		async del() {
			this.$Modal.confirm({
				title: this.$t('reset information'),
				content:'',
				onOk: () => {
					this.todel()
				},
				onCancel: () => {
				}
			})	
		},
		async todel(){
			let res =await this.$api.deldevices({id: this.list.id,IMEI: this.list.IMEI})
			if (res.data.code === 0){
				this.$Notice.success({
					title: this.$t('success'),
					desc: this.$t('Information on this device has been reset')
				});
				this.$router.back(-1)
			}else {
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('Faul to reset')
					});
			}
		},
		formatDate(val, format) {
			return formatDate(val, format)
		},
		refresh() {
			setTimeout(()=>{
				this.getList()
				if (this.refreshNum > 0) {
					this.refresh()
					this.refreshNum--
				}
			}, 5000)
		},
	}
}
</script>

<style lang="css">
	.h1{
		position: absolute;
		padding-top: 13%;
	}
	.h2{
		position: absolute;
		padding-top: 27%;
	}
	.layout-content-main{
		overflow-y: scroll !important;
	}
</style>
