<template lang="jade">
	div.layout-content-main
		Row(:gutter=10)
			draggable(:options="{animation: 60,handle:'.drag'}")
				Col(span="24" style="padding-top:10px")
					Card.drag
						div.ch(id="test1")
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
				Lastlist:{
					monday:'',
					tuesday:'',
					wensday:'',
					thursday:'',
					friday:'',
					saturday:'',
					sunday:'',
				},
				list:{
					monday:'',
					tuesday:'',
					wensday:'',
					thursday:'',
					friday:'',
					saturday:'',
					sunday:'',
				},
			};
		},
		created(){
			this.LastWeek = this.getWeek(7)
			this.LastWeekend = this.getWeek(1)
			this.NowWeek = this.getWeek(0)
			this.NowWeekend = this.getWeek(-6)
			this.$Notice.success({
				title: '成功',
				desc: '正在生成图表'
			});
			this.getLastData(this.LastWeek,this.LastWeekend)
			this.getData(this.NowWeek,this.NowWeekend)
		},
		components: {
			draggable,
		},
		methods: {
			async getLastData(val,item){
				let res = await this.$api.eventCount({
					starttime:val,
					endtime:item,
				})
				this.Lastlist.monday = res.data.data.monday
				this.Lastlist.tuesday = res.data.data.tuesday
				this.Lastlist.wensday = res.data.data.wensday
				this.Lastlist.thursday = res.data.data.thursday
				this.Lastlist.friday = res.data.data.friday
				this.Lastlist.saturday = res.data.data.saturday
				this.Lastlist.sunday = res.data.data.sunday
				this.OrderCharts();
			},
			async getData(val,item){
				let res = await this.$api.eventCount({
					starttime:val,
					endtime:item,
				})
				this.list.monday = res.data.data.monday
				this.list.tuesday = res.data.data.tuesday
				this.list.wensday = res.data.data.wensday
				this.list.thursday = res.data.data.thursday
				this.list.friday = res.data.data.friday
				this.list.saturday = res.data.data.saturday
				this.list.sunday = res.data.data.sunday
				this.OrderCharts();
			},
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
			OrderCharts() {
				let test1 = this.$echarts.init(document.getElementById('test1'))
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
						data: [this.list.monday, this.list.tuesday, this.list.wensday,this.list.thursday,
						this.list.friday,this.list.saturday,this.list.sunday,],
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
						data: [this.Lastlist.monday, this.Lastlist.tuesday, this.Lastlist.wensday, this.Lastlist.thursday,
						this.Lastlist.friday, this.Lastlist.saturday, this.Lastlist.sunday],
						markPoint: {
							data: [
								{type: 'max', name: '最大值'},
								{type: 'min', name: '最小值'}
							]
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
		height: 500px;
	}
</style>
