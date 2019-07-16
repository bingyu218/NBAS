<template lang="jade">
	div.layout-content-main
		div.form.mb-10.form-detail
			Row.mb-10(:gutter="8")
				Col.padding(span="8")
					Card.card
						p.clearfix(slot="title")|基础信息
						Form.status(:model="show",label-position="left",:label-width="80")
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
									i(v-text="floors[floors.length-1-show.floor]")
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
				query:{
					id:this.$route.params.id,
					page: 1,
					num: 1,
				},
				t_start:{},
				t_end:{},
				interval:{},
				options:[],
				nums:'',
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
				floors: [14,13,12,11,10,9,8,7,6,5,4,3,2,1,-1,-2],
				picture:{
					run:'',
					lock:'',
					close:'',
				},
			}
		},
		created(){
			if(this.$route.params.id){
				this.getData();
				setTimeout(() => {
					this.drawLine();
				},500)
			}
			else{
				this.$route.back()
			}
		},
		components: {
			draggable,
		},
		methods: {
			drawLine(){					
				let run = this.$echarts.init(document.getElementById('run'))
				let lock = this.$echarts.init(document.getElementById('lock'))
				let close = this.$echarts.init(document.getElementById('close'))
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
						type:'line',
						step: 'start',
						data:this.event.run
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
						type:'line',
						step: 'start',
						data:this.event.lock
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
						type:'line',
						step: 'start',
						data:this.event.close
					}]
				});
				var _this = this
				function ss(i){
				_this.show.run = _this.event.run[i]
				_this.show.lock = _this.event.lock[i]
				_this.show.openBtn = _this.event.openBtn[i]
				_this.show.closeBtn = _this.event.closeBtn[i]
				_this.show.close = _this.event.close[i]
				_this.show.model = _this.event.model[i]
				_this.show.status = _this.event.status[i]
				_this.show.upCall = _this.event.upCall[i]
				_this.show.downCall = _this.event.downCall[i]
				}
				function css(){
					document.getElementById("1").style.paddingTop= "8px"
					document.getElementById("1").style.paddingLeft = "20px"
					document.getElementById("1").style.marginRight = "8px"
				}
				function downOrUp(){
					document.getElementById("1").className = 'fa fa-sort'
					css()
					if(_this.show.upCall == 1){
						if(_this.show.downCall == 0){
							document.getElementById("1").className = 'fa fa-sort-up'
							css()
						}
					}
					if(_this.show.upCall == 0){
						if(_this.show.downCall == 1){
							document.getElementById("1").className = 'fa fa-sort-down'
							css()
						}
					}
				}
				run.on('click',function (params){
					var i = params.name;//横坐标的值
					ss(i)
					downOrUp()
				});
				close.on('click',function (params){
					var i = params.name;//横坐标的值
					ss(i)
					downOrUp()
				});
				lock.on('click',function (params){
					var i = params.name;//横坐标的值
					ss(i)
					downOrUp()
				});
			},
			//电梯数据展示
			async getData(val = false) {
				let response = await this.$api.event(this.query)				
				if (response.data.code === 0) {
					let res = response.data.data.list
					this.interval = res[0].interval
					this.nums = res[0].nums
					let buffer = []
					if (true) {
						buffer = base64url.toBuffer(res[0].data);	//8位转流
					}
					for(var i=0 ; i<res[0].nums ; i++){
						this.show.upCall   = this.event.upCall[i] = buffer[i*8]&0x01
						this.show.downCall = this.event.downCall[i] = (buffer[i*8]&0x02)>>1
						this.show.run      = this.event.run[i] = (buffer[i*8]&0x04)>>2				//获取运行信号
						this.show.lock     = this.event.lock[i] = (buffer[i*8]&0x08)>>3					//获取门锁信号
						this.show.openBtn  = this.event.openBtn[i] = (buffer[i*8]&0x40)>>6				//获取开门按钮信号
						this.show.closeBtn = this.event.closeBtn[i] = (buffer[i*8]&0x80)>>7					//获取关门按钮信号
						this.show.close    = this.event.close[i] = (buffer[i*8]&0x10)>>5					//获取关门信号
						this.show.model    = this.event.model[i] =  buffer[i*8+1]&0xff						//获取电梯模式
						this.show.status   = this.event.status[i] = buffer[i*8+2]&0xff						//获取电梯状态
						
						this.show.floor = this.event.floor[i] = buffer[i*8+3]&0xff
						if(this.event.floor[i]>=this.floors.length){
							this.show.floor = this.floors.length-1
						}
					}					
					this.t_start = res[0].time
					this.t_end = this.t_start+res[0].nums*this.interval
					this.getX()
					const now = new Date().getTime();   //长整型时间戳
					Event.updateTime = res[0].time+res[0].interval*res[0].nums					
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
</style>