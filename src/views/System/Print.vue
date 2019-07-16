<template>
<div class="layout-content-main">
	<div class="form" padding-top="100">
		<Row>
			<Col span='4'>
				<AutoComplete v-model="query.search_info" :data="menu" @on-search="handleSearch1" style="width:100%"></AutoComplete>
			</Col>
			<Col span='2'>
				<Button class="mr-10" type="primary" icon="ios-search" @click="search()" style="margin-left:10px">{{$t('search')}}</Button>
			</Col>
		</Row>
	<div style="min-height:450px; margin-top: 10px;">
		<Table stripe class="mb-10" :columns="columns" :data="data" size="small"></Table>
	</div>
	<Col span="24" style="text-align: center;">
		<Page show-elevator :total="options.total" :page-size="options.num" :current="options.page" @on-change="pageChange" show-total></Page>
	</Col>
	<div id="capture"></div>
	<div id="printer" >
		<p >{{$t('NBSL Elevator QR Code')}}</p><br />
		<img :src="dataUrl" >
		<p v-text="id"></p>
	</div>
	</div>
</div>
</template>

<script>
	// import html2canvas from 'html2canvas'
	import QRCode from 'qrcodejs2'
	export default {
		data() {
			const type = {
				15: this.$t('door'),
				240: this.$t('ctrl'),
			};
			const netWork = {
				3: '联通3G',
				40: '移动4G',
				41: '联通4G',
			};
			return {
				color:[false,false,false,false,false,false],
				col:['green','red','yellow','blue','gray','black'],
				menu: [],
				loading: false,
				url: '',
				id: '',
				dataUrl: '',
				print:this.global.functions.print,
				query: {
					search_info: '',
					page: 1,
					num: 10,
					select_type:'',
					select_status:'',
					tagcolor: '',
		    	},
				options: {
					page: 1,
					num: 10,
					total: 0,
					tagcolor: '',
				},
				columns: [{
			          title: this.$t('device name'),
			          width:120,
			          key: 'device_name'
			        },
			        {
			          title: 'IMEI(设备识别码)',
			          width:140,
			          key: 'IMEI',
			        },
			        {
					 title: 'IMSI(用户识别码)',
					 key: 'device_IMSI',
					 width: 140,
					},
					{
						title: this.$t('IP location'),
		               width: 120,
					   render: (h, params) => {
					   return h('div',params.row.ip_country+params.row.ip_region+params.row.ip_city)
					   }
					},
			        {
			        	title: this.$t('install address'),
			        	// width: 250,
			        	key: 'install_addr',
			        	render: (h, params) => {
			        		var addr = params.row.install_addr
			        		if (params.row.install_addr != null) {
			        			if (params.row.install_addr.length >= 30) {
			        				addr = params.row.install_addr.substring(0, 28) + "…"
			        			}
			        		}
			        		return h('Poptip', {
			        			props: {
			        				trigger: "hover",
			        				placement: "top-start",
			        				content: params.row.install_addr
			        			},
			        		}, addr)
			        	}
			        },
// 			        {
// 			          title: '更新时间',
// 			          key: 't_create',
// 			          render: (h, params) => {
// 			            return h('p',this.$format(params.row.t_update, 'YYYY-MM-DD HH:mm:ss'))
// 			          }
// 			        },
// 			        {
// 			          title: '创建时间',
// 			          key: 't_create',
// 			          render: (h, params) => {
// 			            return h('p',this.$format(params.row.t_create, 'YYYY-MM-DD HH:mm:ss'))
// 			          }
// 			        },
					{
						title: this.$t('handle'),
						width: 120,
						align:'center',
						render: (h, params) => {
							return h('Button', {
								props: {
									type: 'primary',
									size: "small",
									disabled:this.print != true,
								},
								on: {
									click: () => {
										this.print(params.row)
									}
								}
							}, this.$t('print'))
						}
					}
				],
				data: []
			}
		},
		created() {
			this.getList()
		},
		mounted() {
			this.print=this.global.functions.print
		},
		methods: {
		  	handleSearch1 (selectword) {
		  		this.menu=[];
		  		var str;
		        for (var i=0;i<this.data.length;i++){
		        	str=this.data[i].IMEI;
		        	if (str != null){
		        		if (str.indexOf(selectword)>=0)
		        		this.menu.push(str)
		        	}	        	
		  	  	}
		        for (var i=0;i<this.data.length;i++){
		        	str=this.data[i].IMSI;
		        	if (str != null){
		        		if (str.indexOf(selectword)>=0)
		        		this.menu.push(str)
		        	}	        	
		  	  	}
		        for (var i=0;i<this.data.length;i++){
		        	str=this.data[i].device_name;		  	    	
				        	if (str != null){
				        		if (str.indexOf(selectword)>=0){
				        		this.menu.push(str)
				        		}
				        	} 		        	
		  	  	}
		      },
			pageChange(val) {
				this.options.page = val
				this.getList()
			},
			async getList() {
				this.loading = true
				let res = await this.$api.devices(this.options)
				this.loading = false
				if (res.data.code === 0) {
					this.data = res.data.data.list
					this.data.forEach(item =>{
							if (item.device_name !=null) {
						 	if(item.device_name.length>=10){
						 		item.device_name=item.device_name.substring(0,9)+"…"
						 	}
							}
							if (item.cell_address !=null) {
							if(item.cell_address.length>=40){
						 		item.cell_address=item.cell_address.substring(0,40)+"…"
						 	}
							}
						 	})
					this.options.total = res.data.data.totalNumber
				} else {
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('Fail to gain elevator data')
					});
				}
			},
			async search() {
				if (this.query.search_info.length>15){
					this.$Notice.error({
								title: this.$t('error'),
								desc: this.$t('The keyword is too long'),
							})
				}
				else {
				this.loading = true
				let res = await this.$api.devices(this.query)
				this.loading = false
				if (0 === res.data.code) {
					this.data = res.data.data.list
					this.data.forEach(item =>{
							if (item.device_name !=null) {
						 	if(item.device_name.length>=10){
						 		item.device_name=item.device_name.substring(0,9)+"…"
						 	}
							}
							if (item.cell_address !=null) {
							if(item.cell_address.length>=40){
						 		item.cell_address=item.cell_address.substring(0,40)+"…"
						 	}
							}
						 	})
					// this.options.total = res.data.data.totalNumber
				}
				}
			},	
			async print(item) {
				$("#capture").empty();
				this.id = item.IMEI
				this.url = `http://server.asynciot.com/company/follow/${item.id}`
				// $('#capture').qrcode({
				//   // render: "table",
				//   text: this.url
				// });
				let code = new QRCode(document.getElementById("capture"), {
					text: `http://server.asynciot.com/company/follow/${item.id}`,
					// width: '4cm',
					// height: '4cm',
				})
				let canvas = document.querySelector("#capture canvas")
				const data = canvas.toDataURL("image/png")
				this.dataUrl = data;

				$('#printer').printThis({
					debug: false,
					importCSS: true,
					importStyle: true,
					loadCSS: "",
					pageTitle: `NBSL`,
					header: null
				})
			},
			Onchange: function(val) {
				this.$router.push({
					name: val,
				})
			},
			async checkcolor(c) {
				this.color[c]=!this.color[c]
				if (this.color[c]) {
					document.getElementById(this.col[c]).className="fa fa-bookmark fa-2x"
				}
				else {
					document.getElementById(this.col[c]).className="fa fa-tag fa-2x"
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
<style scoped>
	.mb-10 {
		margin-bottom: 20px;
	}

	#capture,
	#printer {
		display: none;
	}

	#printer {
		width: 21cm;
		height: 29.7cm;
		text-align: left;
		margin-right: 1000px;
	}

	#printer img {
		height: 6cm;
		width: 6cm;
	}

	#printer p {
		height: 0.5cm;
		width: 100%;
		text-align: left;
		font-size: x-large;
	}

	@media print {
		#printer {
			display: block;
		}
	}
	.mr-10{
		margin-left: 5px;
	}
</style>
