<template lang="jade">
	div(style="padding:0")
		div.ch(id="test1" style="width:100%", :style="'height:'+screenheight/2.6+'px'")
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
					monday:'0',
					tuesday:'0',
					wensday:'0',
					thursday:'0',
					friday:'0',
					saturday:"0",
					sunday:"0",
				},
				list:{
					monday:'0',
					tuesday:'0',
					wensday:'0',
					thursday:'0',
					friday:'0',
					saturday:"0",
					sunday:"0",
				},
			};
		},
		created(){
			this.screenheight = document.documentElement.clientHeight;
			this.LastWeek = this.getWeek(7)
			this.LastWeekend = this.getWeek(1)
			this.NowWeek = this.getWeek(0)
			this.NowWeekend = this.getWeek(-6)
			this.getLastData(this.LastWeek,this.LastWeekend)
			this.getData(this.NowWeek,this.NowWeekend)
			setTimeout(() => {
				this.refresh();
			},500)
		},
		components: {
			draggable,
		},
		methods: {
			refresh(){
				this.OrderCharts();
				setTimeout(() => {
					this.refresh();
				},2000)
			},
			async getLastData(val,item){
				let res = await this.$api.orderCount({
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
			},
			async getData(val,item){
				let res = await this.$api.orderCount({
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
				test1.resize()
				test1.setOption({
					title: {
						text: this.$t('fault trend'),
						subtext: this.$t('times')
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: [ this.$t('this week') , this.$t('last week')],
						 textStyle: {
						//                             color: '#333333',
						                            fontSize:16
						                        },
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: [this.$t('Mon'), this.$t('Tue'), this.$t('Wed'), this.$t('Thu'), this.$t('Fri'), this.$t('Sat'), this.$t('Sun')],
						axisLabel: {
		                        textStyle: {
		//                             color: '#333333',
		                            fontSize:20
		                        },
		                    },
					},
					yAxis: {
						type: 'value',
					},
					series: [{
						name: this.$t('this week'),
						type: 'line',
						data: [this.list.monday, this.list.thursday, this.list.wensday,this.list.thursday,
						this.list.friday,this.list.saturday,this.list.sunday,],
						markPoint: {
							data: [
								{type: 'max', name: this.$t('max')},
								{type: 'min', name: this.$t('min')}
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
						name: this.$t('last week'),
						type: 'line',
						data: [this.Lastlist.monday, this.Lastlist.tuesday, this.Lastlist.wensday, this.Lastlist.thursday,
						this.Lastlist.friday, this.Lastlist.saturday, this.Lastlist.sunday],
						markPoint: {
							data: [
								{type: 'max', name: this.$t('max')},
								{type: 'min', name: this.$t('min')}
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
		height: 500px;
	}
</style>
