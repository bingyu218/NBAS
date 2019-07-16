<template lang="jade">
	div(class="layout-content-main" style="padding:0;overflow-y: scroll;")
		div(style="text-align:center;font-weight:'';font-size:25px" )|{{$route.params.device_name}}{{$t('Menu')}}
		div(style="margin: 0 auto;width: 800px" v-for="showlist in menuB" v-if="$route.params.device_model == '1' ")
			Card(style="margin-top:10px; width:100%; font-size:20px; color:#878787;height:40px;cursor: pointer;border-radius:0;" v-bind:padding='5' @click.native="showlist.show=!showlist.show")
				Col(span='23')|{{showlist.title}}
				Col(span='1' style="font-size:15px")
					i(class="fa fa-angle-down fa-2x" v-if='!showlist.show')
					i(class="fa fa-angle-up fa-2x" v-if='showlist.show')
			Card(style="width:100%; font-size:15px;height:30px;border-radius:0;" v-bind:padding='5' v-for="item in showlist.list" key="item" v-if="showlist.show")
				Col(span='10')|{{item.label}}
				Col(span='14' style="text-align:right;color:#878787;")|{{item.value}}
		div(style="margin: 0 auto;width: 800px" v-for="showlist in menuT" v-if="$route.params.device_model == '2' ")
			Card(style="margin-top:10px; width:100%; font-size:20px; color:#878787;height:40px;cursor: pointer;border-radius:0;" v-bind:padding='5' @click.native="showlist.show=!showlist.show")
				Col(span='23')|{{showlist.title}}
				Col(span='1' style="font-size:15px")
					i(class="fa fa-angle-down fa-2x" v-if='!showlist.show')
					i(class="fa fa-angle-up fa-2x" v-if='showlist.show')
			Card(style="width:100%; font-size:15px;height:30px;border-radius:0;" v-bind:padding='5' v-for="item in showlist.list" key="item" v-if="showlist.show")
				Col(span='10')|{{item.label}}
				Col(span='14' style="text-align:right;color:#878787;")|{{item.value}}
</template>

<script>
	export default{
		data(){
			return{
				menuB:[{
				show:false,
				title:'P'+this.$t('Menu'),
				list:[
				{label:this.$t('Operation enable setting'),value:''},
				{label:this.$t('Low speed torque lifting'),value:''},
				{label:this.$t('High speed torque lifting'),value:''},
				{label:this.$t('Opening arrival keeping torque'),value:''},
				{label:this.$t('Close arrival keeping torque'),value:''},
				{label:this.$t('Opening loop torque maximum voltage'),value:''},
				{label:this.$t('Closing loop torque maximum voltage'),value:''},
				{label:this.$t('Closing speed-down loop torque maximum voltage'),value:''},
				{label:this.$t('DC brake voltage'),value:''},
				{label:this.$t('Maximum Torque'),value:''},
				{label:this.$t('Overload protection current'),value:''},
				{label:this.$t('Closing overload current speed up &donw'),value:''},
				{label:this.$t('Closing Overload Current during Stable Operation'),value:''},
				{label:this.$t('Current zero value'),value:''},
				{label:this.$t('Closing overload anti-open enable setting'),value:''},
				{label:this.$t('Opening arrival relay Polar setting'),value:''},
				{label:this.$t('Closing arrival relay Polar setting'),value:''},
				{label:this.$t('Multi-function reply Y polar setting'),value:''},
				{label:this.$t('Opening arrival input switch polar setting'),value:''},
				{label:this.$t('Closing arrival input switch polar setting'),value:''},
				{label:this.$t('Opening speed down input switch polar setting'),value:''},
				{label:this.$t('Closing speed down input switch polar setting'),value:''},
				{label:this.$t('Relay Y function setting'),value:''},
				{label:this.$t('Door operator testing slef-running'),value:''},
				{label:this.$t('Retined'),value:''},
				{label:this.$t('Motor no-load current'),value:''},
				{label:this.$t('Data initialization'),value:''},
				{label:this.$t('Closing terminal torque lifting'),value:''},
				{label:this.$t('Control mode mark'),value:''},
				{label:this.$t('Closing deceleration Position'),value:''},
				{label:this.$t('Opening deceleration Position'),value:''},
				{label:this.$t('Door Width Distance'),value:''},
				{label:this.$t('Retined'),value:''},
				{label:this.$t('Retined'),value:''},
				{label:this.$t('Retined'),value:''},
				{label:this.$t('Retined'),value:''},
				{label:this.$t('Retined'),value:''},
				{label:this.$t('Retined'),value:''},
				{label:this.$t('Retined'),value:''},
				{label:this.$t('Retined'),value:''}]
				},{
				show:false,
				title:'D'+this.$t('Menu'),
				list:[
				{label:this.$t('Closing Start-up Speed'),value:''},
				{label:this.$t('Closing High Speed'),value:''},
				{label:this.$t('Closing Low Speed 1'),value:''},
				{label:this.$t('Closing Low Speed 2'),value:''},
				{label:this.$t('Opening Start Speed'),value:''},
				{label:this.$t('Opening High Speed'),value:''},
				{label:this.$t('Opening Low Speed 1'),value:''},
				{label:this.$t('Opening Low Speed 2'),value:''},
				{label:this.$t('Closing arrival keeping speed'),value:''},
				{label:this.$t('Opening arrival keeping speed'),value:''},
				{label:this.$t('Maximum Output Frequency'),value:''},
				{label:this.$t('Reference Frequency'),value:''},
				{label:this.$t('Closing accelerate time'),value:''},
				{label:this.$t('Closing decelerate time'),value:''},
				{label:this.$t('Opening accelerate time'),value:''},
				{label:this.$t('Opening decelerate time'),value:''},
				{label:this.$t('Start S Curve'),value:''},
				{label:this.$t('S Curve on Arrival'),value:''},
				{label:this.$t('Stop protect time when full opening'),value:''},
				{label:this.$t('Closing low speed 2 switching time'),value:''},
				{label:this.$t('DC brake remain time'),value:''},
				{label:this.$t('Overcurrent check time when closing'),value:''},
				{label:this.$t('Overcurrent check time point when closing'),value:''},
				{label:this.$t('Overcurrent check time when opening and closing'),value:''},
				{label:this.$t('Closing Over-current Relay Action Time'),value:''},
				{label:this.$t('Full closing relay output delay'),value:''},
				{label:this.$t('Deceleration Time during Door Operator Emergency Stop'),value:''},
				{label:this.$t('Door reverse delay time'),value:''},
				{label:this.$t('Opetation replace time'),value:''},
				{label:this.$t('Running test total opening and closing time'),value:''},
				{label:this.$t('Detection of Current Filtration Time'),value:''},
				{label:this.$t('Filtration Time at Given Speed'),value:''},
				{label:this.$t('Opening start acceleration time'),value:''},
				{label:this.$t('Closing start acceleration time'),value:''},
				{label:this.$t('Opening accelerate 1 period accelerate time'),value:''},
				{label:this.$t('Closing accelerate 1 period accelerate time'),value:''},
				{label:this.$t('Opening accelerate 1 period speed'),value:''},
				{label:this.$t('Closing accelerate 1 period speed'),value:''},
				{label:this.$t('Closing overtime reverse opening delay'),value:''},
				{label:this.$t('Retined'),value:''}],
				}],
				menuT:[
				  {
					show:false,
				    title: 'F07',
				    list: [
				    {label: this.$t('Closing Start-up Speed'),value: ''},
					  {label: this.$t('Closing High Speed'),value: ''},
					  {label: this.$t('Allowed Tolerance Frequency at Stable Speed'),value: ''},
					  {label: this.$t('Synchronous Door Coupler Opening Speed'),value: ''},
					  {label: this.$t('Closing Low Speed 1'),value: ''},
					  {label: this.$t('Closing Low Speed 2'),value: ''},
					  {label: this.$t('Opening Start Speed'),value: ''},
					  {label: this.$t('Opening High Speed'),value: ''},
					  {label: this.$t('Opening Low Speed 1'),value: ''},
					  {label: this.$t('Opening Low Speed 2'),value: ''},
					  {label: this.$t('Self-learning and Power-up Speed'),value: ''}, 
					  {label: this.$t('Opening Limit Position Torque Coefficient'),value: ''}, 
					  {label: this.$t('Closing Low Speed Torque Coefficient'),value: ''}, 
					  {label: this.$t('Run Speed for Start at Low Speed Area'),value: ''}, 
					  {label: this.$t('Run Speed during '),value: ''}, 
					  {label: this.$t('Allowed Tolerance frequency during Acceleration and Deceleration'),value: ''}, 
					  {label: this.$t('Maximum Output Frequency'),value: ''}, 
					  {label: this.$t('Reference Frequency'),value: ''}
				    ]
				  },
				  {
				    title: 'F08',
					show: false,
				    list: [
				      {
				        label: this.$t('Acceleration Time'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Deceleration Time'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Start S Curve'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('S Curve on Arrival'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Opening Stop Protection Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Closing Stop Protection Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Motor Cut-off Time during IPM Failure'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Allowed Minutely Fault Count'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Deceleration Time during Door Operator Emergency Stop'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Door Reverse Motion Delay Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Braking Torque Holding Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Detection of Current Filtration Time'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Total Time of Opening and Closing during Test Run'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Closing Over-current Allowed Time'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Opening/Closing Over-current Allowed Time'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Closing Over-current Relay Action Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Going-out Delay Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('losing In Place Output Delay Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Allowed Opening/Closing Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Over-current Motor Cut-off Time'),
				        value: '',
				        
				        num: 10
				      }, {
				        label: this.$t('Filtration Time at Given Speed'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Filtration Time at Test Speed'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Output Filtration Time'),
				        value: '',
				        
				        num: 1
				      },
				    ]
				  }, {
					show:false,
				    title: 'F09',
				    list: [
				      {
				        label: this.$t('Opening Deceleration Distance'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Deceleration Distance'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Opening Limit Position'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Limit Position'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Run Distance at Unlocking Speed'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Run Distance at Closing Start Speed'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Safety Touch Pad Limit Distance'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Door Width Distance'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Opening Low Speed Area Distance'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Low Speed Area Distance'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Acceleration Distance for Synchronous Door Coupler Opening'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Deceleration Distance for Synchronous Door Operator Opening'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Deceleration Distance for Opening Start at Low Speed Area'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Deceleration Distance for Closing Start-up at Low Speed Area'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Over-current Detection Distance'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Opening Limit Protection Position'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Limit Protection Position'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Deceleration Position for Opening Low Speed 1'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Deceleration Position for Closing Low Speed 1'),
				        value: '',
				        
				        num: 1
				      },
				    ]
				  }, {
					show:false,
				    title: 'F10',
				    list: [
				      {
				        label: this.$t('Low Speed Torque'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('High Speed Torque'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Opening Hold Torque'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Closing Hold Torque'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Voltage during Synchronous Motor Start-up Running'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Maximum Voltage of Torque Ring'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Maximum Voltage of Excitation Ring'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Closing Overload Current during Stable Operation'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Opening/Closing Overload Protection Current'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Closing Overload Current during Acceleration and Deceleration'),
				        value: '',
				        
				        num: 100
				      },
				    ]
				  }, {
					show:false,
				    title: 'F11',
				    list: [
				      {
				        label: this.$t('Maximum Torque'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Decrease of Over-current'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Closing Holding Torque 1'),
				        value: '',
				        
				        num: 100
				      }, {
				        label: this.$t('Current Sensor U-phase Zero Current Offset'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Current Sensor V-phase Zero Current Offset'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Current Proportion of Current Sensor'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Speed Ring P Parameter'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Speed Ring I Parameter'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Excitation Current Ring P Parameter'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Excitation Current Ring I Parameter'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Torque Current Ring P Parameter'),
				        value: '',
				        
				        num: 1
				      },{
				        label: this.$t('Torque Current Ring I Parameter'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing High Speed Torque Limit Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Menu adjustment demonstration'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Synchronous Motor Magnetic Pole Position'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Encoder Pulse Per Revolution'),
				        value: '',
				        
				        num: 1
				      },
				    ]
				  }, {
					show:false,
				    title: 'F12',
				    list: [
				      {
				        label: this.$t('Synchronous Door Selection Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Motor UVW wiring direction setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Door Operator Test Run Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Door Width Self-determination Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Data Initialization'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Determination of Magnetic Pole Position'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Data Write-protected Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Selection of Opening Brake/Long-term Brake'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Selection of Closing Brake/Long-term Brake'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Encoder Direction Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Overload Reverse Opening Motion Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Control Mode Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Fireman Function Selection'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Opening Limit Output Relay Polarity Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Limit Output Relay Polarity Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Retined'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Retined'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Opening Limit Switch Polarity Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Limit Switch Polarity Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Motor Tempreture Switch Polarity setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Light Curtain Polarity Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Motor Pole Number Setting'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Retined'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Retined'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Opening Input Signal Terminal Selection'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Input Signal Terminal Selection'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Opening Limit Input Signal Terminal Selection'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Limit Input Signal Terminal Selection'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Retined'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Retined'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Fire-fighting Input Signal Terminal Selection'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Setting for front and rear door'),
				        value: '',
				        
				        num: 1
				      }, {
				        label: this.$t('Closing Auto Detection Stop Position Setting'),
				        value: '',
				        
				        num: 1
				      }
				    ]
				  }
				]
			}
		},
		computed: {
		},
		created(){
			this.getData();
		},

		methods:{
			async getData(){
				var buffer
				let res =await this.$api.runtime({page:1,num:20,device_id:this.$route.params.id})
				if (res.data.code == 0) {
					res.data.data.list.forEach(item=>{
						if (item.data != null) {buffer = base64url.toBuffer(item.data)}
						if (item.type == 4099){
							for (var i=0;i<18;i++) {
								this.menuT[0].list[i].value=((256*(buffer[2*i])+buffer[2*i+1])/100).toFixed(2)
								this.menuB[0].list[i].value=(256*(buffer[2*i])+buffer[2*i+1])
							}
							for (var i=10;i<13;i++) {
								this.menuB[0].list[i].value=(this.menuB[0].list[i].value/100).toFixed(2)
								}
						}
						if (item.type == 4100){
							for (var i=0;i<22;i++) {
								this.menuT[1].list[i].value=((256*(buffer[2*i])+buffer[2*i+1])/this.menuT[1].list[i].num).toFixed(this.menuT[1].list[i].num.length-1)
								this.menuB[0].list[i+18].value=(256*(buffer[2*i])+buffer[2*i+1])
							}
								this.menuT[1].list[22].value=(256*(buffer[2*i])+buffer[2*i+1])
						}
						if (item.type == 4101){
							for (var i=0;i<19;i++) {
								this.menuT[2].list[i].value=((256*(buffer[2*i])+buffer[2*i+1])/this.menuT[2].list[i].num).toFixed(this.menuT[2].list[i].num.length-1)
								if ((i != 16)||(i != 17)) {this.menuB[1].list[i].value=((256*(buffer[2*i])+buffer[2*i+1])/10).toFixed(1)}
								else {this.menuB[1].list[i].value=(256*(buffer[2*i])+buffer[2*i+1])}
							}
						}
						if (item.type == 4102){
							for (var i=0;i<10;i++) {
								this.menuT[3].list[i].value=((256*(buffer[2*i])+buffer[2*i+1])/this.menuT[3].list[i].num).toFixed(this.menuT[3].list[i].num.length-1)
								this.menuB[1].list[i+19].value=(256*(buffer[2*i])+buffer[2*i+1])
							}
							for (var i=0;i<8;i++){
								this.menuB[1].list[i+19].value=(this.menuB[1].list[i+19].value/10).toFixed(1)
							}
							this.menuB[1].list[21].value=(this.menuB[1].list[21].value/10).toFixed(1)
							this.menuB[1].list[23].value=(this.menuB[1].list[23].value/10).toFixed(1)
							this.menuB[1].list[26].value=(this.menuB[1].list[26].value/10).toFixed(1)
						}
						if (item.type == 4103){
							for (var i=0;i<16;i++) {
								this.menuT[4].list[i].value=((256*(buffer[2*i])+buffer[2*i+1])/this.menuT[4].list[i].num).toFixed(this.menuT[4].list[i].num.length-1)
							}
							for (var i=0;i<11;i++) {
								this.menuB[1].list[i+29].value=(256*(buffer[2*i])+buffer[2*i+1])
							}
							for (var i=3;i<9;i++){
								this.menuB[1].list[i+29].value=(this.menuB[1].list[i+29].value/10).toFixed(1)
							}
							this.menuB[1].list[29].value=(this.menuB[1].list[29].value/10).toFixed(1)
						}
						if (item.type == 4104){
							for (var i=0;i<33;i++) {
								this.menuT[5].list[i].value=buffer[i]
							}
						}
					})
				}
			}
		}
	}	
</script>

<style lang="scss" scoped>
	.inline{
		display: inline-block;
	}
	.username{
		font-size: 30px;
		color: #222;
		display: inline-block;
	}
	.role{
		font-size: 14px;
		color: #999;
		display: inline-block;
	}
	
</style>