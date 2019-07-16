<template lang="jade">
	div(style="padding:0")
		Col(span='10' style="font-size : large;font-weight: bold;color:#333333")|{{$t('devices usage ')}}top5
		Col(span='6')
			DatePicker(type="date", :placeholder="$t('from date')" format="yyyy-MM-dd" v-model="starttime" style='' @on-change="search()")
		Col(span='1' align='center')
			div(style="margin-top:5px")|→
		Col(span='6')
			DatePicker(type="date", :placeholder="$t('closing date')" format="yyyy-MM-dd" v-model="endtime" style='' @on-change="search()")
		div.ch(id="activedoor" style="width:100%",:style="'height:'+screenheight+'px'")
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
				topdevice:[],
				starttime:'',
				endtime:'',
			};
		},
		created(){
			this.screenheight = document.documentElement.clientHeight/2.6-32;
			// setTimeout(() => {
				this.getactivedoor();
			// },500)
		},
		components: {
			draggable,
		},
		methods: {
			refresh(){
				this.OrderCharts()
				setTimeout(() => {
					this.refresh();
				},1000)
			},
			async search(){
				var starttime=''
				var endtime=''
				if ((this.starttime>this.endtime)&&(this.endtime !="")) {
					this.endtime=this.starttime
					this.$Notice.warning({
						title: '提示',
						desc: '截至日期必须大于开始日期',
						})
					}
				let res = await this.$api.activedoor({starttime: this.$format(this.starttime.toString(),'YYYY-MM-DD'),
													endtime: this.$format(Date.parse(this.endtime)+86400000,'YYYY-MM-DD')})
				this.topdevice=res.data.list
				if (res.data.code == 0){
					this.topdevice=res.data.list
				}
			},
			async getactivedoor(){
				let res = await this.$api.activedoor()
				this.topdevice=res.data.list
				if (res.data.code == 0){
					this.topdevice=res.data.list
				}
				this.refresh()
			},
			OrderCharts() {

				let activedoor = this.$echarts.init(document.getElementById('activedoor'))
				activedoor.resize()
				activedoor.setOption({
					// triggerEvent:false,
					title: {
							show:false,
							text: '设备使用次数TOP5',
							textStyle: {
				              color: '#333333',
				              fontSize:'16'
				              },
					},
					xAxis: {
						type: 'category',
						data: [this.topdevice[0].device_name, 
								this.topdevice[1].device_name, 
								this.topdevice[2].device_name, 
								this.topdevice[3].device_name, 
								this.topdevice[4].device_name, 
						],
						// triggerEvent:false,
						splitLine: {
	               			show: false, 
		                    //  改变轴线颜色
		                    lineStyle: {
		                        // 使用深浅的间隔色
		                        color: ['white']
							}                            
						},
		                    //  改变x轴颜色
	                    axisLine:{
	                        lineStyle:{
	                            color:'#333333',
	                            width:0.5,//这里是为了突出显示加上的，可以去掉
	                        }
	                    },                         
	                    //  改变x轴字体颜色和大小
	                    axisLabel: {
	                        textStyle: {
	//                             color: '#333333',
	                            fontSize:12
	                        },
							interval: 0,
							formatter:function(value)
							{

								var ret = "";//拼接加\n返回的类目项
								var maxLength = 5;//每项显示文字个数
								var valLength = value.length;//X轴类目项的文字个数
								var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
								if (rowN > 1)//如果类目项的文字大于3,
								{
									for (var i = 0; i < rowN; i++) {
										var temp = "";//每次截取的字符串
										var start = i * maxLength;//开始截取的位置
										var end = start + maxLength;//结束截取的位置
										//这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
										temp = value.substring(start, end) + "\n";
										ret += temp; //凭借最终的字符串
									}
									return ret;
								}
								else {
									return value;
								}
							}

	                    },
					},
// 					 grid: {
// 						left: '10%',
// 						right: '10%',
// 						// containLabel: true
// 					},
					yAxis: {
						type: 'value',
						splitLine: {
	               			show: false, 
	                    //  改变轴线颜色
	                    lineStyle: {
	                        // 使用深浅的间隔色
	                        color: ['white']
	                        }                            
	                    },
						// triggerEvent:false,
	                    //  改变x轴颜色
	                    axisLine:{
	                        barStyle:{
	                            color:'#007F00',
	//                            width:8,//这里是为了突出显示加上的，可以去掉
	                        }
	                    },                         
	                    //  改变x轴字体颜色和大小
	                    axisLabel: {
	                        textStyle: {
	                            color: '#333333',
	                            fontSize: 10
	                        },
	                    },
					},
					series: [{
							data: [this.topdevice[0].counter,
									this.topdevice[1].counter,
									this.topdevice[2].counter,
									this.topdevice[3].counter,
									this.topdevice[4].counter,
							],
							// triggerEvent:false,
							type: 'bar',
							color:'#FF7F00',
							barWidth: 40,
							itemStyle: {
								normal: {
									//通过数组下标选择颜色
									color: function(params) {
											var colorList = [
											 '#FF7F00','#FF7F00','#FF7F00','#FF7F00','#FF7F00',
											 '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD'
											 ];
										return colorList[params.dataIndex]
									},
								}
							}
					}]
				})
				if(activedoor._$handlers.click){
					activedoor._$handlers.click.length = 0;
				}
				var _this=this
				activedoor.on('click', function (params) {
					_this.$router.push({
						name: 'eventreport',
						params: {
							device_name: params.name
						}
					})
				})
			},
			go(){
				alert(1)
				this.$router.push({
					name: 'order',
					params: {
						device_name: params.name
					}
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
