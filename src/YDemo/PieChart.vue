<template >
	<div id="main" style="width:100%;height: 100%; min-height: 200px;"></div>
</template>

<script>
	import echarts from 'echarts'
    export default {
        name: '',
        data () {
            return {
				topcode:[],
				codelist:['维护','过流','母线过压','母线欠压','输入缺相',
						'输出缺相','输出过力矩','编码器故障','模块过热','运行接触器故障',
						'抱闸接触器故障','封星继电器故障','抱闸开关故障','运行中安全回路断开','运行中门锁断开',
						'门锁短接故障','层站召唤通讯故障','轿厢通讯故障','并联通讯故障','开门故障',
						'关门故障','开关门到位故障','平层信号异常','终端减速开关故障','下限位信号异常',
						'上限位信号异常','打滑故障','电梯速度异常','电机反转故障','磁极位置学习故障',
						'E30','停车速度检测','井道自学习故障','马达过热故障','制动力严重不足',
						  '制动力不足警告',]
			
            }
        },
        methods:{
			refresh(){
			this.drawPie('main');
			setTimeout(() => {
				this.refresh();
			},1000)
			},
			async getfaultfreq(){
				// var time=Date.parse(this.$format(new Date(), 'yyyy-MM-DD'))
				let res = await this.$api.faultfreq()
				if (res.data.code == 0){
					this.topcode=res.data.list
					for (var i=6;i<this.topcode.length;i++){
						this.topcode[5].counter=this.topcode[5].counter+this.topcode[i].counter
					}
				}
				this.refresh()
			},
            drawPie(id){
               this.charts = echarts.init(document.getElementById(id))
			   this.charts.resize()
               this.charts.setOption({
                backgroundColor: '#1d2d47',
// 				title: {
// 					text: 'Customized Pie',
// 					left: 'center',
// 					top: 20,
// 					textStyle: {
// 						color: '#ccc'
// 					}
// 				},
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},

				visualMap: {
					show: false,
					min: 80,
					max: 600,
					inRange: {
						//明暗度关闭
						//colorLightness: [0, 1]
					}
				},
                 series: [
                   {
					name:'访问来源',
					type:'pie',
					radius : '55%',
					center: ['50%', '50%'],
					color: ['rgb(131,249,103)', '#FBFE27','#9900fa', '#FE5050', '#1DB7E5','#e254dd'],
					data:[
						{value:this.topcode[0].counter, name: this.codelist[parseInt(this.topcode[0].code.toString(16))]},
						{value:this.topcode[1].counter, name: this.codelist[parseInt(this.topcode[1].code.toString(16))]},
						{value:this.topcode[2].counter, name: this.codelist[parseInt(this.topcode[2].code.toString(16))]},
						{value:this.topcode[3].counter, name: this.codelist[parseInt(this.topcode[3].code.toString(16))]},
						{value:this.topcode[4].counter, name: this.codelist[parseInt(this.topcode[4].code.toString(16))]},
						{value:this.topcode[5].counter, name: '其它'}
					].sort(function (a, b) { return a.value - b.value; }),
					roseType: 'radius',
					label: {
						normal: {
// 							textStyle: {
// 								color: 'rgba(17, 167, 244, 0.3)'
// 							}
							formatter: ['{c|{c}}', '{b|{b}}'].join('\n'),
								rich: {
								  c: {
									color: 'rgb(241,246,104)',
									fontSize: 20,
									fontWeight: 'bold',
									lineHeight: 5,
									},
								  b: {
									color: 'rgb(98,137,169)',
									fontSize: 15,
									height: 40
								  },
								},
							}
					},
					labelLine: {
						normal: {
							lineStyle: {
								 color: 'rgb(98,137,169)',
							},
							smooth: 0.2,
							length: 10,
							length2: 20
						}
					},
					itemStyle: {
						normal: {
							
							shadowBlur: 200,
							shadowColor: 'rgba(0, 0, 0, 0.8)',
						}
					},

					animationType: 'scale',
					animationEasing: 'elasticOut',
					animationDelay: function (idx) {
						return Math.random() * 200;
					}
				}
               ]
               })
            }
        },
      //调用
	  created() {
	  	this.getfaultfreq();
	  },
//         mounted(){
// 			
// 			refresh(){
// 			this.drawPie('main');
// 			setTimeout(() => {
// 				this.refresh();
// 			},1000)
// 			},
// 			
// 			
// 			
// 			window.onresize= () => {
// 			this.charts.resize()
// 			}
//         }
    }

</script>

<style>
</style>
