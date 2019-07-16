<template lang="jade">
div.layout-content-main
	div.form.mb-10.form-detail
		Row.mb-10(:gutter="8")
			Col.padding(span=8)
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
								Form-item(label="开始时间：")
									p(v-text="formatDate(this.t_start, 'yyyy-MM-dd HH:mm:ss')")
						Row(:gutter="16")
							Col(span="22")
								Form-item(label="结束时间：")
									p(v-text="formatDate(this.t_end, 'yyyy-MM-dd HH:mm:ss')")
						Row(:gutter="16")
							Col(span="22")
								Form-item(label="报警：")
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
					Card(style="margin-bottom:10px" )
						p.drag(slot="title")|开关门信号 {{this.interval}} ms
						div.ss(id="openIn" draggable=false)
					Card(style="margin-bottom:10px")
						p.drag(slot="title")|开关门到位信号
						div.ss(id="closeIn")
					Card(style="margin-bottom:10px")
						p.drag(slot="title")|门电流
						div.ss1(id="current")
					Card(style="margin-bottom:10px")
						p(slot="title")|门速度 m/s
						div.ss1(id="speed")
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
	const data = [{
		time: 0,
		value: 0,
	}]
	export default {
		data () {
			return {
				query:{
					id:this.$route.params.id,
					page: 1,
					num: 1,
				},
				t_start:'',
				t_end:'',
				options:[],
				nums:'',
				event:{
					openIn:[],
					closeIn:[],
					current:[],
					openToOut:[],
					openTo:[],
					closeToOut:[],
					closeTo:[],
					door:[],
					open:[],
					close:[],
					openKeep:[],
					closeKeep:[],
					stop:[],
					inHigh:[],
					inLow:[],
					outHigh:[],
					motorHigh:[],
					flySafe:[],
					closeStop:[],
					position:[],
					speed:[],
				},
				show:{
					openIn:'',
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
				doorWidth: 4096,
				interval:'',
				point:'',
			}
		},
		created(){
			this.getData();
			this.getDoorWidth();
			if(this.$route.params.id){
				this.getData();
				setTimeout(() => {
					this.drawLine();
				},500)
			}
			else{
				this.$router.back()
			}
		},
		components: {
			draggable,
		},
		methods: {
			async getDoorWidth(){
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
			},
			drawLine(){
				let openIn = this.$echarts.init(document.getElementById('openIn'))
				let closeIn = this.$echarts.init(document.getElementById('closeIn'))
				let current = this.$echarts.init(document.getElementById('current'))
				let speed = this.$echarts.init(document.getElementById('speed'))
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
						data: this.options,	
					},
					yAxis: {
						data:[0,1]
					},
					dataZoom: [{
						startValue: formatDate(this.t_start,'HH:mm:ss'),
						top: '60px',
					}, {
						type: 'inside'
					}],
					series: [{
						name:'开门信号',
						type:'line',
						step: 'start',
						data:this.event.openIn
					},{
						name:'关门信号',
						type:'line',
						step: 'start',
						data:this.event.closeIn
					}]
				});				
				closeIn.setOption({
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
						data: this.options,
					},
					yAxis: {
						data:[0,1]
					},
					dataZoom: [{
						startValue: formatDate(this.t_start,'HH:mm:ss'),
						top: '60px',
					}, {
						type: 'inside'
					}],
					series: [{
						name:'开门到位信号',
						type:'line',
						step: 'start',
						data:this.event.openTo
					},{
						name:'关门到位信号',
						type:'line',
						step: 'start',
						data:this.event.closeTo
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
						data: this.options,
					},
					yAxis: {
						
					},
					dataZoom: [{
						startValue: formatDate(this.t_start,'HH:mm:ss'),
						top: '110px',
					}, {
						type: 'inside'
					}],
					series: [{
						type: 'line',
						smooth: true,
						data:this.event.current
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
						data: this.options,
					},
					yAxis: {						
					},
					dataZoom: [{
						startValue: formatDate(this.t_start,'HH:mm:ss'),
						top: '110px',
					}, {
						type: 'inside'
					}],
					series: [{
						type: 'line',
						smooth: true,
						data:this.event.speed
					}]
				});
				var _this = this
				function ss(i){
					_this.show.openIn  = _this.event.openIn[i]					//获取开门信号
					_this.show.closeIn = _this.event.closeIn[i]				//获取关门信号
					_this.show.openToOut = _this.event.openToOut[i]				//获取开到位输出信号
					_this.show.closeToOut = _this.event.closeToOut[i]				//获取关到位输出信号
					_this.show.closeTo = _this.event.closeTo[i]				//获取关到位输入信号				
					_this.show.openTo =	_this.event.openTo[i]				//获取开到位输入信号
					_this.show.door	= _this.event.door[i]					//门光幕信号
					_this.show.open	= _this.event.open[i]					//正在开门信号
					_this.show.close =	_this.event.close[i]				//正在关门信号
					_this.show.openKeep	= _this.event.openKeep[i]				//开门到位维持信号
					_this.show.closeKeep = _this.event.closeKeep[i]				//关门到位维持信号
					_this.show.stop	= _this.event.stop[i]					//停止输出信号
					_this.show.inHigh = _this.event.inHigh[i]					//输入电压过高
					_this.show.inLow = _this.event.inLow[i]					//输入电压过低
					_this.show.outHigh = _this.event.outHigh[i]				//输出过流
					_this.show.motorHigh = _this.event.motorHigh[i]				//电机过载
					_this.show.flySafe = _this.event.flySafe[i]				//飞车保护
					_this.show.position	= _this.event.position[i]				//获取位置信号
					_this.show.closeStop = _this.event.closeStop[i]				//开关门受阻
					_this.show.current = _this.event.current[i]			//获取电流信号
					_this.show.speed = _this.event.speed[i]
				}
				openIn.on('click',function (params){					
					var i = params.name;//横坐标的值
					ss(i)
				});
				current.on('click',function (params){					
					var i = params.name;//横坐标的值
					ss(i)
				});
				closeIn.on('click',function (params){					
					var i = params.name;//横坐标的值
					ss(i)	
				});
			},
			//电梯数据展示
			async getData(val = false) {
				let response = await this.$api.event(this.query)
				if (response.data.code === 0) {
					const res = response.data.data.list[0]
					this.interval = res.interval
					this.nums = res["length"]
					let buffer = []
					if (true) {
						buffer = base64url.toBuffer(res.data);	//8位转流
					}
					for(var i=0 ; i<this.nums ; i++){
						this.show.openIn = this.event.openIn[i] = (buffer[i*8]&0x80)>>7							//获取开门信号
						this.show.closeIn = this.event.closeIn[i] = (buffer[i*8]&0x40)>>6						//获取关门信号
						this.show.openTo =	this.event.openTo[i] = (buffer[i*8+0]&0x20)>>5						//获取开到位输入信号
						this.show.closeTo = this.event.closeTo[i] = (buffer[i*8+0]&0x10)>>4						//获取关到位输入信号	
						this.show.openToOut = this.event.openToOut[i] = (buffer[i*8]&0x02)>>1					//获取开到位输出信号
						this.show.closeToOut = this.event.closeToOut[i] = buffer[i*8]&0x01						//获取关到位输出信号			
						this.show.door	= this.event.door[i] = (buffer[i*8+1]&0x80)>>7							//门光幕信号
						this.show.open	= this.event.open[i] = (buffer[i*8+1]&0x40)>>6							//正在开门信号
						this.show.close =	this.event.close[i] = (buffer[i*8+1]&0x20)>>5						//正在关门信号
						this.show.openKeep	= this.event.openKeep[i] = (buffer[i*8+1]&0x10)>>4					//开门到位维持信号
						this.show.closeKeep	= this.event.closeKeep[i] = (buffer[i*8+1]&0x08)>>3					//关门到位维持信号
						this.show.stop	= this.event.stop[i] = (buffer[i*8+1]&0x04)>>2							//停止输出信号
						this.show.inHigh = this.event.inHigh[i] = (buffer[i*8+1]&0x02)>>1						//输入电压过高
						this.show.inLow = this.event.inLow[i] = buffer[i*8+1]&0x01								//输入电压过低
						this.show.outHigh = this.event.outHigh[i] = (buffer[i*8+2]&0x80)>>7						//输出过流
						this.show.motorHigh = this.event.motorHigh[i] = (buffer[i*8+2]&0x40)>>6					//电机过载
						this.show.flySafe = this.event.flySafe[i] = (buffer[i*8+2]&0x20)>>5						//飞车保护
						this.show.closeStop = this.event.closeStop[i] = (buffer[i*8+2]&0x10)>>4					//开关门受阻
						this.show.position	= this.event.position[i] = ((buffer[i*8+2]&0x0f)<<8)+(buffer[i*8+3]&0xff)			//获取位置信号
						this.show.current = this.event.current[i] = (((buffer[i*8+4]&0xff)<<8)+(buffer[i*8+5]&0xff))/1000		//获取电流信号
						this.show.speed = this.event.speed[i] = (((buffer[i*8+6]&0xff)<<8)+(buffer[i*8+7]&0xff))/1000
					    if(this.event.speed[i]>32.767){
							this.show.speed = this.event.speed[i] = (this.event.speed[i]-65.535).toFixed(2)
						}
					}				
					this.t_start = res.time
					this.t_end = this.t_start+this.nums*this.interval
					this.getX()
					const now = new Date().getTime();   //长整型时间戳
					Event.updateTime = res.time+res.interval*this.nums
					let isLoss = false;
					if (!Event || !Event.updateTime) {
						isLoss = true;
					} else if (now - Event.updateTime > 120000) {
						isLoss = true;
					} else {
						isLoss = false;
					}
					event.isLoss = isLoss;
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