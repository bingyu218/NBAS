<template>
	<div class="wrapper layout-content-main account" style="padding:0px;overflow-y: scroll;padding-left: 10px;" id="lay">
		<Row :gutter='20' style="padding-top: 20px;margin-left: 35px;">
			<Col span="6" style="color:#fff">
				<div style="height:320px;width:100%;text-align: center;font-family:'楷体'">
					<h2 style="font-size:30px;text-align: left;font-family:'楷体'">今天    {{time}}</h2>
					<div style="font-size:20px">
						<Col span="24" style="font-size:larger;text-align: left;">总设备数：{{alldevice}}</Col>
						<Col span="24" style="margin-top:30px">在线设备：{{onlinedevice}}</Col>
						<Col span="24">
							<div class="progress horizontal active" :style="'height:'+screenheight/42+'px'" style="background: #000080;">
								<div class="progress-bar" style="background: #7CEDFF;" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="'width:'+parseInt(100*onlinedevice/alldevice).toString()+'%'"></div>
							</div>
						</Col>
						<Col span="24" style="margin-top:30px">故障设备：{{faultdevice}}</Col>
						<Col span="24">
							<div class="progress horizontal active" :style="'height:'+screenheight/42+'px'" style="background: #000080;">
								<div class="progress-bar" style="background: #7CEDFF;" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" :style="'width:'+parseInt(100*faultdevice/alldevice).toString()+'%'"></div>
							</div>
						</Col>
					</div>
				</div>
				<div class="box10">
					<h1>厂家保留</h1>   
					<p style="font-size:16px">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus consectetur dolor a porttitor. Curabitur id sem sed ante fringilla pulvinar et id lectus. Nullam justo ipsum, hendrerit ut commodo nec, pellentesque nec erat. Pellentesque pharetra.
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus consectetur dolor a porttitor. Curabitur id sem sed ante fringilla pulvinar et id lectus. Nullam justo ipsum, hendrerit ut commodo nec, pellentesque nec erat. Pellentesque pharetra.
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus consectetur dolor a porttitor. Curabitur id sem sed ante fringilla pulvinar et id lectus. Nullam justo ipsum, hendrerit ut commodo nec, pellentesque nec erat. Pellentesque pharetra.
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus consectetur dolor a porttitor. Curabitur id sem sed ante fringilla pulvinar et id lectus. Nullam justo ipsum, hendrerit ut commodo nec, pellentesque nec erat. Pellentesque pharetra.
					</p>
					<br />
				</div>

			</Col>
			<Col span="15" style="color:#fff">
				<Col span="20">
					<div style="height:700px;width:100%;text-align: center;margin-left: -10%;margin-top: -80px;">
						<div id="chart1" style="width:120%;height:800px"></div>
					</div>
				</Col>
				<Col span="4">
					<table border='1' style="border-color: #fff;width:100%;text-align: center;">
						<tr style="width:100%;height:16px;font-size:12px"><td>省份名称</td><td>设备数</td></tr>
						<tr style="width:100%;height:16px;font-size:12px" v-for="item in locate"><td>{{item.name}}</td><td>{{item.value}}</td></tr>
					</table>
				</Col>
				<Col span="24" style="height:50px">
				<div class="box10" style="height:50px">
					<h1>最新工单</h1>
						<p>设备名称：HPC181-202</p>
						<p>故障类型：E16层站召唤通讯故障</p>
						<p>安装地址：半岛琴声2号楼一单元</p>
					<br />
				</div>
				</Col>

			</Col>
		</Row>
	</div>
</template>
<script>
	import draggable from 'vuedraggable'
	import Map from '@/views/Dashboard/Map'
	import test1 from '@/views/Dashboard/Order'
	import faultfreq from '@/views/Dashboard/faultfreq'
	import activedoor from '@/views/Dashboard/activedoor'
	import compare from '@/views/Dashboard/compare'
	import echarts from 'echarts'
	import {swiper,swiperSlide} from 'vue-awesome-swiper'
	import china from 'echarts/map/json/china.json'
	echarts.registerMap('china', china)
	export default {
		name: 'HelloWorld',
		components: {
			draggable,
			'Map': Map,
			'test1':test1,
			'faultfreq':faultfreq,
			'activedoor':activedoor,
			'compare':compare,
			swiper,swiperSlide,
		},
		data() {
			return {
				faultdevice: 0,
				size1: '#ffffff',
				size2: '#ffffff',
				size3: '#ffffff',
				size4: '#ffffff',
				fault:true,
				fix:true,
				map: true,
				chat: true,
				chart: true,
				chart2: false,
				chart3: true,
				chart4: true,
				email: true,
				progress: true,
				mapbody: true,
				chatbody: true,
				chartbody: true,
				chartbody2: true,
				chartbody3: true,
				chartbody4: true,
				emailbody: true,
				progressbody: true,
				shine:true,
				barword:'',
				todo:[],
				chatlist:[],
				swiperOption:{
					autoplay:true,
					delay:20000,
					notNextTick:true,
					direction:'horizontal',
					grabCursor:true,
					setWrapperSize:true,
					autoHerght:true,
					slidesPerView: 1,
					mousewheel:true,
					mousewheelControl:true,
					height:window.innerHeight,
					resistanceRatio:0,
					observeParents:true,
					observer:true,//修改swiper自己或子元素时，自动初始化swiper
					allowTouchMove: false,
					navigation: {
						prevEl: '.swiper-button-prev',
						nextEl: '.swiper-button-next',
					},
				},
				data:[],
				area:[],
				LastWeek:'',
				LastWeekend:'',
				NowWeek:'',
				NowWeekend:'',
				screenwidth:'',
				screenheight:'',
				setheight:['','','',''],
				options: {
					toId:'',
					fromId:window.localStorage.getItem('id'),
					title:'',
					content:'',
					info:'',
					type:0,
					// createTime:'123',
					isSettled:false,
				},
				chatoptions: {
					fromId:window.localStorage.getItem('username'),
					title:'1',
					content:'',
					info:'1',
					type:0,
					follow: -1,
				},
				chartrepair:[],
				chartorder:[],
				usernum: 0,
				emailnum: 0,
				today: 0,
				allevents: 0,
				alldevice: 0,
				onlinedevice:0,
				chatpage:0,
				progresspage:0,
				prostate:'6',
				time:'',
				maxpro:'',
				locate:[               
				  {name: '北京',value: 0 },
				  {name: '天津',value: 0 },
				  {name: '上海',value: 0 },
				  {name: '重庆',value: 0 },
				  {name: '河北',value: 0 },
				  {name: '河南',value: 0 },
				  {name: '云南',value: 0 },
				  {name: '辽宁',value: 0 },
				  {name: '黑龙江',value: 0 },
				  {name: '湖南',value: 0 },
				  {name: '安徽',value: 0 },
				  {name: '山东',value: 0 },
				  {name: '新疆',value: 0 },
				  {name: '江苏',value: 0 },
				  {name: '浙江',value: 0 },
				  {name: '江西',value: 0 },
				  {name: '湖北',value: 0 },
				  {name: '广西',value: 0 },
				  {name: '甘肃',value: 0 },
				  {name: '山西',value: 0 },
				  {name: '内蒙古',value: 0 },
				  {name: '陕西',value: 0 },
				  {name: '吉林',value: 0 },
				  {name: '福建',value: 0 },
				  {name: '贵州',value: 0 },
				  {name: '广东',value: 0 },
				  {name: '青海',value: 0 },
				  {name: '西藏',value: 0 },
				  {name: '四川',value: 0 },
				  {name: '宁夏',value: 0 },
				  {name: '海南',value: 0 },
				  {name: '台湾',value: 0 },
				  {name: '香港',value: 0 },
				  {name: '澳门',value: 0 }
			],
			}
		},
		mounted(){
			this.showtime();
			this.getinfo()
			this.getlocation()
			
		},
		created(){
			this.screenwidth = document.documentElement.clientWidth-200;
			this.screenheight = document.documentElement.clientHeight;
			this.setheight[0]=this.screenheight/9.75 -3
			this.setheight[1]=this.setheight[0]/2.4
			var _this=this
			$(window).resize(function(){
			});

		},
		methods: {
			showtime(){
				setTimeout(()=>{
					this.time=this.$format(new Date(),'YYYY-MM-DD HH:mm:ss')
					this.showtime()
				}, 1000)
			},
			async getinfo(){
				var res
				var ech
				this.faultdevice=0
				this.usernum=0
				this.emailnum=0
				res = await this.$api.fault({num:1,page:1,device_type:'',type:'1',state:'untreated',islast:1})
				if (0 === res.data.code) {
					this.faultdevice =this.faultdevice + res.data.data.totalNumber
				}
				res = await this.$api.getRepair({
					search_info: '',page: 1,num: 4,isreg: "True",state:'treated',order_type:'',result:'',device_id:'',
					finish_starttime:Date.parse(this.$format(new Date(), 'YYYY-MM-DD')),
				})
				if (res.data.code == 0){
				this.today = res.data.data.totalNumber
				}
				res = await this.$api.devices({page: 1,num: 10,isreg: ''})
				if (res.data.code == 0){
				this.alldevice =res.data.data.totalNumber
				}
				res = await this.$api.devices({page: 1,num: 10,isreg: '',state:'online'})
				if (res.data.code == 0){
				this.onlinedevice =res.data.data.totalNumber
				}
			},
			async getlocation(){
				let res=await this.$api.locate({})
				if (res.data.code == 0){
					this.maxpro=res.data.list[0].counter
					for (var i=0;i<res.data.list.length;i++){
						for (var j=0;j<this.locate.length;j++){
							if (this.locate[j].name==res.data.list[i].region) {
								this.locate[j].value=res.data.list[i].counter
								}
						}
					}
					console.log(this.locate)
				}
				this.Chart1()
			},
			Chart1() {
			let activedoor =this.$echarts.init(document.getElementById('chart1'))
			activedoor.resize()
			function randomData() {  
                return Math.round(Math.random()*500);  
            } 
							activedoor.setOption({
								tooltip: {},
                 legend: {
                            orient: 'vertical',
                            left: 'left',
                            data:['']
                        },      
                 visualMap: {
                            min: 0,
                            max: this.maxpro,
                            left: '11%',
                            top: '63%',
                            // text: ['高','低'],
                            calculable : true,
							color:['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1'],
							// color:['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
						},
                 selectedMode: 'single',
                 series : [                         
                            {
                              name: '', 
                              type: 'map',
                              mapType: 'china',
							  radius : '55%',
							  center: ['0%', '0%'],
                              itemStyle: {
                                    normal:{
                                        borderColor: 'rgba(0, 0, 0, 0.2)'
                                    },
                                    emphasis:{
                                        shadowOffsetX: 0,
                                        shadowOffsetY: 0,
                                        shadowBlur: 20,
                                        borderWidth: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                },
                                showLegendSymbol: false,
                                label: {
                                    normal: {
                                        show: false
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
								data:this.locate
//                                 data:[               
//                                      {name: '北京',value: randomData() },
//                                       {name: '天津',value: randomData() },
//                                       {name: '上海',value: randomData() },
//                                       {name: '重庆',value: randomData() },
//                                       {name: '河北',value: randomData() },
//                                       {name: '河南',value: randomData() },
//                                       {name: '云南',value: randomData() },
//                                       {name: '辽宁',value: randomData() },
//                                       {name: '黑龙江',value: randomData() },
//                                       {name: '湖南',value: randomData() },
//                                       {name: '安徽',value: randomData() },
//                                       {name: '山东',value: randomData() },
//                                       {name: '新疆',value: randomData() },
//                                       {name: '江苏',value: randomData() },
//                                       {name: '浙江',value: randomData() },
//                                       {name: '江西',value: randomData() },
//                                       {name: '湖北',value: randomData() },
//                                       {name: '广西',value: randomData() },
//                                       {name: '甘肃',value: randomData() },
//                                       {name: '山西',value: randomData() },
//                                       {name: '内蒙古',value: randomData() },
//                                       {name: '陕西',value: randomData() },
//                                       {name: '吉林',value: randomData() },
//                                       {name: '福建',value: randomData() },
//                                       {name: '贵州',value: randomData() },
//                                       {name: '广东',value: randomData() },
//                                       {name: '青海',value: randomData() },
//                                       {name: '西藏',value: randomData() },
//                                       {name: '四川',value: randomData() },
//                                       {name: '宁夏',value: randomData() },
//                                       {name: '海南',value: randomData() },
//                                       {name: '台湾',value: randomData() },
//                                       {name: '香港',value: randomData() },
//                                       {name: '澳门',value: randomData() }
//                                 ]
                            }
                        ]
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
		}
	}
	
</script>
<style lang="scss" scoped>
	.wrapper{
		background-color: #5A6268;
	}
	.slide-fade-enter-active {
		transition: all .3s ease;
	}

	/*这里使用了贝塞尔曲线*/
	.slide-fade-leave-active {
		transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}

	/*slide-fade-leave-to 用于低于 2.1.8 版本的 Vue*/
	/*translateX 转化为 x 轴的值*/
	.slide-fade-enter, .slide-fade-leave-to {
		transition: translateX(10px);
		opacity: 0;
	}
	.bounce-enter-active {
	  animation: bounce-in .5s;
	}
	.bounce-leave-active {
	  animation: bounce-in .5s reverse;
	}
	@keyframes bounce-in {
	  0% {
		transform: scale(0);
	  }
	  50% {
		transform: scale(1.5);
	  }
	  100% {
		transform: scale(1);
	  }
	}
	.account {
		position: absolute;
		display: flex;
		flex-flow: column nowrap;
// 		align-items: center;
// 		justify-content: center;
		width: 110%;
		height: 110%;
		background: url('../../assets/bg4.jpg') center center no-repeat;
		// background:#ff0000;
		background-size: 100% auto;
	}
	body {
    font-size: 11px;
    font-family: 'Open Sans', sans-serif;
    color: #4A4A4A ;
    text-align: center; 
	}

	.box10{
		margin: 20px auto;
		width: 100%;
		min-height: 170px;
		padding: 10px;
		position:relative;
		background: -webkit-gradient(linear, 100% 0%, 0% 100%, from(#2c6282), to(#aaaaff), color-stop(.1,#2c6282));
		border: 1px solid #ccc;
		-webkit-box-shadow: 1px 1px 4px rgba(0,0,0, 0.1);
		-webkit-border-bottom-right-radius: 60px 5px;
		
	}
	.box10:before{
		content: '';
		width: 98%;
		z-index:-1;
		height: 100%;
		padding: 0 0 1px 0;
		position: absolute;
		bottom:0; right:0;
		background: -webkit-gradient(linear, 0% 20%, 0% 92%, from(#fff), to(#f9f9f9), color-stop(.1,#fff));
		border: 1px solid #ccc;
		-webkit-box-shadow: 1px 1px 8px rgba(0,0,0, 0.1);
		-webkit-border-bottom-right-radius: 60px 5px;
		-webkit-transform: skew(2deg,2deg)
							translate(3px,8px)
	}
	.box10:after{
		content: '';
		width: 98%;
		z-index:-1;
		height: 98%;
		padding: 0 0 1px 0;
		position: absolute;
		bottom:0; right:0;
		background: -webkit-gradient(linear, 0% 20%, 0% 100%, from(#f3f3f3), to(#f6f6f6), color-stop(.1,#fff));
		border: 1px solid #ccc;
		-webkit-box-shadow: 0px 0px 8px rgba(0,0,0, 0.1);
		-webkit-transform: skew(2deg,2deg)
							translate(-1px,2px)
	}

	.box10 img {
		width: 100%;
		margin-top: 15px;
	}

	p{ 
		margin-top: 15px;
		text-align: justify;
	}

	h1{
		font-size: 20px;
		font-weight: bold;
		margin-top: 5px; 
		text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
	}

	a{
		text-decoration: none;
		color: #4A4A4A !important;
	}

	a:hover{
		text-decoration: underline;
		color: #6B6B6B !important ;
	}
</style>