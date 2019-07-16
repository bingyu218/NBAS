<template lang="jade">
div()
	Col.map(span="24" id="mapsize")
		div#map
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
				15: '控制器',
				240: '控制柜',
			};
			const netWork = {
				3: '联通3G',
				40: '移动4G',
				41: '联通4G',
			};
			return {
				showtag:true,
				title:'',
				color:[false,false,false,false,false,false],
				col:['green','red','yellow','blue','gray','black'],
				menu: [],
				query:{
					search_info: '',
					page: 1,
					num:1000,
					device_type: '',
					state:'online',
					register: "registered",
					tagcolor: '',
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
				list:'',
				countmark:0,
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
				},
				screenheight:'',
			}
		},
		mounted() {			
			this.initMap()
			this.getList()
			this.setsize()
		},
		methods: {
			setsize(){
				const mapsize = document.getElementById('mapsize')
				const deviceWidth = document.documentElement.clientWidth
				this.screenheight = document.documentElement.clientHeight
				// mapsize.style.width = '100%'
				// mapsize.style.height = (Number(this.screenheight)/2.55) + 'px'
				mapsize.style.height ='350px'
			},
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
				
				map.centerAndZoom(point, 1);
				
				map.enableScrollWheelZoom();
				var styleJson = [{
						"featureType": "land",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"color": "#1d2d47ff"
						}
					}, {
						"featureType": "water",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"color": "#113549ff"
						}
					}, {
						"featureType": "green",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"color": "#0e1b30ff"
						}
					}, {
						"featureType": "building",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "building",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#113549ff"
						}
					}, {
						"featureType": "building",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#dadada00"
						}
					}, {
						"featureType": "subwaystation",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"color": "#113549B2"
						}
					}, {
						"featureType": "education",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"color": "#12223dff"
						}
					}, {
						"featureType": "medical",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"color": "#12223dff"
						}
					}, {
						"featureType": "scenicspots",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"color": "#12223dff"
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"weight": 4
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#fed66900"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "arterial",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"weight": 2
						}
					}, {
						"featureType": "arterial",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "arterial",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffeebb00"
						}
					}, {
						"featureType": "arterial",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "arterial",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "arterial",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "local",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on",
							"weight": 1
						}
					}, {
						"featureType": "local",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "local",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "local",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "local",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#979c9aff"
						}
					}, {
						"featureType": "local",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffffff"
						}
					}, {
						"featureType": "railway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"weight": 1
						}
					}, {
						"featureType": "railway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#123c52ff"
						}
					}, {
						"featureType": "railway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "subway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"weight": 1
						}
					}, {
						"featureType": "subway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#d8d8d8ff"
						}
					}, {
						"featureType": "subway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "subway",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "subway",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#979c9aff"
						}
					}, {
						"featureType": "subway",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffffff"
						}
					}, {
						"featureType": "continent",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "continent",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "continent",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "continent",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "city",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "city",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "city",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "city",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "town",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "town",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "town",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#454d50ff"
						}
					}, {
						"featureType": "town",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffffff"
						}
					}, {
						"featureType": "road",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "poilabel",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "districtlabel",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "road",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "road",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "road",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "district",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "poilabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "poilabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "poilabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "manmade",
						"elementType": "geometry",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "districtlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffffff"
						}
					}, {
						"featureType": "entertainment",
						"elementType": "geometry",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "shopping",
						"elementType": "geometry",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "highway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "6"
						}
					}, {
						"featureType": "highway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "7"
						}
					}, {
						"featureType": "highway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "8"
						}
					}, {
						"featureType": "highway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "9"
						}
					}, {
						"featureType": "highway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "10"
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "6"
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "7"
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "8"
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "9"
						}
					}, {
						"featureType": "highway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "10"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "6"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "7"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "8"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "9"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "10"
						}
					}, {
						"featureType": "nationalway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "6"
						}
					}, {
						"featureType": "nationalway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "7"
						}
					}, {
						"featureType": "nationalway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "8"
						}
					}, {
						"featureType": "nationalway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "9"
						}
					}, {
						"featureType": "nationalway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "10"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "6"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "7"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "8"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "9"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "10"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "6"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "7"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "8"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "9"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,10",
							"level": "10"
						}
					}, {
						"featureType": "provincialway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "8"
						}
					}, {
						"featureType": "provincialway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "9"
						}
					}, {
						"featureType": "provincialway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "10"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "8"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "9"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "10"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "8"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "9"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "8,10",
							"level": "10"
						}
					}, {
						"featureType": "cityhighway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "6"
						}
					}, {
						"featureType": "cityhighway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "7"
						}
					}, {
						"featureType": "cityhighway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "8"
						}
					}, {
						"featureType": "cityhighway",
						"stylers": {
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "9"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "6"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "7"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "8"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "9"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "6"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "7"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "8"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "labels",
						"stylers": {
							"visibility": "off",
							"curZoomRegionId": "0",
							"curZoomRegion": "6,9",
							"level": "9"
						}
					}, {
						"featureType": "subwaylabel",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "subwaylabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "tertiarywaysign",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "tertiarywaysign",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "provincialwaysign",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "provincialwaysign",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "nationalwaysign",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "nationalwaysign",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "highwaysign",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "highwaysign",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "village",
						"elementType": "labels",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "district",
						"elementType": "labels.text",
						"stylers": {
							"fontsize": 20
						}
					}, {
						"featureType": "district",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "district",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "country",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "country",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "water",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "water",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "tertiaryway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "tertiaryway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff10"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "highway",
						"elementType": "labels.text",
						"stylers": {
							"fontsize": 20
						}
					}, {
						"featureType": "nationalway",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "nationalway",
						"elementType": "labels.text",
						"stylers": {
							"fontsize": 20
						}
					}, {
						"featureType": "provincialway",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "provincialway",
						"elementType": "labels.text",
						"stylers": {
							"fontsize": 20
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "labels.text",
						"stylers": {
							"fontsize": 20
						}
					}, {
						"featureType": "cityhighway",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "estate",
						"elementType": "geometry",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "tertiaryway",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "tertiaryway",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "fourlevelway",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "fourlevelway",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "scenicspotsway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "scenicspotsway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "universityway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "universityway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "vacationway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "vacationway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "fourlevelway",
						"elementType": "geometry",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "fourlevelway",
						"elementType": "geometry.fill",
						"stylers": {
							"color": "#12223dff"
						}
					}, {
						"featureType": "fourlevelway",
						"elementType": "geometry.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "transportationlabel",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "transportationlabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "transportationlabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "transportationlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "educationlabel",
						"elementType": "labels",
						"stylers": {
							"visibility": "on"
						}
					}, {
						"featureType": "educationlabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "educationlabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "educationlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "transportation",
						"elementType": "geometry",
						"stylers": {
							"color": "#113549ff"
						}
					}, {
						"featureType": "airportlabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "airportlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "scenicspotslabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "scenicspotslabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "medicallabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "medicallabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "medicallabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "scenicspotslabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "airportlabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "entertainmentlabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "entertainmentlabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "entertainmentlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "estatelabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "estatelabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "estatelabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "businesstowerlabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "businesstowerlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "businesstowerlabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "companylabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "companylabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "companylabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "governmentlabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "governmentlabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "governmentlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "restaurantlabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "restaurantlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "restaurantlabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "hotellabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "hotellabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "hotellabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "shoppinglabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "shoppinglabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "shoppinglabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "lifeservicelabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "lifeservicelabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "lifeservicelabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "carservicelabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "carservicelabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "carservicelabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "financelabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "financelabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "financelabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "otherlabel",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "otherlabel",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "otherlabel",
						"elementType": "labels.icon",
						"stylers": {
							"visibility": "off"
						}
					}, {
						"featureType": "manmade",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "manmade",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "transportation",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "transportation",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "education",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "education",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "medical",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "medical",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
					}, {
						"featureType": "scenicspots",
						"elementType": "labels.text.fill",
						"stylers": {
							"color": "#2dc4bbff"
						}
					}, {
						"featureType": "scenicspots",
						"elementType": "labels.text.stroke",
						"stylers": {
							"color": "#ffffff00"
						}
				}];
				map.setMapStyleV2({styleJson:styleJson});
				//竖着的工具条
// 				map.addControl(new BMap.NavigationControl({
// 					anchor: BMAP_ANCHOR_TOP_RIGHT,
// 					enableGeolocation: true, 
// 				}));
				map.addEventListener('tilesloaded', () => {
					this.eventHandler();
				});
				//比例尺
// 				map.addControl(new BMap.ScaleControl({
// 					anchor: BMAP_ANCHOR_TOP_RIGHT
// 				}));
				//右下角的小箭头
				// map.addControl(new BMap.OverviewMapControl());
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
						item.state = "在线"
					}else if(item.state == "offline"){
						item.state = "离线"
					}else if(item.state == "longoffline"){
						item.state = "长期离线"
					}
					if(item.device_type == "240"){
						item.device_type = "控制柜"
					}else if(item.device_type == "15"){
						item.device_type = "控制器"
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
						title: '警告',
						desc: '请不要超过15字！',
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
					this.devices = dev.data.data.list
					this.options.total = dev.data.data.totalNumber
					this.devices.forEach(item =>{
						if(item.state == "online"){
							item.state = "在线"
						}else if(item.state == "offline"){
							item.state = "离线"
						}else if(item.state == "longoffline"){
							item.state = "长期离线"
						}
						if(item.device_type == "ctrl"){
							item.device_type = "控制柜"
						}else if(item.device_type == "door"){
							item.device_type = "控制器"
						}
					})
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
						if (item.state  == "在线") {
							labelStyle.color = '#55BC52';
							labelStyle.borderColor = '#55BC52';
							marker = new BMap.Marker(point, {
								icon: greenMark
							});
						}
						if (item.state == "离线") {
							labelStyle.color = 'red';
							labelStyle.borderColor = 'red';
							marker = new BMap.Marker(point, {
								icon: redMark
							});
						}
						if (item.state  == '长期离线') {
							labelStyle.color = '#55BC52';
							labelStyle.borderColor = '#55BC52';
							marker = new BMap.Marker(point, {
								icon: lostMark
							});
						}
						var steelContent ='设备id:'+item.device_id+'<div></div>设备名称:'+item.device_name+'<div></div>基站地址:'+item.cell_address
						var steelOpts = {
							width : 150,     //信息窗口宽度
							height: 130,     //信息窗口高度
							title : "<b>设备信息</b>" , //信息窗口标题
							enableMessage:true	//设置允许信息窗发送短息
						};
						marker.addEventListener('mouseover',function () {this.openInfoWindow(new BMap.InfoWindow(steelContent, steelOpts))})
						// marker.addEventListener('mouseout',function () {this.closeInfoWindow()})
						this.markers.push(marker)

					}
				})
				// this.map.panTo(new BMap.Point(29.71174431,105.67720032))
				var point = new BMap.Point(106.27720032,29.41174431)
				this.map.panTo(point)
				this.markerClusterer.addMarkers(this.markers)
			},
			showtag1(data) {
				this.showtag=true
			},
			showtag2(data) {
				this.showtag=false
			},
			cardClick(val,vd){
				if ((val==null)||(vd==null)){
					this.$Notice.warning({
						title: '警告',
						desc: '该设备没有记录地址',
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
						item.state = "在线"
					}else if(item.state == "offline"){
						item.state = "离线"
					}else if(item.state == "longoffline"){
						item.state = "长期离线"
					}
					if(item.device_type == "240"){
						item.device_type = "控制柜"
					}else if(item.device_type == "15"){
						item.device_type = "控制器"
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
			getlist(val){
				return val.split(';')
			},

		}
	}
</script>

<style lang="scss" scoped>
	.mt{
		margin-top: 4px;
	}
	.map {
		height: calc(30vh - 54px);
	}
	#map {
		position: relative;
		width: 100%;
		min-height: 100%;
	}
</style>
