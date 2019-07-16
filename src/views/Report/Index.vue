<template lang="jade">
	div.layout-content-main
		Row(:gutter=10)
			draggable(:options="{animation: 60,handle:'.drag'}")
				Col(span="12" style="padding-top:10px")
					Card.drag
						div.ch(id="test1")
				Col(span="12" style="padding-top:10px")
					Card.drag
						div.ch(id="test2")
				Col(span="12" style="padding-top:10px")
					Card.drag
						div.ch(id="test3")
				Col(span="12" style="padding-top:10px")
					Card.drag
						div.ch(id="test4")
				Col(span="12" style="padding-top:10px")
					Card.drag
						div.ch(id="test5")
</template>

<script>
	import echarts from 'echarts'
	import draggable from 'vuedraggable'
	export default {
		data() {
			return {
				LastWeek:'',
				LastWeekend:'',
				NowWeek:'',
				NowWeekend:'',
			};
		},
		created(){
			this.LastWeek = this.getWeek(7)
			this.LastWeekend = this.getWeek(1)
			this.NowWeek = this.getWeek(0)
			this.NowWeekend = this.getWeek(-6)
			setTimeout(() => {
				this.OrderCharts();
				this.DeviceCharts();
				this.MemberCharts();
			},500)
		},
		components: {
			draggable,
		},
		methods: {
			getWeek(n){
				var now = new Date()
				var year = now.getFullYear()
				var month = now.getMonth()+1
				var date = now.getDate()
				var day = now.getDay()
				if(day !== 0){
					n =n+day-1
				}else{
					n =n+day
				}
				if(day){
					if(month>1){
						month=month
					}else{
						year=year-1
						month=12
					}
				}
				now.setDate(now.getDate()-n);	
				year=now.getFullYear();
				month=now.getMonth()+1;
				date=now.getDate();
				var s=year+"-"+(month<10?('0'+month):month)+"-"+(date<10?('0'+date):date);
				return s
			},
			MemberCharts() {
				let test1 = this.$echarts.init(document.getElementById('test5'))
				test1.setOption({
					title: {
						text: '用户比例',
						subtext: '数量',
						left: 'center',
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						bottom: 10,
						left: 'center',
						data: ['游客', '普通用户','管理员','组长']
					},
					series : [{
						type: 'pie',
						radius : '65%',
						center: ['50%', '50%'],
						selectedMode: 'single',
						data:[
							{value:148, name: '游客'},
							{value:235, name: '普通用户'},
							{value:5, name: '管理员'},
							{value:44, name: '组长'},
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				})
			},
			DeviceCharts() {
				let test1 = this.$echarts.init(document.getElementById('test3'))
				let test2 = this.$echarts.init(document.getElementById('test4'))
				test1.setOption({
					title: {
						text: '新增设备',
						subtext: '数量'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['门机', '控制柜']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					},
					yAxis: {
						type: 'value',
					},
					series: [{
						name: '门机',
						type: 'line',
						data: [6, 8, 11, 4, 3, 5, 1],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						itemStyle : {
							normal : {
								color:'#37a2da',
								lineStyle:{
									color:'#37a2da'
								}
							}
						},
					},
					{
						name: '控制柜',
						type: 'line',
						data: [6, 5, 7, 3, 2, 3, 4],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						itemStyle : {
							normal : {
								color:'#ffd460',
								lineStyle:{
									color:'#ffd460'
								}
							}
						},
					}]
				})
				test2.setOption({
					title: {
						text: '本周访问量',
						subtext: '人数'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['游客', '用户']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					},
					yAxis: {
						type: 'value',
					},
					series: [{
						name: '游客',
						type: 'line',
						data: [10, 13, 22, 15, 23, 22, 40],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							],
							
						},
						itemStyle : {
							normal : {
								color:'#67e0e3',
								lineStyle:{
									color:'#67e0e3'
								}
							}
						},
					},
					{
						name: '用户',
						type: 'line',
						data: [41, 53, 62, 51, 41, 50, 72],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						itemStyle : {
							normal : {
								color:'#ff9f7f',
								lineStyle:{
									color:'#ff9f7f'
								}
							}
						},
					}]
				})
			},
			OrderCharts() {
				let test1 = this.$echarts.init(document.getElementById('test1'))
				let test2 = this.$echarts.init(document.getElementById('test2'))
				test1.setOption({
					title: {
						text: '事件对比',
						subtext: '次数'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['本周事件数量', '上周事件数量']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					},
					yAxis: {
						type: 'value',
					},
					series: [{
						name: '本周事件数量',
						type: 'line',
						data: [41, 55, 60, 43, 52, 33, 20],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
					},
					{
						name: '上周事件数量',
						type: 'line',
						data: [60, 75, 67, 83, 52, 33, 40],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
					}]
				})
				test2.setOption({
					title: {
						text: '故障数量对比',
						subtext: '次数'
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: ['本周故障数量', '上周故障数量']
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					},
					yAxis: {
						type: 'value',
					},
					series: [{
						name: '本周故障数量',
						type: 'line',
						data: [1, 3, 2, 5, 3, 2, 0],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						itemStyle : {
							normal : {
								color:'#e69d87',
								lineStyle:{
									color:'#e69d87'
								}
							}
						},
					},
					{
						name: '上周故障数量',
						type: 'line',
						data: [1, 3, 2, 1, 1, 0, 2],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
						},
						itemStyle : {
							normal : {
								color:'#759aa0',
								lineStyle:{
									color:'#759aa0'
								}
							}
						},
					}]
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.ch{
		width: 100%;
		height: 350px;
	}
	.layout-content-main{
		overflow-y: scroll;
	}
</style>
