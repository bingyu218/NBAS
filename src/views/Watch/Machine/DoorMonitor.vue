<template lang="jade">
	div.layout-content-main
		div.form.mb-10.form-detail
			Card
				Form.status(:model="show",label-position="left",:label-width="80")
					Row(:gutter="16")
						Col(span="4")
							Form-item(label="创建人：")
								p()
						Col(span="5")
							Form-item(label="创建时间：")
								p()
						Col(span="5")
							Form-item(label="在线人数：")|{{pernum}}
						Col(span="5")
							div()|{{loading}}
						Col(span="4")
							Button.mr-10(type="default" @click="modal1 = true")|终止当前数据
							Modal(v-model="modal1" title="警告"  @on-ok="closed")
								p()|你确定要终止此次实时数据么？
			Row.mb-10(:gutter="8")
				Col.padding(span="8")
					Card.card
						p.clearfix(slot="title")|基础信息
						Form.status(:model="show",label-position="left",:label-width="80")
							Row(:gutter="16")
								Col(span="10")
									Form-item(label="门坐标：")
										p(v-text="show.position ? show.position : '无'")
								Col(span="12")
									Form-item(label="门电流：")
										p(v-text="isNaN(show.current) ? '无' : `${show.current} A`")
							Row(:gutter="16")
								Col(span="10")
									Form-item(label="开门信号：")
										p(v-text="show.openIn ? '开' : '关'")
								Col(span="10")
									Form-item(label="关门信号：")
										p(v-text="show.closeIn ? '开' : '关'")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="门状态：")
										p(v-text="parseStatus(show)")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="开到位输出信号：",:label-width="120")
										p(v-text="show.openToOut ? '开' : '关'")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="关到位输出信号：",:label-width="120")
										p(v-text="show.closeToOut ? '开' : '关'")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="开始时间：",:label-width="75")
										p(v-text="formatDate(this.t_start, 'yyyy-MM-dd HH:mm:ss')")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="结束时间：",:label-width="75")
										p(v-text="formatDate(this.t_end, 'yyyy-MM-dd HH:mm:ss')")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="报警：",:label-width="75")
										p(v-text="alertName(show)")
					Card.card.animate
						p(slot="title")
							div.shaft()
								section
									div
								section.noborder
									div
								p
								div.shaftinfo
									p|关到位输入
										i.signal(:class="show.closeTo?'ready':''")
									p|开到位输入
										i.signal(:class="show.openTo?'ready':''")
							div.realdoors()
								div.doorbox(:style="{ left: `-${(show.position / doorWidth) * 50}%` }")
								section.doorstitle
									div(:class="show.door?'screen':''")
									p|光幕信号
								div.doorbox(:style="{ right: `-${(show.position / doorWidth) * 50}%` }")
				Col(span=16)
					draggable(:options="{animation: 60,handle:'.drag'}")
						Card(style="margin-top:5px")
							p.drag(slot="title")|开关门信号 {{this.interval}} ms
							div.ss(id="openIn" draggable=false)
						Card(style="margin-top:5px")
							p.drag(slot="title")|开关门到位信号
							div.ss(id="closeIn" draggable=false)
						Card(style="margin-top:5px")
							p.drag(slot="title" )|门电流
							div.ss1(id="current" draggable=false)
						Card(style="margin-top:5px")
							p.drag(slot="title")|门速度 m/s
							div.ss1(id="speed" draggable=false)
						div(style="color:#f00")|注:为了保证信息的可靠性,监控结束后保留1分钟缓冲时间,期间不发送信息,避免出现上次监控残余信息.
</template>
<script>
	import echarts from 'echarts'
	import draggable from 'vuedraggable'
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
		data () {
			return {
				loading:"连接设备中,请耐心等待",
				count: 0,
				pernum: 0,
				doorWidth:4096,
				query:{
					device_type: 15,
					type: 0,
					IMEI: this.$route.params.IMEI,
					duration: this.$route.params.duration,
					threshold: this.$route.params.threshold,
					interval: this.$route.params.interval,
					op:'open',
				},
				id:this.$route.params.id,
				t_start:'',
				t_end:'',
				options:[],
				nums:'',
				modal1:false,
				websock:null,
				buffer:[],
				interval:'',
				point:'',
				show:{
					closeIn:'',
					current:'',
					openToOut:'',
					openTo:'',
					closeToOut:'',
					closeTo:'',
					door:'',
					open:'',
					close:'',
					openKeep:'',
					closeKeep:'',
					stop:'',
					inHigh:'',
					inLow:'',
					outHigh:'',
					motorHigh:'',
					flySafe:'',
					closeStop:'',
					position:'',
					speed:'',
				},
				openIn:[],
				closeIn:[],
				current:[],
				openTo:[],
				closeTo:[],
				speed:[],
				end: 50,
			}
		},
		created(){
			this.initWebsocket();
		},
		components: {
			draggable,
		},
		methods: {
			async initWebsocket(){ //初始化weosocket
				var buffer
				if (this.$route.params.device_model == '1') {
					let dor = await this.$api.runtime({page:1,num:20,type: 4101,device_id:this.id})
					if (dor.data.code == 0) {
						buffer = base64url.toBuffer(dor.data.data.list[0].data)
						this.doorWidth=buffer[14]*256+buffer[15]
					}
				}
				if (this.$route.params.device_model == '2') {
					let dor = await this.$api.runtime({page:1,num:20,type: 4100,device_id:this.id})
					if (dor.data.code == 0) {
						buffer = base64url.toBuffer(dor.data.data.list[0].data)
						this.doorWidth=buffer[26]*256+buffer[27]
					}
				}
				let res = await this.$api.monitor(this.query);
				if (res.data.code == 670) {alert("该电梯已被其他人启动实时监控")}
				this.person();
				if((res.data.code == 0)||(res.data.code == 670)){
					let wsurl ='ws://47.96.162.192:9006/device/Monitor/socket?deviceId='+this.id+'&userId='+window.localStorage.getItem('id')
					// let wsurl ='ws://lengxia.natapp1.cc/device/Monitor/socket?deviceId='+this.id+'&userId='+window.localStorage.getItem('id')
					this.websock = new WebSocket(wsurl);
					this.websock.onopen = this.websocketonopen;
					this.websock.onerror = this.websocketonerror;
					this.websock.onmessage = this.websocketonmessage;
				}
				else {
					this.loading="连接失败"
				}
			}, 
			websocketonopen() {
				this.loading='WebSocket连接成功，请等待数据'
			},
			websocketonerror(e) { //错误
				console.log("WebSocket连接发生错误");
				this.loading='WebSocket连接发生错误'
			},
			websocketonmessage(e){ //数据接收
			this.loading='获取数据中'
				if(e.data=="closed"){
					if(this.openIn<=15)
						this.loading="此次实时数据已结束"
				}else{
					var redata = JSON.parse(e.data)	
					this.getData(redata)
					this.drawLine();
				}
			},
			async closed(){//数据发送
				var duration=this.$route.params.duration
				var threshold=this.$route.params.threshold
				var	interval=this.$route.params.interval
				if (duration == null) duration=20
				if (threshold == null) threshold=1
				if (interval == null) interval=1000
				let res = await this.$api.monitor({
					IMEI:this.query.IMEI,
					op:'close',
					device_type: 15,
					type: 0,
					duration: duration,
					threshold: threshold,
					interval: interval,
				});
				this.loading="此次实时数据已结束"
			},
			websocketclosed(){
			},
			//电梯数据展示
			async person(){
				let per = await this.$api.pernum({deviceId:this.id})
				if (per.data.code == 0) {this.pernum=per.data.nums}
				setTimeout(()=>{
					if (this.$route.meta.name == '控制器监控'){this.person()}
					else {this.closed()}
				}, 4000)
			},
			getData(val) {
				let buffer = []
				buffer = base64url.toBuffer(val.data);	//8位转流
				console.log(buffer)
				// var _this = this
				this.count= 0
				if (this.t_start == '') this.t_start = val.time
				this.t_end = this.t_start+this.$route.params.duration*1000
// 				var inte = setInterval(function () {
// 					if((_this.count+8) <= buffer.length){
				this.show.openIn = (buffer[this.count+0]&0x80)>>7
				this.show.closeIn = (buffer[this.count+0]&0x40)>>6						//获取关门信号
				this.show.openTo =	(buffer[this.count+0]&0x20)>>5								//获取开到位输入信号
				this.show.closeTo = (buffer[this.count+0]&0x10)>>4								//获取关到位输入信号
				this.show.openToOut = (buffer[this.count+0]&0x02)>>1					//获取开到位输出信号
				this.show.closeToOut = buffer[this.count+0]&0x01					//获取关到位输出信号				
				this.show.door	= (buffer[this.count+1]&0x80)>>7									//正在开门信号
				this.show.open	= (buffer[this.count+1]&0x40)>>6									//正在开门信号
				this.show.close =	(buffer[this.count+1]&0x20)>>5						//正在关门信号
				this.show.openKeep	= (buffer[this.count+1]&0x10)>>4						//开门到位维持信号
				this.show.closeKeep	= (buffer[this.count+1]&0x08)>>3						//关门到位维持信号
				this.show.stop	= (buffer[this.count+1]&0x04)>>2								//停止输出信号
				this.show.inHigh = (buffer[this.count+1]&0x02)>>1						//输入电压过高
				this.show.inLow = 	buffer[this.count+1]&0x01							//输入电压过低
				this.show.outHigh = (buffer[this.count+2]&0x80)>>7						//输出过流
				this.show.motorHigh = (buffer[this.count+2]&0x40)>>6				//电机过载
				this.show.flySafe = (buffer[this.count+2]&0x20)>>5						//飞车保护
				this.show.closeStop = (buffer[this.count+2]&0x10)>>4					//开关门受阻
				this.show.position	= ((buffer[this.count+2]&0x0f)<<8)+(buffer[this.count+3]&0xff)		//获取位置信号
				this.show.current = (((buffer[this.count+4]&0xff)<<8)+(buffer[this.count+5]&0xff))/1000		//获取电流信号
				this.show.speed = (((buffer[this.count+6]&0xff)<<8)+(buffer[this.count+7]&0xff))/1000
				if(this.show.speed>32.767){
					this.show.speed = this.show.speed-65.535
				}
				console.log(this.show)
				this.getX()
// 						_this.count+=8
// 					}
// 				}, _this.query.interval);
// 				if((_this.count+8) > buffer.length){
// 					clearInterval(inte)
// 				}
			},
			drawLine(){
				let openIn = this.$echarts.init(document.getElementById('openIn'))
				let daowei = this.$echarts.init(document.getElementById('closeIn'))
				let current = this.$echarts.init(document.getElementById('current'))
				let speed = this.$echarts.init(document.getElementById('speed'))					
				
				var _this = this								
				var inte = setInterval(function () {
					_this.openIn.push(_this.show.openIn)
					_this.closeIn.push(_this.show.closeIn)
					_this.openTo.push(_this.show.openTo)
					_this.closeTo.push(_this.show.closeTo)
					_this.current.push(_this.show.current)
					_this.speed.push(_this.show.speed)
					_this.end-= 1
					if(_this.openIn.length > 10){
						_this.openIn.shift()
						_this.closeIn.shift()
						_this.closeTo.shift()
						_this.openTo.shift()
						_this.current.shift()
						_this.speed.shift()
					}
					openIn.setOption({
						tooltip: {
							trigger: 'axis'
						},
						legend: {
							data:['开门信号', '关门信号']
						},
						grid: {
							left: '3%',
							right: '4%',
							containLabel: true
						},
						xAxis: {
							type: 'category',
							data: _this.options,	
						},
						yAxis: {
							data:[0,1]
						},
						series: [{
							name:'开门信号',
							type:'line',
							step: 'start',
							data:_this.openIn
						},{
							name:'关门信号',
							type:'line',
							step: 'start',
							data:_this.closeIn
						},]
					});
					daowei.setOption({
						tooltip: {
							trigger: 'axis'
						},
						legend: {
							data:['开门到位信号', '关门到位信号']
						},
						grid: {					
							left: '3%',
							right: '4%',
							containLabel: true
						},
						xAxis: {
							type: 'category',
							data: _this.options,
						},
						yAxis: {
							data:[0,1]
						},
						series: [{
							name:'开门到位信号',
							type:'line',
							step: 'start',
							data:_this.openTo
						},{
							name:'关门到位信号',
							type:'line',
							step: 'start',
							data:_this.closeTo
						},]
					});
					current.setOption({
						tooltip: {
							trigger: 'axis'
						},
						grid: {					
							left: '3%',
							right: '4%',
							top: '3%',
							bottom:'20px',
							containLabel: true
						},
						xAxis: {
							type: 'category',
							data: _this.options,
						},
						yAxis: {
							
						},
						series: [{
							type: 'line',
							smooth: true,
							data:_this.current
						}]
					});
					speed.setOption({
						tooltip: {
							trigger: 'axis'
						},
						grid: {					
							left: '3%',
							right: '4%',
							top: '3%',
							bottom:'20px',
							containLabel: true
						},
						xAxis: {
							type: 'category',
							data: _this.options,
						},
						yAxis: {
						},
						series: [{
							type: 'line',
							smooth: true,
							data:_this.speed
						}]
					});
				}, _this.query.interval);
				if(_this.end == 0){
					clearInterval(inte)
				}
			},
			//状态
			parseStatus(event) {
				let statusName = '无';
				if (event.openKeep) {
					statusName = '开门到位维持';
				}
				if (event.closeKeep) {
					statusName = '关门到位维持';
				}
				if (event.open) {
					statusName = '正在开门';
				}
				if (event.close) {
					statusName = '正在关门';
				}
				if (event.stop) {
					statusName = '停止输出';
				}
				return statusName
			},
			//报警状态
			alertName(event) {
				if (event.isLoss) {
					return '无';
				}
				let str = '';
				if (event.inHigh) {
					str += ' 输入电压过高 ';
				}
				if (event.inLow) {
					str += ' 输入电压过低 ';
				}
				if (event.outHigh) {
					str += ' 输出过流 ';
				}
				if (event.motorHigh) {
					str += ' 电机过载 ';
				}
				if (event.flySafe) {
					str += ' 飞车保护 ';
				}
				if (event.closeStop) {
					str += ' 开关门受阻 ';
				}
				if (str === '') {
					str = '运行正常';
				}
				return str;
			},
			formatDate(val, format) {
				return formatDate(val, format)
			},
			getX(){
				for(var i=0; i< this.nums ;i++){
					this.options[i] = i
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.ss{
		width: 100%;
		height: 80px;
	}
	.ss1{
		width: 100%;
		height: 150px;
	}
	.card {
		margin-top: 5px;
		min-height: 340px;
		.fr {
			font-style: normal;
			color: #289efc;
		}
	}
	.status {
		p {
			color: #289efc;
		}
	}
	.control {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 6px;
		& > span {
				font-size: 12px;
		}
	}
	.doors {
		max-width: 330px;
		display: flex;
		flex-flow: row;
		background-color: #EEEEEE;
	}
	.outer {
		background: url("../../../assets/ladder-bg.jpg") repeat;
		width: 68%;
		height: 230px;
		padding: 15px;
		box-shadow: 0 0 20px rgba(0, 0, 0, .5) inset;
	}
	.inner {
		position: relative;
		height: 200px;
		border: 1px solid #333;
		section {
			position: absolute;
			width: 50%;
			height: 100%;
			left: 0;
			background: url("../../../assets/ladder-bg.jpg") repeat;
		}
		& > section:nth-child(2) {
			left: 50%;
			right: 0;
			border-left: 1px solid #666;
		}
	}
	.info {
		width: 32%;
		display: flex;
		flex-flow: column;
		padding-bottom: 6px;
		p {
			margin: 0;
			padding: 0;
			display: flex;
			flex-flow: row wrap;
			color: #D72800;
			font-size: 26px;
			font-weight: bold;
			height: 40px;
			line-height: 40px;
			i {
				font-style: normal;
				width: 50%;
				text-align: center;
			}
			.icon {
				height: 40px;
				line-height: 40px;
			}
		}
		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			width: 100%;
			height: 184px;
			display: flex;
			flex-flow: row wrap;
			li {
				font-size: 12px;
				margin: 0;
				padding: 0;
				width: 50%;
				text-align: center;
				color: #999;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	canvas {
		width: 85%;
	}
	.shaft {
		max-width: 320px;
		margin-top: -10px;
		border: 2px solid #aaa;
		border-bottom: 1px solid #aaa;
		height: 56px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
		position: relative;
		section {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			border: 1px solid #666;
			padding: 11px 11px 0;
		}
		div {
			width: 16px;
			height: 16px;
			border-radius: 50%;
			border: 1px solid #666;
		}
		.noborder {
			border-color: transparent;
		}
		& > p {
			position: absolute;
			top: 19px;
			left: 29px;
			right: 29px;
			border: 1px solid #666;
			height: 16px;
		}
		.shaftinfo {
			border: 0;
			position: absolute;
			left: 0;
			bottom: 3px;
			width: 100%;
			p {
				display: inline-block;
				width: 45%;
				font-size: 11px;
				line-height: 12px;
				margin: 0;
				text-align: right;
			}
			.signal {
				display: inline-block;
				width: 8px;
				height: 8px;
				line-height: 12px;
				background: #828081;
				border-radius: 50%;
			}
			.ready {
				background: #21B923;
			}
		}
	}
	.realdoors {
		max-width: 320px;
		position: relative;
		display: flex;
		flex-flow: row nowrap;
		border: 3px solid #C6C6C6;
		height: 220px;
		justify-content: space-between;
		overflow: hidden;
		.doorbox {
			position: absolute;
			width: 50%;
			height: 100%;
			background: url("../../../assets/ladder-bg.jpg") repeat;
			background-size: 100% 100%;
		}
		& > .doorbox:first-child {
			left: 0;
			border-right: 1px solid #B8B8B8;
		}
		& > .doorbox:last-child {
			right: 0;
			border-left: 1px solid #B8B8B8;
		}
		.doorstitle {
			width: 16%;
			height: 100%;
			background: transparent;
			position: absolute;
			left: 42%;
			z-index: 8;
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			div {
				width: 6px;
				max-width: 10px;
				height: 60%;
				margin: auto;
				border: 1px solid #eaeaea;
				background: #fff;
			}
			.screen {
				background: #21B923;
			}
		}
		p {
			position: absolute;
			width: 10px;
			top: 70px;
			right: 6px;
			font-size: 11px;
		}
	}
	.ul {
		list-style: none;
		display: inline-block;
		padding: 0;
		width: 40%;
		text-align: center;
		z-index: 5;
		margin-top: 8px;
		li {
			position: relative;
			display: inline-block;
		}
		& > li:nth-child(1),
		& > li:nth-child(3) {
			width: 36px;
			height: 36px;
			border: 1px solid #eaeeea;
			background: #fff;
			vertical-align: middle;
			text-align: center;
			// word-spacing: 8px;
			letter-spacing: 1px;
			line-height: 36px;
			font-size: 16px;
		}
		& > li:nth-child(2) {
			display: inline-block;
			width: 20px;
			height: 36px;
			line-height: 36px;
			vertical-align: middle;
			text-align: center;
			font-size: 18px;
		}
	}
	.offsets {
		.ul {
			width: 33%;
		}
	}
	.detail {
		width: 50%;
	}
	.addr {
		padding: 0;
		margin-bottom: 0;
	}
	.input {
		// color: transparent;
		// transform: scale(0);
		position: absolute;
		width: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		// opacity: 0;
		z-index: 10;
		font-size: 14px;
		outline: none;
		border: 0;
		text-align: center;
		background: transparent;
		letter-spacing: 1px;
	}
	.center {
		display: flex;
		flex-flow: row;
		justify-content: center;
		align-items: center;
	}
	.debug {
		margin-top: 8px;
		border-radius: 3px;
		border: 1px solid #ccc;
		padding-bottom: 8px;
	}
	.debug-card {
		max-width: 460px;
	}
	input[disabled] {
		color: #999;
	}
	.chart-title {
		font-size: 12px;
		padding-left: 8px;
	}
	.layout-content-main{
		overflow-y: scroll;
	}
</style>