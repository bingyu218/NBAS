<template lang="jade">
div
	Row(:gutter=20)
		Col(span=22)
			Tabs.pd-heard(value="name1",:animated="false",@on-click="Onchange")
				TabPane(:label="$t('Map')",name="map")
				TabPane(:label="$t('List')",name="list")
		Col(span=2)
			span(id="1" class="fa fa-angle-up fa-3x" aria-hidden="true" ,@click="angleChange()" style="cursor: pointer;margin-top:-10px")
	div(v-if="div_show" id="serClick" style="margin-top:-30px")
		Form.imr(ref='form',:model="query",label-position="left",:label-width="100" @keydown.enter.native.prevent="search()")
			Row(:gutter=5)
				Col(span=2)
					Select.smr(v-model="show.device_type" style="width:100%", :placeholder="$t('type')" @on-change="search()")
						Option(key="1", :label="$t('all')" value='all')
						Option(key="2", :label="$t('door')" value="15")
						Option(key="3", :label="$t('ctrl')" value="240")
				Col(span=2)
					Select.smr(v-model="show.state" style="width:100%", :placeholder="$t('state')" @on-change="search()")
						Option(key="1", :label="$t('all')" value='all')
						Option(key="2", :label="$t('online')" value="online")
						Option(key="3", :label="$t('offline')" value="offline")
						Option(key="4", :label="$t('long offline')" value="longoffline")
				Col(span=4)
					AutoComplete(name="inpSer" v-model="query.search_info" ,:data="menu" ,@on-search="handleSearch1()", :placeholder="$t('keyword')" max=15 style="width:100%" class="handle-input mr10" id="serch1")
				Col(span=3)
					Input(v-model="query.install_addr" , :placeholder="$t('install address')" max=10)
				Col(span=3)
					Button.mr-10(type="primary",icon="ios-search",@click="search()" style="margin-left:1px" )|{{$t('search')}}
					Button(type="default" icon="md-add" @click="showtag=!showtag" shape="circle" v-if='!showtag')
					Button(type="default" icon="md-remove" @click="showtag=!showtag" shape="circle" v-if='showtag')
				Col(span=4 v-if='showtag')
					Col(span=4)
						span.mt(id="green" style="color:green" class="fa fa-tag fa-2x",@click="checkcolor(0)" )
					Col(span=4)
						span.mt(id="red" style="color:red" class="fa fa-tag fa-2x",@click="checkcolor(1)")
					Col(span=4)
						span.mt(id="yellow" style="color:yellow" class="fa fa-tag fa-2x",@click="checkcolor(2)")
					Col(span=4)
						span.mt(id="blue" style="color:blue" class="fa fa-tag fa-2x",@click="checkcolor(3)")
					Col(span=4)
						span.mt(id="gray" style="color:gray" class="fa fa-tag fa-2x",@click="checkcolor(4)")
					Col(span=4)
						span.mt(id="black" style="" class="fa fa-tag fa-2x",@click="checkcolor(5)")
	Row(:gutter="8")
		Col.map(span="20")
			div#map
		Col(span="4")
			div.dv(id='list')
				Poptip(word-wrap v-for="device in devices" ,:data="devices" trigger="hover" placement="left" v-bind:key="devices.id" )
					Card.text(v-on:click.native="cardClick(device.cell_lat,device.cell_lon)" style="cursor: pointer;")
						Row(:gutter="10")
							div(style="margin-top:-20px")
								div.ss()
									i.pd(class="fa fa-bookmark" ,:style="{color:cardcolor}" v-for="cardcolor in getlist(device.tagcolor)")
							Col(span="24" style="margin-top:5px")
								p.tt()|{{device.device_name}}
								Row(:gutter="10" style="margin-top:5px")
									Col(span="12")
										p.tt1()|{{device.device_type}}
									Col(span="12")
										p.tt1()|{{device.state}}
					div.api(slot="title" @click="goDevice(device)" style="width: 400px; cursor: pointer;")
						p()|{{$t('device IMEI')}} : {{device.IMEI}}
						p()|{{$t('device name')}} : {{device.device_name}}
					div.api(slot="content" @click="goDevice(device)" style="width: 400px; cursor: pointer;")
						p()|{{$t('device type')}} : {{device.device_type}}
						p()|{{$t('base station')}} : {{device.cell_address}}
						p()|{{$t('IP location')}} : {{device.ip_country+device.ip_region+device.ip_city}}
						p()|{{$t('install address')}} : {{device.install_addr}}
			Page(simple,:total="options.total",:page-size="options.num",:current="options.page",@on-change="pageChange" style="text-align:center;")
</template>


<script>
	import {
		api,
		ladderApi,
		formatDate
	} from '@/utils'
	import r from '@/assets/red.png';
	import g from '@/assets/green.png';
	import error from '@/assets/error.gif';
	import lost from '@/assets/lost.gif';
	import open from '@/assets/open.gif';
	const createMark = (img) => {
		return new BMap.Icon(img, new BMap.Size(25, 25), {
			anchor: new BMap.Size(10, 26),
			imageSize: new BMap.Size(25, 25),
		});
	};
	const redMark = createMark(r);
	const greenMark = createMark(g);
	const errorMark = createMark(error);
	const lostMark = createMark(lost);
	const openMark = createMark(`@/assets/open.gif?timestamp=${new Date().getTime()}`);

	var cenlat = 1;
	var cenlon = 1;
	var tagCor = '';
	const labelStyle = {
		color: 'black',
		fontSize: '12px',
		borderRadius: '4px',
		height: '16px',
		lineHeight: '12px',
		borderColor: 'black',
		fontFamily: ' 微软雅黑',
	};
	export default {
		data() {
			const type = {
// 				15: this.$t('door'),
// 				240: this.$t('ctrl'),
			};
			const netWork = {
				3: '联通3G',
				40: '移动4G',
				41: '联通4G',
			};
			return {
				showtag:false,
				color:[false,false,false,false,false,false],
				col:['green','red','yellow','blue','gray','black'],
				menu: [],
				query:{
					search_info: '',
					page: 1,
					num:10,
					device_type: '',
					state:'online',
					register: "registered",
					tagcolor: '',
					install_addr:'',
				},
				show:{
					device_type: 'all',
					state:'online',
				},
				option: {
					lon: this.$cookie.get('lng'),
					lat: this.$cookie.get('lat'),
					zoom: this.$cookie.get('zoom') || 9,
				},
				map: null,
				div_show: true,
				devices: [],
				tableData: [],
				select_type:'all',
				select_state:'login',
				openAnimateList: [],
				markerClusterer: null,
				markers: [],
				list:[],
				center:{
					lat: 0,
					lon: 0,
				},
				options: {
					name:'',
					page: 1,
					num: 10,
					total: 0,
					register: "registered",				
				}
			}
		},
		mounted() {			
			this.initMap()
			this.getList()
			document.getElementById('list').style.height = (Number(document.documentElement.clientHeight)/1-200) + 'px'
		},
		methods: {
			async handleSearch1 () {
				this.menu=[];
				var str;
				for (var i=0;i<this.devices.length;i++){
					str=this.devices[i].IMEI;
					if ((str != null)&&(this.query.search_info != null)){
						if (str.indexOf(this.query.search_info)>=0)
							this.menu.push(str)
					}
				}
				for (var i=0;i<this.devices.length;i++){
					str=this.devices[i].device_name;		  	    	
					if ((str != null)&&(this.query.search_info != null)){
						if (str.indexOf(this.query.search_info)>=0)
							this.menu.push(str)
					} 
				}
			},
			//绘图
			async initMap() {
				this.getList();
				await this.centpoint()
				let point = new BMap.Point(cenlon, cenlat);
				let map = new BMap.Map('map', {
					enableMapClick: false
				});
				map.centerAndZoom(point, 7);
				map.enableScrollWheelZoom();
				map.addControl(new BMap.NavigationControl({
					anchor: BMAP_ANCHOR_TOP_RIGHT,
					enableGeolocation: true, 
				}));
				map.addEventListener('tilesloaded', () => {
					this.eventHandler();
				});
				map.addControl(new BMap.ScaleControl({
					anchor: BMAP_ANCHOR_TOP_RIGHT
				}));
				map.addControl(new BMap.OverviewMapControl());
				this.map = map
				this.markerClusterer = new BMapLib.MarkerClusterer(this.map, {
					markers: this.markers
				});
				this.markerClusterer.setGridSize(90);
				this.markerClusterer.setMinClusterSize(1);
				this.markerClusterer.setMaxZoom(12)
			},
			eventHandler() {
				const center = this.map.getCenter();
				const zoom = this.map.getZoom();
				this.$cookie.set('lat', center.lat)
				this.$cookie.set('lng', center.lng)
				this.$cookie.set('zoom', zoom)
			},
			//获取数据
			async getList() {
				let res = await this.$api.devices(this.query)
				this.devices=res.data.data.list
				this.options.total = res.data.data.totalNumber		
				this.devices.forEach(item => {
					if(item.state == "online"){
						item.state = this.$t('online')
					}else if(item.state == "offline"){
						item.state = this.$t('offline')
					}else if(item.state == "longoffline"){
						item.state = this.$t('long offline')
					}
					if(item.device_type == "240"){
						item.device_type = this.$t('ctrl')
					}else if(item.device_type == "15"){
						item.device_type = this.$t('door')
					}
					if(item.cell_lat == null||item.cell_lon == null){
						// this.$api.deldevices({id:item.id}),
					}else{
						if(res.data.code == 0){
							const now = new Date().getTime();
							this.devices = res.data.data.list.map((item) => {
								if(!item.updateTime){
									item.isLoss = true;
									return item;
								}
								if(now - item.updateTime > 120000){
									item.isLoss = true;
								}else{
									item.isLoss = false;
								}
								if(item.deviceId.indexOf('test') !== -1){
									item.isLoss = false;
									item.Alert = '0';
								}
								return item;
							});
						}					
					}
				})
				await this.addMark()
				await this.centpoint()
			},
			async search() {
				if(this.query.search_info.length > 15){
					this.$Notice.error({
						title: this.$t('warning'),
						desc: this.$t('try keyword within 15 bytes'),
					})
				}else{
					if(this.show.device_type == 'all'){
						this.query.device_type = ''
					}else{
						this.query.device_type = this.show.device_type
					}
					if(this.show.state == 'all'){
						this.query.state = ''
					}else{
						this.query.state = this.show.state
					}
					let dev = await this.$api.devices(this.query)
					this.options.total = dev.data.data.totalNumber
					dev.data.data.list.forEach(item =>{
						if(item.state == "online"){
							item.state = this.$t('online')
						}else if(item.state == "offline"){
							item.state = this.$t('offline')
						}else if(item.state == "longoffline"){
							item.state = this.$t('long offline')
						}
						if(item.device_type == "240"){
							item.device_type = this.$t('ctrl')
						}else if(item.device_type == "15"){
							item.device_type = this.$t('door')
						}
					})
					this.devices = dev.data.data.list
					this.addMark()
					await this.centpoint()
				}
			},
			async addMark() {
				this.map.clearOverlays();
				this.markerClusterer.removeMarkers(this.markers)
				this.markers = []
				this.devices.forEach(item => {
					if (item.cellocation_id != null)
					{
						const point = new BMap.Point(item.cell_lon+Math.random()/500, item.cell_lat);
						let marker = null;
						if (item.state  == this.$t('online')) {
							labelStyle.color = '#55BC52';
							labelStyle.borderColor = '#55BC52';
							marker = new BMap.Marker(point, {
								icon: greenMark
							});
						}
						if (item.state == this.$t('offline')) {
							labelStyle.color = 'red';
							labelStyle.borderColor = 'red';
							marker = new BMap.Marker(point, {
								icon: redMark
							});
						}
						if (item.state  == this.$t('long offline')) {
							labelStyle.color = '#55BC52';
							labelStyle.borderColor = '#55BC52';
							marker = new BMap.Marker(point, {
								icon: lostMark
							});
						}
						marker.addEventListener('click', () => this.goDevice(item));
						this.markers.push(marker)
					}
				})
				this.markerClusterer.addMarkers(this.markers)
			},
			goDevice(data) {
				this.$router.push({
					name: 'deviceInfo',
					params: {
						id: data.id,
						IMEI: data.IMEI,
						type: data.device_type,
					}
				})
			},
			Onchange(val) {
				this.$router.push({
					name: val,
				})
			},
			cardClick(val,vd){
				if ((val==null)||(vd==null)){
					this.$Notice.warning({
						title: this.$t('warning'),
						desc: this.$t('This device has no address record'),
					})
				}
				else {this.map.panTo(new BMap.Point(vd, val))}
			},
			angleChange(){
				if(document.getElementById("1").className == "fa fa-angle-up fa-3x"){
					document.getElementById("1").className = "fa fa-angle-down fa-3x"
					this.div_show = false
				}else{
					document.getElementById("1").className = "fa fa-angle-up fa-3x"
					this.div_show = true
				}						
			},
			async centpoint() {
				let res = await this.$api.devices(this.query)
				var minlat = 500;
				var minlon = 500;
				var maxlat = -500;
				var maxlon = -500;				
				this.devices= res.data.data.list
				this.options.total = res.data.data.totalNumber
				this.devices.forEach(item => {
					if(item.state == "online"){
						item.state = this.$t('online')
					}else if(item.state == "offline"){
						item.state = this.$t('offline')
					}else if(item.state == "longoffline"){
						item.state = this.$t('long offline')
					}
					if(item.device_type == "240"){
						item.device_type = this.$t('ctrl')
					}else if(item.device_type == "15"){
						item.device_type = this.$t('door')
					}
					if(item.cell_lat<=minlat){
						minlat = item.cell_lat
					}
					if(item.cell_lon<=minlon){
						minlon = item.cell_lon
					}
					if(item.cell_lat>=maxlat){
						maxlat = item.cell_lat
					}
					if(item.cell_lon>=maxlon){
						maxlon = item.cell_lon
					}
				})
				cenlat = (minlat+maxlat)/2			
				cenlon = (minlon+maxlon)/2
			},
			pageChange(val) {
				this.query.page = val
				this.search()
				this.addMark()
			},
			getlist(val){
				return val.split(';')
			},
			async checkcolor(c) {
				this.color[c]=!this.color[c]
				if (this.color[c]) {
					document.getElementById(this.col[c]).className="fa fa-bookmark fa-2x"
					document.getElementById(this.col[c]).style.marginTop = "4px"
				}
				else {
					document.getElementById(this.col[c]).className="fa fa-tag fa-2x"
					document.getElementById(this.col[c]).style.marginTop = "4px"
				}
				this.query.tagcolor=''
				for (var i=0;i<6;i++) {
				if (this.color[i]) {
					if (this.query.tagcolor!='') {
						this.query.tagcolor=this.query.tagcolor+';'
						}
					this.query.tagcolor=this.query.tagcolor+this.col[i]
				}
				}
				this.search()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.mt{
		margin-top: 4px;
	}
	.map {
		height: calc(100vh - 180px);
	}
	#map {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.text{
		margin-top: 5px;
		font-size: small;		
		bordered: true;
		border-width: 3px;
	}
	.tt{
		margin-left: -10px;
		margin-top: -10px;
		margin-right: -50px;
		width: 150px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.tt1{
		margin-left: -10px;
		margin-top: 5px;
		margin-bottom: -10px;
		width: 100px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-bottom: 1px;
	}
	.dv{
		height: 460px;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.pd{
		padding-right: 2px;
	}
	.handle-input {
		width: 200px;
		display: inline-block;
	}
	.imr{
		margin: 10px;
		margin-left: 0px;
	}
	.smr{
		margin-right: 10px;
	}
	.pd-heard{
		margin-top: -20px;
	}
	.icon{
		margin-top:-20px;
		margin-left: 120px;
	}
	.icon1{
		margin-top:-20px;
		margin-left: 140px;
		padding-left: 10px;
	}
	.ss{
		display:inline;
		float: right;
		padding-right: 2px;
	}
	.fonts{
		font-size: 12px;
	}
</style>
