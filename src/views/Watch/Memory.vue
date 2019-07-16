<template lang="jade">
	div.layout-content-main
		div.form.mb-10.form-detail
			Card
				Form.status(:model="show",label-position="left",:label-width="75")
					Row(:gutter="16")
						Col(span="4")
							Form-item(label="创建人：")
								p()
						Col(span="5")
							Form-item(label="创建时间：")
								p()
						Col(span="5")
							Form-item(label="在线人数：")
								p()
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
						Form.status(:model="show",label-position="left",:label-width="75")
							Row(:gutter="16")
								Col(span="12")
									Form-item(label="运行信号：")
										p(v-text="show.run ? '运行':'停车'")
								Col(span="10")
									Form-item(label="门锁信号：",:label-width="100")
										p(v-text="show.lock ? '通':'断'")
							Row(:gutter="16")
								Col(span="12")
									Form-item(label="关门信号：")
										p(v-text="show.close ? '动作':'不动作'")
								Col(span="12")
									Form-item(label="关门按钮信号：",:label-width="100")
										p(v-text="show.closeBtn ? '有':'无'")
							Row(:gutter="16")
								Col(span="12")
									Form-item(label="电梯模式：")
										p(v-text="parseModel(show)")
								Col(span="10")
									Form-item(label="开门按钮信号：",:label-width="100")
										p(v-text="show.openBtn ? '有':'无'")
							Row(:gutter="16")
								Col(span="24")
									Form-item(label="状态：")
										p(v-text="parseStatus(show)")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="上运方向行信号：",:label-width="120")
										p(v-text="show.upCall ? '有':'无'")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="下运方向行信号：",:label-width="120")
										p(v-text="show.downCall ? '有':'无'")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="开始时间：")
										p(v-text="formatDate(this.t_start, 'yyyy-MM-dd HH:mm:ss')")
							Row(:gutter="16")
								Col(span="22")
									Form-item(label="结束时间：")
										p(v-text="formatDate(this.t_end, 'yyyy-MM-dd HH:mm:ss')")
					Card.card.animate
						p(slot="title")|控制柜
						div.doors
							div.outer
								div.inner
									section
									section
							div.info
								p
									span.pr(id="1" class="fa fa-sort" )
									i(v-text="show.floor")
								ul
									li(v-for="(item, index) in floors",v-text="item",:key="index",:style="{width:floorWidth(floors.length)}")
				Col(span=16)
					draggable(:options="{animation: 60,handle:'.drag'}")
						Card(style="margin-bottom:10px")
							p.drag(slot="title")|运行信号
							div.ss(id="run" draggable=false)
						Card(style="margin-bottom:10px")
							p.drag(slot="title")|门锁信号
							div.ss(id="lock" draggable=false)
						Card(style="margin-bottom:10px")
							p.drag(slot="title")|关门信号
							div.ss(id="close" draggable=false)
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
				query:{
					device_type: 240,
					type: 1,
					address: '1,1,1,1,1,1,1,1',
					segment: 0,
					IMEI: this.$route.params.IMEI,
					duration: this.$route.params.duration,
					threshold: this.$route.params.threshold,
					interval: this.$route.params.interval,
					op:'open',
				},
				id:this.$route.params.id,
				t_start:'',
				t_end:'',
				interval:{},
				options:[],
				nums:'',
				modal1:false,
				event:{
					run:[],
					lock:[],
					close:[],
					model:[],
					status:[],
					upCall:[],
					downCall:[],
					openBtn:[],
					closeBtn:[],
					floor:[],
				},
				show:{
					run:'',
					lock:'',
					close:'',
					model:'',
					status:'',
					upCall:'',
					downCall:'',
					openBtn:'',
					closeBtn:'',
					floor:'',
				},
				doorWidth: 4096,
				direction: {
					'01': 'fa fa-sort-up',
					'10': 'fa fa-sort-up',
					'00': '',
					'11': '',
				},
				nowFloor:'fa fa-sort',
				floors: [],
				picture:{
					run:'',
					lock:'',
					close:'',
				},
				run:[],
				lock:[],
				close:[],
				end:50,
			}
		},
		created(){
			this.base();
			this.initWebsocket();
		},
		components: {
			draggable,
		},
		methods: {
			async base(){
				var buffer
				let num =await this.$api.runtime({page:1,num:20,type: 8211,device_id:this.id})
				if (num.data.code == 0) {
					buffer = base64url.toBuffer(num.data.data.list[0].data)
					for (var i=0;(i*3+3)<=buffer.length;i++){
						this.floors.push(String.fromCharCode(buffer[i*3])+String.fromCharCode(buffer[i*3+1])+String.fromCharCode(buffer[i*3+2]))
					}
					console.log(buffer)
				}
			},
			async initWebsocket(){ //初始化weosocket
			
				let res = await this.$api.monitor(this.query);
				if(res.data.code != 0){
					alert("该电梯已被其他人启动实时监控")
				}
				let wsurl ='ws://47.96.162.192:9006/device/Monitor/socket?deviceId='+this.id
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
				console.log(this.id)
				console.log("WebSocket连接发生错误");
				this.loading='WebSocket连接失败'
			},
			websocketonmessage(e){//数据接收
			this.loading='开始获取数据'
				if(e.data=="closed"){
					clearInterval(inte)
					this.loading="此次实时数据已结束"
				}else{
					var redata = JSON.parse(e.data)
					this.interval = redata.interval
					this.end = this.query.duration/this.query.interval
					this.getData(redata)
					setTimeout(() => {
						this.drawLine();
					},1000)
					console.log(redata)
				}
			},
			async closed(){//数据发送
				let res = await this.$api.monitor({
					IMEI:this.query.IMEI,
					op:'closed',
				});
			},
			//电梯数据展示
			getData(val) {
				let buffer = []
				buffer = base64url.toBuffer(val.data);	//8位转流
				console.log(buffer)
				var _this = this
				this.count= 33 
				if (_this.t_start == '') _this.t_start = val.time
				_this.t_end = _this.t_start+this.$route.params.duration*1000
				var inte = setInterval(function () {
					if((_this.count+33) <= buffer.length){
						_this.show.upCall   = buffer[_this.count+0]&0x01
						_this.show.downCall = (buffer[_this.count+0]&0x02)>>1
						_this.show.run      = (buffer[_this.count+0]&0x04)>>2					//获取运行信号
						_this.show.lock     = (buffer[_this.count+0]&0x08)>>3					//获取门锁信号
						_this.show.openBtn  = (buffer[_this.count+0]&0x40)>>6					//获取开门按钮信号
						_this.show.closeBtn = (buffer[_this.count+0]&0x80)>>7					//获取关门按钮信号
						_this.show.close    = (buffer[_this.count+0]&0x10)>>5					//获取关门信号
						_this.show.model    = buffer[_this.count+1]&0xff						//获取电梯模式
						_this.show.status   = buffer[_this.count+2]&0xff						//获取电梯状态				
						_this.show.floor    = buffer[_this.count+27]&0xff
						
// 						if(_this.show.floor>=_this.floors.length){
// 							_this.show.floor = _this.floors.length-1
// 						}
						_this.getX()
						_this.count+=33
					}
				}, _this.query.interval);
				if((_this.count+33) > buffer.length){
					clearInterval(inte)
				}
			},
			drawLine(){
				let run = this.$echarts.init(document.getElementById('run'))
				let lock = this.$echarts.init(document.getElementById('lock'))
				let close = this.$echarts.init(document.getElementById('close'))
				
				var _this = this
				var inte = setInterval(function () {
					_this.run.push(_this.show.run)
					_this.lock.push(_this.show.lock)
					_this.close.push(_this.show.close)
					_this.end-= 1
					if(_this.run.length > 10){
						_this.run.shift()
						_this.lock.shift()
						_this.close.shift()
					}
					run.setOption({
						tooltip: {
							trigger: 'axis'
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
							type:'line',
							step: 'start',
							data:_this.run
						}]
					});
					lock.setOption({
						tooltip: {
							trigger: 'axis'
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
							type:'line',
							step: 'start',
							data:_this.lock
						}]
					});
					close.setOption({
						tooltip: {
							trigger: 'axis'
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
							type:'line',
							step: 'start',
							data:_this.close
						}]
					});
				}, _this.query.interval);
				if(_this.end == 0){
					clearInterval(inte)
				}
			},			
			parseStatus(event) {//状态
				let statusName = '无';
				if (event.status == 128) {
					statusName = '自动';
				}
				if (event.status ==64) {
					statusName = '检修';
				}
				if (event.status ==32) {
					statusName = '司机';
				}
				if (event.status ==16) {
					statusName = '消防';
				}
				if (event.status ==8) {
					statusName = '锁体';
				}
				if (event.status ==4) {
					statusName = '故障';
				}
				if (event.status ==2) {
					statusName = '超载';
				}
				if (event.status ==1) {
					statusName = '满载';
				}
				return statusName
			},
			parseModel(event) {
				let statusName = '无';
				if (event.model == 128) {
					statusName = '单体';
				}
				if (event.model ==64) {
					statusName = '并联';
				}
				if (event.model ==32) {
					statusName = '群控';
				}
				return statusName
			},
			floorWidth(length) {
				const int = parseInt(length / 15);
				switch (int) {
					case 1:
						return '50%'
						break;
					case 2:
						return '30%'
						break;
					case 3:
						return '25%'
						break;
					case 4:
						return '20%'
						break;
					case 5:
						return '15%'
						break;
					default:
						return '50%'
						break;
				}
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
	.pr{
		padding-top: 8px;
		padding-left: 20px;
		margin-right: 8px;
	}
	.ss{
		width: 100%;
		height: 80px;
	}
	.ss1{
		width: 100%;
		height: 150px;
	}
	.card {
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
		width: 100%;
		height: 260px;
		display: flex;
		flex-flow: row;
		background-color: #EEEEEE;
	}
	.outer {
		background: url("../../assets/ladder-bg.jpg") repeat;
		width: 45%;
		height: 100%;
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
			background: url('../../assets/ladder-bg.jpg') repeat;
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
		padding-bottom: 2px;
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
				text-align: left;
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
			height: 100px;
			display: flex;
			flex-flow: row wrap;
			li {
				font-size: 12px;
				margin: 0;
				padding: 0;
				width: 100%;
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
		margin-top: 10px;
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
			background: url("../../assets/ladder-bg.jpg") repeat;
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
</style>