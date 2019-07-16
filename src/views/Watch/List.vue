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
					AutoComplete(name="inpSer" v-model="query.search_info" ,:data="menu" ,@on-search="handleSearch1", :placeholder="$t('keyword')" max=15 style="width:100%" class="handle-input mr10" id="serch1")
				Col(span=3)
					Input(v-model="query.install_addr" , :placeholder="$t('install address')" max=10)
				Col(span=2)
					Button.mr-10(type="primary",icon="ios-search",@click="search()" style="margin-left:1px")|{{$t('search')}}
				Col(span=1)
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
	div.ssa
		Table(:columns="columns",:data="list",size="small" stripe)
	div.form
		Col(span='24' style="text-align:center;")
			Page(show-elevator :total="options.total",:page-size="options.num",:current="options.page",@on-change="pageChange",show-total)
</template>

<script>	
	var tagCor = '';
	export default {
		created() {
			this.getList()
		},
		data() {
			const type = {
				15: this.$t('door'),
				240: this.$t('ctrl'),
			};
			const model = {
				'online': this.$t('online'),
				'offline': this.$t('offline'),
				'longoffline': this.$t('long offline'),
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
				option: {
					lon: this.$cookie.get('lng'),
					lat: this.$cookie.get('lat'),
					zoom: this.$cookie.get('zoom') || 9,
				},
				query:{
					search_info: '',
					page: 1,
					num: 10,
					isreg: "True",
					state: 'online',
					device_type:"",
					tagcolor:"",
					register: "registered",	
					install_addr:'',
				},
				show:{
					state: 'online',
					device_type:"all",
				},
				map: null,
				list: [],
				div_show: true,
				openAnimateList: [],
				columns: [
					{
					title: this.$t('ID'),
					key: 'device_id',
					width: 60,
					},
					{
						title: this.$t('device name'),
						width: 120,
						key: 'device_name',
						align:'left',
						render: (h, params) =>
							h('div',[
								h('Button', {
									props: {
										type: 'text',
										size: "small",
									},
									style: {
										paddingRight: '1px',
										paddingLeft: '1px',
									},
									on: {
										click: () => {
											this.$router.push({
												name: 'deviceInfo',
												params: {
													id: params.row.id,
													IMEI: params.row.IMEI,
													type: params.row.device_type,
												}
											})
										}
									}
								}, params.row.device_name)
							],)
					},
					{
					title: 'IMEI(设备识别码)',
					key: 'IMEI',
					width: 140,
					},
					{
					title: 'IMSI(用户识别码)',
					key: 'device_IMSI',
					width: 140,
					},
					{
						title: this.$t('device type'),
						width: 105,
						key: 'device_type',
						render: (h, params) => {
							return h('p', type[params.row.device_type] || '-')
						}
					},
					{
					  title: this.$t('state'),
					  key: 'state',
						width: 90,
					  render: (h, params) => {
							return h('p',model[params.row.state]||'')
					  }
					},
					{
						title: this.$t('IP location'),
						width: 120,
						render: (h, params) => {
							return h('div',params.row.ip_country+params.row.ip_region+params.row.ip_city)
					 }
					},
					{
						title: this.$t('base station'),
						key: 'cell_address',
						render: (h,params) => {
							var addr= params.row.cell_address
			  		 		if (params.row.cell_address !=null) {
							if(params.row.cell_address.length>=50){
						 		addr=params.row.cell_address.substring(0,50)+"…"
						 	}
							}
							return  h('Poptip',{
								props: {
									trigger:"hover",										
									placement:"top-start",
									content:params.row.cell_address
								},
							},addr)
						}
					},
//					{
//					title: '操作',
//					key: 'companyName',
//					width: 100,
//					align: 'center',
//					render: (h, params) => {
//						return h('div', [
//							h('Button', {
//								props: {
//									type: 'success',
//									size: 'small'
//								},
//								style: {
//									marginRight: '5px'
//								},
//								on: {
//								}
//							}, '关注'),
//							h('Button', {
//								props: {
//									type: 'warning',
//									size: "small",
//								},
//								on: {
//									click: () => {
//										this.clear(params.row)
//									}
//								}
//							}, '清除'),
//						]);
//					}
//				}
				],
				markerClusterer: null,
				markers: [],
				options: {
					name:'',
					page: 1,
					num: 10,
					total: 0,
					isreg: "True",
					model:'login',
					register: "registered",	
				}
			}
		},
		computed:{
			data() {
				return this.devices.filter((d) => {
					let is_del = false;
					for (let i = 0; i < this.del_list.length; i++) {
						if (d.device_name === this.del_list[i].device_name) {
							is_del = true;
							break;
						}
					}
					if (!is_del) {
						if (d.IMEI.indexOf(this.query.search_info) > -1 &&
							(d.device_name.indexOf(this.query.search_info) > -1 ||
								d.address.indexOf(this.query.search_info) > -1)
						) {
							return d;
						}
					}
				})
			}
		},
		methods: {
			handleSearch1 (selectword) {
				this.menu=[];
				var str;
				for (var i=0;i<this.list.length;i++){
					str=this.list[i].IMEI;
					if (str != null){
						if (str.indexOf(selectword)>=0)
						this.menu.push(str)
					}
				}
				for (var i=0;i<this.list.length;i++){
					str=this.list[i].IMSI;
					if (str != null){
						if (str.indexOf(selectword)>=0)
							this.menu.push(str)
					}
				}
				for (var i=0;i<this.list.length;i++){
					str=this.list[i].device_name;
					if (str != null){
						if (str.indexOf(selectword)>=0)
							this.menu.push(str)
					}	        	
				}
			},
			pageChange(val) {
				this.query.page = val
				this.search()
			},
			Onchange(val) {
				this.$router.push({
					name: val,
				})
			},
			async getList() {
				this.openAnimateList.forEach((item) => {
					clearTimeout(item);
				});
				this.openAnimateList = [];
				let res = await this.$api.devices(this.query);
				this.options.page=1;
				this.list=res.data.data.list;
				this.options.total = res.data.data.totalNumber
			},
			async search(){
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
					this.list=dev.data.data.list;
					this.options.total = dev.data.data.totalNumber
				}
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
			async clear(item) {
				let res = await this.$api.logoutdevices(item.id)
				if (res.data.code === 0) {
					this.getList()
					this.$Notice.success({
						title: this.$t('success'),
						desc: this.$t('start clear')
					});
				} else {
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('fail to clear')
					});
				}
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
		height: 50px;
	}
	.tt{
		margin-left: -10px;
		margin-top: -10px;
		margin-bottom: 10px;
		
		width: 90px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.dv{
		overflow-y: scroll;
	}
	.pd{
		padding: 10px;
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
	.ssa{
		min-height: 450px;
	}
	.fonts{
		font-size: 12px;
	}
</style>