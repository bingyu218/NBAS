<template lang="jade">
div.layout-content-main
	div
		Form.imr(ref='form',:model="query",label-position="left",:label-width="100")
			Row(:gutter=5 style="margin-top:-10px;")
				Col(span=2)
					Select.smr(v-model="show.device_type" style="width:100%" placeholder="类型" @on-change="search()")
						Option(key="1" label="全部" value='all')
						Option(key="2" label="控制器" value="15")
						Option(key="3" label="控制柜" value="240")
				Col(span=2)
					Select.smr(v-model="show.state" style="width:100%" placeholder="状态" @on-change="search()")
						Option(key="1" label="全部" value='all')
						Option(key="2" label="在线" value="online")
						Option(key="3" label="离线" value="offline")
						Option(key="4" label="长期离线" value="longoffline")
				Col(span=4)
					AutoComplete(name="inpSer" v-model="query.search_info" ,:data="menu" ,@on-search="handleSearch1" placeholder="关键词" max=15 style="width:100%" class="handle-input mr10" id="serch1")
				Col(span=1)
					Button.mr-10(type="default",icon="search",@click="search()" style="margin-left:1px")
	div.ssa
		Table.deviceList(@on-selection-change="selection" ,:columns="columns",:data="list",size="small" stripe)
	div.form
		Col(span='2')
			Button(type="default" @click="alert()")|批量订阅
		Col(span='22' style="text-align:center;")
			Page(show-elevator :total="options.total",:page-size="options.num",:current="options.page",@on-change="pageChange",show-total)
</template>

<script>
	export default {
		created() {
			this.getList()
		},
		data() {
			const type = {
				15: '控制器',
				240: '控制柜',
			};
			const model = {
				'online': '在线',
				'offline': '离线',
				'longoffline': '长期离线',
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
				},
				show:{
					state: 'online',
					device_type:"all",
				},
				map: null,
				list: [],
				openAnimateList: [],
				select: [],
				columns: [
					{
						type: 'selection',
						width: 55,
						align: 'center'
					},
					{
						title: '设备名称',
						width: 120,
						align: 'center',
						key: 'device_name',
						render: (h, params) =>
							h('div',[
								h('Button', {
									props: {
										type: 'text',
										size: "small",
									},
									style: {
										paddingRight: '4px',
										paddingLeft: '4px',
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
								}, params.row.device_name)],
							)
					},
					{
						title: 'IMEI(设备识别码)',
						key: 'IMEI',
						align: 'center',
						width: 140,
					},
					{
						title: '设备类型',
						width: 70,
						align: 'center',
						key: 'device_type',
						render: (h, params) => {
							return h('p', type[params.row.device_type] || '-')
						}
					},
					{
						title: '状态',
						key: 'state',
						align: 'center',
						width: 80,
						render: (h, params) => {
							return h('p',model[params.row.state]||'')
						}
					},
					{
						title: '安装地址',
					    render: (h, params) => {
							return h('div',params.row.install_addr)
					   }
					},
					{
						title: '基站定位',
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
					{
					title: '操作',
					key: 'companyName',
					width: 100,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.$router.push({
											name:'alertInfo',
											parms:{
												id: params.row.id
											}
										})
// 										this.$Modal.confirm({
// 											title: '您确定要订阅该设备么？',
// 											content:name,
// 											onOk: () => {
// 												
// 											},
// 											onCancel: () => {
// 											}
// 										})
									}
								}
							}, '订阅'),
							h('Button', {
								props: {
									type: 'warning',
									size: "small",
								},
								on: {
									click: () => {
										this.$Modal.warning({
											title: '您确定要取消订阅该设备么？',
											content:name,
											onOk: () => {
												this.$Notice.success({
													title: '成功',
													desc: '取消订阅成功'
												});
											},
											onCancel: () => {
											}
										})
									}
								}
							}, '取消'),
						]);
					}
				}
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
			selection(data) {
				this.select=[]
				data.forEach(item=>{
					this.select.push(item)
				})
				console.log(data)
			},
			alert(){
				if(this.select.length==0){
					this.$Notice.info({
						title: '提示',
						desc: '请选择要订阅的设备！',
					})
				}else{
					this.$Notice.success({
						title: '成功',
						desc: '订阅以下设备的告警推送！',
					})
				}
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