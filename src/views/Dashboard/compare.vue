<template >
	<div class="" style="padding:0">
		<div>
			<Col span='11' style="font-size: large;font-weight: bold;color:#333333"  class="pull-right">{{$t('faults in this year')}}</Col>
			<Col span='6' style=" float:right; margin-left:5px"> 
			<div style="height:15px;width:15px;background-color:#dcdcdc;display: inline-block;" @click="fault=!fault;areafault()"></div>
			<div style="color:#888888;display: inline-block;" @click="fault=!fault;areafault()" v-if="!fault">{{$t('new faulty devices')}}</div>
			<div style="color:#000000;display: inline-block;" @click="fault=!fault;areafault()" v-if="fault">{{$t('new faulty devices')}}</div>
			</Col>
			<Col span='6' style=" float:right; ">
			<div style="height:15px;width:15px;background-color:#3c8cbc;display: inline-block;" @click="fix=!fix;areafault()"></div>
			<div style="color:#888888;display: inline-block;" @click="fix=!fix;areafault()" v-if="!fix">{{$t('repaired devices')}}</div>
			<div style="color:#000000;display: inline-block;" @click="fix=!fix;areafault()" v-if="fix">{{$t('repaired devices')}}</div>
			</Col>
		</div>
		<div class="chart" style="width:95%">
			<canvas id="areaChart" :style="'height:'+screenheight/2.6+'px'"></canvas>
		</div>
	</div>
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
				fault:true,
				fix:true,
				chartrepair:[],
				chartorder:[],
			};
		},
		created(){
			this.screenheight = document.documentElement.clientHeight-200;
			this.drawchart()
		},
		components: {
			draggable,
		},
		methods: {
			refresh(){
				this.areafault()
				setTimeout(() => {
					this.refresh();
				},2000)
			},
			async drawchart(){
				var rep=''
				var ord=''
				this.chartrepair=[]
				this.chartorder=[]
				var time=this.$format(new Date(), 'YYYY')
				for (var i=0;i<6;i++){
				rep = await this.$api.getRepair({
					search_info: '',
					page: 1,
					num: 1,
					isreg: "True",
					state:'treated',
					order_type:'',
					result:'',
					device_id:'',
					finish_starttime:Date.parse(time+'-'+(i+1).toString()),
					finish_endtime:Date.parse(time+'-'+(i+2).toString()),
				})
				this.chartrepair.push(rep.data.data.totalNumber)
				}
				for (var i=0;i<6;i++){
				ord = await this.$api.fault({
					search_info: '',
					page: 1,
					num: 1,
					isreg: "True",
					order_type:'',
					result:'',
					device_id:'',
					starttime:Date.parse(time+'-'+(i+1).toString()),
					endtime:Date.parse(time+'-'+(i+2).toString()),
				})
				this.chartorder.push(ord.data.data.totalNumber)
				}
				// this.refresh();
				this.areafault()
			},
			areafault(){
				setTimeout(()=>{
					var areaChartCanvas = $('#areaChart').get(0).getContext('2d')
					// This will get the first returned node in the jQuery collection.
					var areaChart       = new Chart(areaChartCanvas)
					var datasets =[]
					if (this.fault) {datasets.push(
						{
						label               : 'Electronics',
						fillColor           : 'rgba(210, 214, 222, 1)',
						strokeColor         : 'rgba(210, 214, 222, 1)',
						pointColor          : 'rgba(210, 214, 222, 1)',
						pointStrokeColor    : '#c1c7d1',
						pointHighlightFill  : '#fff',
						pointHighlightStroke: 'rgba(220,220,220,1)',
						data                : this.chartorder,
						}
					)}
					if (this.fix) {datasets.push(
						{
						label               : 'Digital Goods',
						fillColor           : 'rgba(60,141,188,0.9)',
						strokeColor         : 'rgba(60,141,188,0.8)',
						pointColor          : '#3b8bba',
						pointStrokeColor    : 'rgba(60,141,188,1)',
						pointHighlightFill  : '#fff',
						pointHighlightStroke: 'rgba(60,141,188,1)',
						data                : this.chartrepair,
						}
					)}
					var areaChartData = {
					labels  : ['1月', '2月', '3月', '4月', '5月', '6月'],
					datasets
					}
					// console.log(areaChartData)
					var areaChartOptions = {
					//Boolean - If we should show the scale at all
					showScale               : true,
					//Boolean - Whether grid lines are shown across the chart
					scaleShowGridLines      : true,
					//String - Colour of the grid lines
					scaleGridLineColor      : 'rgba(0,0,0,.05)',
					//Number - Width of the grid lines
					scaleGridLineWidth      : 1,
					//Boolean - Whether to show horizontal lines (except X axis)
					scaleShowHorizontalLines: true,
					//Boolean - Whether to show vertical lines (except Y axis)
					scaleShowVerticalLines  : true,
					//Boolean - Whether the line is curved between points
					bezierCurve             : true,
					//Number - Tension of the bezier curve between points
					bezierCurveTension      : 0.3,
					//Boolean - Whether to show a dot for each point
					pointDot                : true,
					//Number - Radius of each point dot in pixels
					pointDotRadius          : 4,
					//Number - Pixel width of point dot stroke
					pointDotStrokeWidth     : 1,
					//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
					pointHitDetectionRadius : 20,
					//Boolean - Whether to show a stroke for datasets
					datasetStroke           : true,
					//Number - Pixel width of dataset stroke
					datasetStrokeWidth      : 2,
					//Boolean - Whether to fill the dataset with a color
					datasetFill             : true,
					//String - A legend template
					legendTemplate          : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].lineColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
					//Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
					maintainAspectRatio     : false,
					//Boolean - whether to make the chart responsive to window resizing
					responsive              : true
					}
					//Create the line chart
					areaChart.Line(areaChartData, areaChartOptions)
					},200)
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
