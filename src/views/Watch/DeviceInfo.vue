<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=5)
				Col(span=12)
					card(style="height: 280px")
						Col(span="24" style="height: 35px;font-size:20px")|{{$t('Basic Information')}}
							i(class="fa fa-bookmark" ,:style="{color:cardcolor}" v-for="cardcolor in getlist(data.tagcolor)" style="margin-left: 10px")
						Form.status(label-position="left",:label-width="110")
							Row
								Col(span="12")
									Form-item.fontsize(:label="$t('device name')+':'")
										p()|{{data.device_name}}
								Col(span="12")
									Form-item(:label="$t('RSSI')+':'")
										div()
											icon(name="sign0",width="24",height="24",slot="prepend" v-if="sign[0]")
											icon(name="sign1",width="24",height="24",slot="prepend" v-if="sign[1]")
											icon(name="sign2",width="24",height="24",slot="prepend" v-if="sign[2]")
											icon(name="sign3",width="24",height="24",slot="prepend" v-if="sign[3]")
											icon(name="sign4",width="24",height="24",slot="prepend" v-if="sign[4]")
											icon(name="sign5",width="24",height="24",slot="prepend" v-if="sign[5]")
								Col(span="12")
									Form-item(label="ID:")
										p()|{{data.id}}
								Col(span="12")
									Form-item(label="IMEI:")
										p()|{{data.IMEI}}
								Col(span="12")
									Form-item(:label="$t('device type')+':'")
										p(v-if="data.device_type=='15'")|{{$t('door')}}
										p(v-if="data.device_type=='240'")|{{$t('ctrl')}}
								Col(span="12")
									Form-item(:label="$t('state')+':'")
										p()|{{data.state}}
								Col(span="12")
									Form-item(:label="$t('IP location')+':'")
										p()|{{data.ipaddr}}
								Col(span="12" v-if="data.device_type=='15'")
									Form-item(:label="$t('model')+':'" v-if="data.device_model == '1' ")
										p()|NSFC01-01B
									Form-item(:label="$t('model')+':'" v-if="data.device_model == '2' ")
										p()|NSFC01-02T
								Col(span="24")
									Form-item(:label="$t('base station')+':'")
										p()|{{data.cell_address}}
								Col(span="20")
									Form-item(:label="$t('install address')+':'")
										p()|{{data.install_addr}}
								Col(span="4")
									Button(type="primary" @click="parameter()")|{{$t('Menu')}}
					Row(:gutter=5 style="padding-top:5px;")
						Col(span=12)
							card.card(style='height: 220px')
								img(src='../../assets/wave.gif', width='100%', height='200')
						Col(span=12)
							card.card(style='height: 220px')
								p.clearfix(slot='title' style="height: 20px", align='center')|{{$t('Status Monitoring')}}
								Form.status(label-position="left",:label-width="140")
									Col(span="23")
										Form-item(:label="$t('Monitoring Duration')+'(s):'")
											input.iv(v-model='realtime.duration' ,:maxlength=4)
									Col(span="23" style="")
										Form-item(:label="$t('Sampling Period')+'(ms):'")
											Select(v-model='realtime.interval')
												Option(key="1" label="100" value='100')
												Option(key="2" label="200" value='200')
												Option(key="3" label="500" value='500')
												Option(key="4" label="1000" value='1000')
												Option(key="5" label="2000" value='2000')
									Col(span="23" align='center' style="margin-top: 10px;margin-left: 10px")
										Button(type="success" @click="monitor('1')" v-if="monitors != true" disabled="false" style="width:100%")|{{$t('Status Monitoring')}}
										Button(type="success" @click="monitor('1')" v-else style="width:100%")|{{$t('Status Monitoring')}}
				Col(span=12)
					card.card(align='left' style='height: 505px',v-if='data.device_type == 240')
						Col(span="24" style="height: 35px;font-size:20px")|{{$t('Memory Debugging')}}
						Row(style="margin-top:20px")|{{this.loading}}
						Row(style="margin-top:20px")
							Col(span=5 style="height: 30px;font-size:16px")|{{$t('Segment Address')}}:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='segment[0]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='segment[1]' id="fir" onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='segment[2]' id="sec" onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=3)
								input.iv(style="width:44%" ,:maxlength=4 v-model='segment[3]' id="thr" onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
						Row(style="margin-top:20px")
							Col(span=5 style="height: 30px;font-size:16px")|{{$t('Offset Address')}}:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[0]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[1]' id="fou" onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=2 v-model='res[0]' readonly)
							Col(span=5)
								|&nbsp;
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[8]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[9]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=2 v-model='res[4]' readonly)
							Col(span=5)
								|&nbsp;
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[2]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[3]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=2 v-model='res[1]' readonly)
							Col(span=5)
								|&nbsp;
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[10]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[11]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=2 v-model='res[5]' readonly)
							Col(span=5)
								|&nbsp;
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[4]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[5]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=2 v-model='res[2]' readonly)
							Col(span=5)
								|&nbsp;
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[12]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[13]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=2 v-model='res[6]' readonly)
							Col(span=5 style="height: 30px;font-size:16px")
								checkbox(v-model="ctn" @on-change="contn()")|连续
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[6]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[7]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=2 v-model='res[3]' readonly)
							Col(span=5)
								|&nbsp;
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[14]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
								|&nbsp;:
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=4 v-model='address[15]' onkeyup="value=value.replace(/([^0-9a-fA-F])+/g, '')")
							Col(span=2)
								input.iv(style="width:66%" ,:maxlength=2 v-model='res[7]' readonly)
						Row(style="margin-top:35px")
							Col(span="20" align='right' style="margin-top: 10px;margin-left: 10px")
								Button(type="success" @click="monitor('2')" v-if="memory != true" disabled="false" style="width:25%")|{{$t('Memory Debugging')}}
								Button(type="success" @click="monitor('2')" v-else style="width:25%")|{{$t('Memory Debugging')}}
					card.card(align='center',v-if='data.device_type == 15' style="height: 505px")
						Row
							Col(span=24 style="font-size:20px;text-align:left;")|{{$t('Event Record')}}
							div( style="height: 35px;")
								Col(span=4)
									Select(v-model="keyword" , :placeholder="$t('type')" style="width:75%")
										Option(key="1" label="ID" value='id')
										Option(key="2", :label="$t('length')" value="length")
										Option(key="3", :label="$t('interval')" value="interval")
								Col(span=7)
									AutoComplete.mg(name="inpSer" v-model="search_info" ,:data="menu" , :placeholder="$t('keyword')" max=15 style="width: 80%" class="handle-input mr10" id="serch1" @on-change="search()")
								Col(span=6)
									DatePicker(type="date" , :placeholder="$t('from date')" format="yyyy-MM-dd" v-model="starttime" style='width: 100%;' @on-change="search()")
								Col(span=1)|→
								Col(span=6)
									DatePicker(type="date" , :placeholder="$t('closing date')" format="yyyy-MM-dd" v-model="endtime" style='width: 100%;' @on-change="search()")
							div(style='font-size: large;margin-top:40px;', v-if='total==0')| {{$t('This device has no event record')}}
							Scroll(:on-reach-bottom='handleReachBottom', :distance-to-edge="0" , style="margin-top: 30px" , :height="380")
								card(v-bind:padding='4',v-for='item in list', :key='item.id', align='left', style='font-size: 12px; cursor: pointer;margin-top:3px;', @click.native='history(item.id)')
									Row
										Col(span=22)|  {{$t('event id')}} ： {{item.id}}
													Col(span=12)|  {{$t('start time')}} ： {{formatDate(item.time,'yyyy-MM-dd HH:mm:ss')}}
													Col(span=12)|  {{$t('end time')}} ： {{formatDate(item.time+item.interval*item["length"],'yyyy-MM-dd HH:mm:ss')}}
							div(style='font-size: large;') {{$t('total')}} {{total}} {{$t('events')}}
</template>

<script>
	import {
		formatDate
	} from '../../utils.js'
	export default {
		data() {
			return {
				sign:[false,false,false,false,false,false],
				ctn: false,
				a:'',
				loading:'',
				websock:'',
				test:'',
				address:['','','','','','','','','','','','','','','',''],
				res:['00','00','00','00','00','00','00','00'],
				segment:['','','',''],
				duration:120,
				keyword:'time',
				search_info: '',
				door:true,
				now:[],
				time:'',
				data:[],
				menu:[],
				list:[],
				list2:[],
				total:'',
				fcous:{
					fir:true,
					sec:false,
					thr:false,
				},
				realtime: {
					threshold:'1',
					duration:120,
					interval:'1000',
				},
				options: {
					id:'',
					IMEI:'',
					name:'',
					page: 1,
					num: 9,
					total: 0,
					isreg: "True",
					duration:'',
					interval:'',
					length:'',
					starttime:'',
					endtime:'',
				},
				starttime:'',
				endtime:'',
				columns: [{
					title: ' ',
					key: 'device_name'
				},{
					title: ' ',
					key: 'IMEI',
				}],
				monitors:'',
				memory:'',
			}
		},
		created() {
			console.log(1)
			this.getData()
			console.log(1)
		},
		watch:{
			'segment': function(val){
				if(val[0].length==2&&val[1].length==0){
					document.getElementById("fir").focus()
				}
				if(val[1].length==2&&val[2].length==0){
					document.getElementById("sec").focus()
				}
				if(val[2].length==2&&val[3].length==0){
					document.getElementById("thr").focus()
				}
			},
			'address': function(val){
				if(val[0].length==2&&val[1].length==0){
					document.getElementById("fou").focus()
				}
			},
		},
		methods: {
			contn(){
				if (this.ctn){
					if (this.address[0] == '') this.address[0]='00'
					if (this.address[1] == '') this.address[1]='00'
					for (var i=1;i<8;i++){
						if (this.address[i*2-1] == 'ff') {
							this.address[i*2] =(parseInt('0x'+this.address[(i-1)*2])+1).toString(16)
							this.address[i*2+1] ='00'
						}else{
							this.address[i*2] =this.address[(i-1)*2]
							this.address[i*2+1] = (parseInt('0x'+this.address[(i-1)*2+1])+1).toString(16)
						}
					}
					for (var i=1;i<10;i++){
						if (this.address[i*2+1].length == 1){
							this.address[i*2+1]='0'+this.address[i*2+1]
						}
					}
				}
			},
			handleSearch1 (selectword) {
				this.menu=[];
				var str;
				for (var i=0;i<this.list.length;i++){
					str=this.list[i].IMEI;
					if (str != null){
						if (str.indexOf(selectword)>=0)
						this.menu.push(str)
					}
					str=this.list[i].device_name;		  	    	
					if (str != null){
						if (str.indexOf(selectword)>=0){
						this.menu.push(str)
						}
					} 
				}
			},
			async getData() {
				this.options.page=1
				this.options.IMEI=this.$route.params.IMEI
				let res = await this.$api.devices({num:1,page:1,IMEI:this.$route.params.IMEI})
				if(!res.data.code){
					this.data = res.data.data.list[0]
					this.data.ipaddr = res.data.data.list[0].ip_country+res.data.data.list[0].ip_region+res.data.data.list[0].ip_city
					this.options.device_id=this.data.id
					if(this.data.state == "online"){
						this.data.state = "在线"
					}else if(this.data.state == "offline"){
						this.data.state = "离线"
					}else if(this.data.state == "longoffline"){
						this.data.state = "长期离线"
					}
					if (this.data.rssi != ''){
						if (this.data.rssi==0) {
							this.sign[0]=true
						}else if(this.data.rssi<=2){
							this.sign[1]=true
						}else if (this.data.rssi<=4) {
							this.sign[2]=true
						}else if (this.data.rssi<=8) {
							this.sign[3]=true
						}else if (this.data.rssi<=16) {
							this.sign[4]=true
						}else {
							this.sign[5]=true
						}
					}
					let eve = await this.$api.event(this.options)
					if(!eve.data.code){
						this.list = eve.data.data.list
						this.list2 = this.list
						this.total = eve.data.data.totalNumber
					}else{
						this.$Notice.error({
							title: '错误',
							desc: '获取事件信息错误！'
						})
					}									
				}else(
					this.$Notice.error({
						title: '错误',
						desc: '获取电梯数据错误！'
					})
				)
				this.now=Date.parse(new Date())
			},
			async search() {
				this.options.page=1
				this.time=new Date(this.options.time)
				if (this.keyword=="id") {this.options.id=this.search_info}
				if (this.keyword=="length") {this.options["length"]=this.search_info}
				if (this.keyword=="interval") {this.options.interval=this.search_info}			
				if (this.options.search_info == "") {this.list=this.list2}
				else {
					this.starttime=formatDate(this.starttime,'yyyy-MM-dd')
					this.endtime=formatDate(this.endtime,'yyyy-MM-dd')
					if ((this.starttime>this.endtime)&&(this.endtime !="")) {
						this.endtime=this.starttime
						this.$Notice.warning({
							title: '提示',
							desc: '截至日期必须大于开始日期',
							})
						}	
					this.options.starttime=this.starttime
					this.options.endtime=formatDate(Date.parse(this.endtime)+86400000,'yyyy-MM-dd')
					let res = await this.$api.event(this.options)
					this.total = res.data.data.totalNumber
					this.list = res.data.data.list
				}
			},
			parameter(){
				if (this.data.device_type == '15') {
					this.$router.push({
						name: 'doorparameter',
						params: {
							IMEI: this.data.IMEI,
							id: this.data.device_id,
							device_name:this.data.device_name,
							device_model:this.data.device_model,
						}
				})}
				
				if (this.data.device_type == '240') {
					this.$router.push({
						name: 'ctrlparameter',
						params: {
							IMEI: this.data.IMEI,
							id: this.data.device_id,
							device_name:this.data.device_name,
						}
				})}
			},
			getlist(val){
				if (val==null) {return null}
				else {return val.split(';')}
			},
			async handleReachBottom () {
				if ( this.list.length<this.total ) {
					this.options.page++
					var options2=this.options
					// options2.page=Math.ceil(this.list.length/9)+1
					options2.num=9
					let eve= await this.$api.event(options2)
					for (var i=0;i<9;i++){
						this.list.push(eve.data.data.list[i])
					}
					this.list2=this.list
				}
				else {
					let eve= await this.$api.event(options2)
					this.$Notice.warning({
						title: '提示',
						desc: '已经到底了！',
					})
				}
				this.total = eve.data.data.totalNumber
					return new Promise(resolve => {			
						resolve();
					});
				},
			monitor(val) {
				if (this.data.device_type=='15'){
					if (!(/^\d+$/.test(this.realtime.duration)&&/^\d+$/.test(this.realtime.interval)&&/^\d+$/.test(this.realtime.threshold))){
						this.$Notice.error({
							title: '错误',
							desc: '所有参数都必须是数字！'
						})
					}else{
						if ((this.realtime.interval*this.realtime.threshold>this.realtime.duration*1000)){
							this.$Notice.error({
								title: '错误',
								desc: '监控时长必须大于采样周期'
							})
						}else{
							this.$router.push({
								name: 'doormonitor',
								params: {
									duration: this.realtime.duration,
									interval: this.realtime.interval,
									threshold: this.realtime.threshold,
									IMEI: this.data.IMEI,
									id: this.data.device_id,
									device_model: this.data.device_model,
								}
							})
						}
					}
				}
				if ((this.data.device_type=='240')&&(val=='1')){
					if (!(/^\d+$/.test(this.realtime.duration)&&/^\d+$/.test(this.realtime.interval)&&/^\d+$/.test(this.realtime.threshold))){
						this.$Notice.error({
							title: '错误',
							desc: '所有参数都必须是数字！'
						})
					}else{
						if ((this.realtime.interval*this.realtime.threshold>this.realtime.duration*1000)){
							this.$Notice.error({
								title: '错误',
								desc: '监控时长必须大于采样周期'
							})
						}else{
							this.$router.push({
								name: 'ctrlmonitor',
								params: {
									duration: this.realtime.duration,
									interval: this.realtime.interval,
									threshold: this.realtime.threshold,
									IMEI: this.data.IMEI,
									id: this.data.device_id,
								}
							})
						}
					}
				}
				if ((this.data.device_type=='240')&&(val=='2')){
					var f=true;
					for (var i=0;i<16;i++){
						if(/^\d+$/.test(this.address[i])) f=false
					}
					this.initWebsocket()
				}
			},
			history(val) {
				if (this.data.device_type=='15'){
					this.$router.push({
						name: 'doorhistory',
						params: {							
							id: val,
						}
					})
				}
				if (this.data.device_type=='240'){
					this.$router.push({
						name: 'ctrlhistory',
						params: {
							id: val
						}
					})
				}
			},
			formatDate(val, format) {
				return formatDate(val, format)
			},
			async initWebsocket(){ //初始化weosocket
				let res = await this.$api.monitor({
					device_type: 240,
					type: 1,
					address: (this.address[0]+','+this.address[1]+','+this.address[2]+','+
						this.address[3]+','+this.address[4]+','+this.address[5]+','+
						this.address[6]+','+this.address[7]+','+this.address[8]+','+this.address[9]+','+this.address[10]+','+
						this.address[11]+','+this.address[12]+','+this.address[13]+','+
						this.address[14]+','+this.address[15]),
					segment: (this.segment[0]+','+this.segment[1]+','+this.segment[2]+','+this.segment[3]),
					IMEI: this.data.IMEI,
					duration: this.duration,
					threshold: 1,
					interval: 1000,
					op:'open',
				});
				if(res.data.code != 0){
					alert("该电梯已被其他人启动实时监控")
				}else{
					this.$Notice.success({
						title: '成功',
						desc: '监控已开启，两分钟后自动关闭！'
					})
				}
				let wsurl ='ws://47.96.162.192:9006/device/Monitor/socket?deviceId='+this.data.id+'&userId='+window.localStorage.getItem('id')
				this.websock = new WebSocket(wsurl);
				this.websock.onopen = this.websocketonopen;
				this.websock.onerror = this.websocketonerror;
				this.websock.onmessage = this.websocketonmessage;
			}, 
			websocketonopen() {
				console.log("WebSocket连接成功");
				this.loading='WebSocket连接成功'
			},
			websocketonerror(e) {//错误
				console.log("WebSocket连接发生错误");
				this.loading='WebSocket连接失败'
			},
			websocketonmessage(e){//数据接收
			this.loading='正在获取数据'
				if(e.data=="closed"){
					this.loading="此次实时数据已结束"
				}else{
					var redata = JSON.parse(e.data)
					var buffer = base64url.toBuffer(redata.data);
					for (var i=0;i<8;i++) {
						// this.res[i]=buffer[i].toString(16)
						this.$set(this.res, i, buffer[i].toString(16))
					}
				}
			},
			async closed(){//数据发送
				let res = await this.$api.monitor({
					IMEI:this.query.IMEI,
					op:'close',
				});
			},
	 	}
	}
</script>

<style lang="scss">
	.mg{
		margin-left: 20px;
	}
	.status {
		p {
			color: #289efc;
		}
	}
	.asd{
		font-size: 20px;
	}
	.card {
		.fr {
			font-style: normal;
			color: #289efc;
		}
	}
	.detail {
		width: 50%;
	}
	.addr {
		padding: 0;
		margin-bottom: 0;
	}
	.center {
		display: flex;
		flex-flow: row;
		justify-content: center;
		align-items: center;
	}
	.iv{
		display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
	}
</style>