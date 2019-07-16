<template lang="jade">
	div.layout-content-main
		div.form
			Row(:gutter=30)
				Col(span=8)
					Card.click( style="height:220px;")
						div(@click="person()")
							div(class="user-info")
								img(src="../../assets/admin.jpg",width="20%",style="border-radius:50%")
								div(class="user-info-cont")
									div(class="user-info-name")|{{this.username}}
									div()|{{role}}
							div(class="user-info-list")
							div(class="user-info-list")
					Row(:gutter=20)
						Col(span=24 style="margin-top: 15px")
							div(style="display: inline-block; font-size:16px; margin-left: 5px")|您关注了
							div(style="display: inline-block; font-size:20px; margin-left: 10px; color: rgb(45, 140, 240);")|{{followtotal}}
							div(style="display: inline-block; font-size:16px; margin-left: 10px")|台设备
				Col(span=16)
					Row(:gutter=20)
						Col(span=8)
							Card.click(:body-style="{padding: '0px'}")
								div(class="grid-content grid-con-1",@click="go('alList')")
									div(class="grid-cont-right")
										div()|设备总数
										Col(span=12)
											div(class="grid-num")|{{total.ctrl}}
											div()|控制柜
										Col(span=12)
											div(class="grid-num")|{{total.door}}
											div()|控制器
						Col(span=8)
							Card.click(:body-style="{padding: '0px'}")
								div(class="grid-content grid-con-2",@click="go('map')")
									div(class="grid-cont-right")
										div()|在线设备
										Col(span=12)
											div(class="grid-num")|{{total.ctrlOnline}}
											div()|控制柜
										Col(span=12)
											div(class="grid-num")|{{total.doorOnline}}
											div()|控制器
						Col(span=8)
							Card.click(:body-style="{padding: '0px'}")
								div(class="grid-content grid-con-3",@click="go('maintain')")
									div(class="grid-cont-right")
										div()|待处理设备
										Col(span=12)
											div(class="grid-num")|{{total.faultCtrl}}
											div()|控制柜
										Col(span=12)
											div(class="grid-num")|{{total.faultDoor}}
											div()|控制器
					Row(:gutter=20)
						Col(span=8)
							Card.click(:body-style="{padding: '0px'}")
								div(class="grid-content grid-con-1",@click="go('maintainList')")
									div(class="grid-cont-right")
										div(class="grid-num")|{{total.maintain}}
										div()|正在维修的设备
										
						Col(span=8)
							Card.click(:body-style="{padding: '0px'}")
								div(class="grid-content grid-con-2",@click="go('userManage')",disabled="userList.username!=admin")
									div(class="grid-cont-right")
										div(class="grid-num")|{{total.finish}}
										div()|完成工单
						Col(span=8)
							Card.click(:body-style="{padding: '0px'}")
								div(class="grid-content grid-con-3",@click="go('inform')")
									div(class="grid-cont-right")
										div(class="grid-num")|{{total.message}}
										div()|未读通知
			Row(:gutter=1 style="margin-top: 15px")
				Col(span=11)
					Card(v-bind:padding='4',style="font-size:16px; border-radius:0; height:40px;background-color:#f22;color:#fff;")
						Col(span=6 style="")
							div(style="font-size:20px")|关注设备
						Col(span=6 style="")
							div(style="font-size:20px")|设备类型
						Col(span=6 style="")
							div(style="font-size:20px")|版本号
						Col(span=6 style="")
							div(style="font-size:20px")|运行状态
					Scroll(:on-reach-bottom='followReachBottom', :distance-to-edge="0" , style="height: 360px; margin-top: 10px")
						Card(v-bind:padding='4',v-for='item in list',:key='item.id' align='left', style='border-radius:0;height: 40px; font-size: 16px; cursor: pointer;', @click.native='deviceinfo(item.IMEI)')
							Col(span=6 style="")
								div|{{item.device_name}}
							Col(span=6)
								div|{{item.device_type}}
							Col(span=6)
								div|{{item.device_firmware.replace(/\r\n/ig,"a")}}
							Col(span=6)
								div|{{item.state}}
				Col(span=12 style="margin-left:40px")
					Card(v-bind:padding='4',style="font-size:16px; border-radius:0; height:40px;background-color:#f22;color:#fff")
						Col(span=8 style="")
							div(style="font-size:20px")|标题
						Col(span=6 style="")
							div(style="font-size:20px")|发件人
						Col(span=7 style="")
							div(style="font-size:20px")|时间
					Scroll(:on-reach-bottom='messageReachBottom', :distance-to-edge="0" , style="height: 360px; margin-top: 10px")
						Card(v-bind:padding='4',v-for='item in inform',:key='item.id' align='left', style='border-radius:0;height: 40px; font-size: 16px; cursor: pointer;', @click.native='read(item.id)')
							Col(span=8 style="")
								div|{{item.title}}
							Col(span=6)
								div|管理员
							Col(span=8)
								div|{{formatDate(item.createTime,'yyyy-MM-dd HH:mm:ss')}}
</template>

<script>
	import {
		formatDate
	} from '../../utils.js'
	export default{	
		data(){
			return{
				followtotal:'',
				table:'all',
				userList:[],
				username:window.localStorage.getItem('username'),
				list:[],
				inform:[],
				query:{
					username:window.localStorage.getItem('username'),
					name:'',
				},
				ladList:[],
				total:{
					door:0,
					ctrl:0,
					maintain:0,
					faultDoor:0,
					faultCtrl:0,
					message:0,
					finish:0,
					online:0,
					doorOnline:0,
					ctrlOnline:0,
				},
				options:{
					page: 1,
					num: 100,
					total: 0,
				}
			}
		},
		computed: {
			role() {
				return this.username === 'admin' ? '超级管理员' : '普通用户';
			}
		},
		created(){
			this.getData();
			this.getmessage();
			this.gettotal();
		},
		methods:{
			async followReachBottom () {
				if ( this.list.length<this.followtotal){
					let eve= await this.$api.devices({num:10,page:(Math.ceil(this.list.length/10)+1),follow:'yes'})
						if (eve.data.code == 0) {
							for (var i=0;i<eve.data.data.list.length;i++){
								if(eve.data.data.list[i].state == "online"){
									eve.data.data.list[i].state = "在线"
								}else if(eve.data.data.list[i].state == "offline"){
									eve.data.data.list[i].state = "离线"
								}else if(eve.data.data.list[i].state == "longoffline"){
									eve.data.data.list[i].state = "长期离线"
								}
								if(eve.data.data.list[i].device_type == "240"){
									eve.data.data.list[i].device_type = "控制柜"
								}else if(eve.data.data.list[i].device_type == "15"){
									eve.data.data.list[i].device_type = "控制器"
								}
								if (eve.data.data.list[i].device_firmware !=null) {
									if(eve.data.data.list[i].device_firmware.length>=6){
										eve.data.data.list[i].device_firmware=eve.data.data.list[i].device_firmware.substring(0,6)
									}
								}
								eve.data.data.list[i].deleteid=eve.data.data.list[i].id
								this.list.push(eve.data.data.list[i])
							}
						}
				}
				else {
					this.$Notice.warning({
						title: '提示',
						desc: '已经到底了！',
					})
				}
				return new Promise(resolve => {			
					resolve();
				});
			},
			async messageReachBottom () {
				if ( this.inform.length<this.total.message){
					let eve= await this.$api.message({num:10,page:(Math.ceil(this.inform.length/10)+1),done:true})
					for (var i=0;i<10;i++){
						this.inform.push(eve.data.data.list[i])
					}
				}
				else {
					this.$Notice.warning({
						title: '提示',
						desc: '已经到底了！',
					})
				}
				return new Promise(resolve => {			
					resolve();
				});
			},
			read(val){
				this.$router.push({
					name: 'readInform',
					params: {
						id: val
					}
				})
			},
			async getmessage(){
			// if (this.table=="message"){
				let mes = await this.$api.message({num:10,page:1,done:false})
				this.total.message = mes.data.data.totalNumber
				this.inform=mes.data.data.list
			// }
				setTimeout(()=>{
					if (this.$route.meta.name == '主页'){this.getmessage()}
				}, 60000)
			},
			async gettotal(){
				var res
				res = await this.$api.devicecount()
				if (0 === res.data.code) {
					this.total.ctrl=parseInt(res.data.data.ctrllongoffline)
							+parseInt(res.data.data.ctrloffline)
							+parseInt(res.data.data.ctrlonline)
					this.total.door=parseInt(res.data.data.doorlongoffline)
							+parseInt(res.data.data.dooroffline)
							+parseInt(res.data.data.dooronline)
					this.total.ctrlOnline=parseInt(res.data.data.ctrlonline)
					this.total.doorOnline=parseInt(res.data.data.dooronline)
				}
				res = await this.$api.getRepair({num:1,page:1,isreg: "True",state:'untreated',type:''})
				if (0 === res.data.code) {
					this.total.maintain = res.data.data.totalNumber
				}
				res = await this.$api.fault({num:1,page:1,device_type:'door',type:'1',state:'untreated',islast:1})
				if (0 === res.data.code) {
					this.total.faultDoor = res.data.data.totalNumber
				}
				res = await this.$api.fault({num:1,page:1,device_type:'ctrl',type:'1',state:'untreated',islast:1})
				if (0 === res.data.code) {
					this.total.faultCtrl = res.data.data.totalNumber
				}
				res = await this.$api.getRepair({num:1,page:1,isreg: "True",state:'treated',type:''})
				if (0 === res.data.code) {
					this.total.finish = res.data.data.totalNumber
				}
				res = await this.$api.message({num:1,page:1,done:'false'})
				if (0 === res.data.code) {
					this.total.message = res.data.data.totalNumber
				}
				setTimeout(()=>{
					if (this.$route.meta.name == '主页'){this.gettotal()}
				}, 60000)
			},
			deviceinfo(val){
				this.$router.push({						
					name: 'elevatorFiles',
					params: {
						IMEI: val										
					}
				})
			},
			async getData(){
				this.list=[]
				let fol = await this.$api.follow({num:1,page:1})
				if (fol.data.code == 0) {this.followtotal=fol.data.data.totalNumber}
				let lis = await this.$api.devices({num:10,page:1,follow:'yes'})
				if (0 === lis.data.code){
					for (var i=0;i<lis.data.data.list.length;i++){
						if(lis.data.data.list[i].state == "online"){
							lis.data.data.list[i].state = "在线"
						}else if(lis.data.data.list[i].state == "offline"){
							lis.data.data.list[i].state = "离线"
						}else if(lis.data.data.list[i].state == "longoffline"){
							lis.data.data.list[i].state = "长期离线"
						}
						if(lis.data.data.list[i].device_type == "240"){
							lis.data.data.list[i].device_type = "控制柜"
						}else if(lis.data.data.list[i].device_type == "15"){
							lis.data.data.list[i].device_type = "控制器"
						}
						if (lis.data.data.list[i].device_firmware !=null) {
							if(lis.data.data.list[i].device_firmware.length>=6){
								lis.data.data.list[i].device_firmware=lis.data.data.list[i].device_firmware.substring(0,6)
							}
						}
						lis.data.data.list[i].deleteid=lis.data.data.list[i].id
						this.list.push(lis.data.data.list[i])																
					}	
				}
				setTimeout(()=>{
					if (this.$route.meta.name == '主页'){this.getData()}
				}, 60000)
			},
			go(name){
				console.log(name);
				this.$router.push({
					name: name,
				})
			},
			user(){
				if (this.userList.username=='admin'){
					this.$router.push({
						name: 'userManage',
					})
				}
			},
			formatDate(val, format) {
				return formatDate(val, format)
			},
			person(){
				if(this.username != 'admin'){
					this.$router.push({
						name: 'person'
					})
				}
			},
		}
	}	
</script>

<style lang="scss" scoped>
	.box-header{
		font-size: 20px;
	}
	.el-row {
		margin-bottom: 20px;
	}
	.grid-content {
		display: flex;
		align-items: center;
		height: 100px;
	}
	.grid-cont-right {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #999;
	}
	.grid-num {
		font-size: 30px;
		font-weight: bold;
	}
	.grid-con-icon {
		font-size: 50px;
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		color: #fff;
	}
	.click{
		cursor: pointer;
	}
	.grid-con-1 .grid-con-icon {
		background: rgb(45, 140, 240);
	}
	.grid-con-1 .grid-num {
		color: rgb(45, 140, 240);
	}
	.grid-con-2 .grid-con-icon {
		background: rgb(100, 213, 114);
	}
	.grid-con-2 .grid-num {
		color: rgb(145, 40, 240);
	}
	.grid-con-3 .grid-con-icon {
		background: rgb(242, 94, 67);
	}
	.grid-con-3 .grid-num {
		color: rgb(242, 94, 67);
	}
	.user-info {
		display: flex;
		align-items: center;
		padding-bottom: 20px;
		border-bottom: 2px solid #ccc;
		margin-bottom: 20px;
	}
	.user-avator {
		width: 120px;
		height: 120px;
		border-radius: 50%;
	}
	.user-info-cont {
		padding-left: 50px;
		flex: 1;
		font-size: 14px;
		color: #999;
	}
	.user-info-cont div:first-child {
		font-size: 30px;
		color: #222;
	}
	.user-info-list {
		font-size: 14px;
		color: #999;
		line-height: 25px;
	}
	.user-info-list span {
		margin-left: 70px;
	}
	.mgb20 {
		margin-bottom: 20px;
	}
	.todo-item {
		font-size: 14px;
	}
	.todo-item-del {
		text-decoration: line-through;
		color: #999;
	}
	.schart {
		width: 95%;
		height: 300px;
	}	
</style>