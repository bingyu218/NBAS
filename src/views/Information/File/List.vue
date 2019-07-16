<template>
	<div class="layout-content-main">
		<Form class="imr" ref="form" label-position="left" :label-width="100" @keydown.enter.native.prevent="search()">
			<Row :gutter='5'>
				<Col span='2'>
				<Select class="smr" v-model="show.device_type" style="width:100%;" :placeholder="$t('device type')" @on-change="search()">
					<Option key="1" :label="$t('all')" value="all"></Option>
					<Option key="2" :label="$t('door')" value="15"></Option>
					<Option key="3" :label="$t('ctrl')" value="240"></Option>
				</Select>
				</Col>
				<Col span='2'>
				<Select class="smr" v-model="show.register" style="width:100%;" :placeholder="$t('register')+$t('state')" @on-change="search()">
					<Option key="1" :label="$t('all')" value="all"></Option>
					<Option key="2" :label="$t('unregistered')" value="unregistered"></Option>
					<Option key="3" :label="$t('registered')" value="registered"></Option>
				</Select>
				</Col>
				<Col span='2'>
				<Select class="smr" v-model="show.state" style="width:100%;" :placeholder="$t('state')" @on-change="search()">
					<Option key="1" :label="$t('all')" value="all"></Option>
					<Option key="2" :label="$t('online')" value="online"></Option>
					<Option key="3" :label="$t('offline')" value="offline"></Option>
					<Option key="4" :label="$t('long offline')" value="longoffline"></Option>
				</Select>
				</Col>
				<Col span=4>
					<AutoComplete class="handle-input mr10" v-model="options.search_info" :data="menu" @on-search="handleSearch1"
					 :placeholder="$t('keyword')" style="width:100%;" id="serch1"></AutoComplete>
				</Col>
				<Col span=2>
					<Input v-model="options.install_addr"  :placeholder="$t('install address')" max=10></Input>
				</Col>
					
				<Col span='2'>
					<Button class="mr-10" type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
				</Col>
				<Col span='1'>
					<Button class="mr-10" type="default" icon="md-add" @click="showtag=!showtag" shape="circle" v-if='!showtag'></Button>
					<Button class="mr-10" type="default" icon="md-remove" @click="showtag=!showtag" shape="circle" v-if='showtag'></Button>
				</Col>
				<Col span='3' v-if='showtag'>
				<Col span='4'>
				<span class="pd fa fa-tag fa-2x" id="green" style="color:green;" @click="checkcolor(0)"></span>
				</Col>
				<Col span='4'>
				<span class="pd fa fa-tag fa-2x" id="red" style="color:red;" @click="checkcolor(1)"></span>
				</Col>
				<Col span='4'>
				<span class="pd fa fa-tag fa-2x" id="yellow" style="color:yellow;" @click="checkcolor(2)"></span>
				</Col>
				<Col span='4'>
				<span class="pd fa fa-tag fa-2x" id="blue" style="color:blue;" @click="checkcolor(3)"></span>
				</Col>
				<Col span='4'>
				<span class="pd fa fa-tag fa-2x" id="gray" style="color:gray;" @click="checkcolor(4)"></span>
				</Col>
				<Col span='4'>
				<span class="pd fa fa-tag fa-2x" id="black" style="color:black;" @click="checkcolor(5)"></span>
				</Col>
				</Col>
			</Row>
		</Form>
		<div style="min-height: 450px; margin-top: 5px;">
			<Table stripe class="mb-10" :columns="columns" :data="data" size="small"></Table>
		</div>
		<Col span="24" style="text-align: center;">
			<Page show-elevator :total="total" :page-size="options.num" :current="options.page" @on-change="pageChange"
			 show-total></Page>
		</Col>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showtag: false,
				show: {
					device_type: 'all',
					register: 'all',
					state: 'online',
				},
				color: [false, false, false, false, false, false],
				col: ['green', 'red', 'yellow', 'blue', 'gray', 'black'],
				menu: [],
				follow: [],
				username:window.localStorage.getItem('username'),
				options: {
					search_info: '',
					device_type: '',
					register: 'unregistered',
					page: 1,
					num: 10,
					isreg: '',
					tagcolor: '',
					install_addr:'',
				},
				total:0,
				searchkey: this.$t('install address')+this.$t('install address'),
				loading: false,
				columns: [
					{
						title: this.$t('device name'),
						key: 'device_name',
						width: 110,
						align: 'center',
						render: (h, params) =>{
							var type = '';
							var reg = '';
							if (params.row.install_addr == null) {
								type = 'ios-help';
								reg = this.$t('No install address');
							}
							if (params.row.device_name == null) {
								type = 'ios-help';
								reg = reg + this.$t('This device is unnamed')+';';
							}
							if (params.row.IMEI == null) {
								type = 'ios-help';
								reg = reg + this.$t('No IMEI')+';';
							}
							if (params.row.rssi <= 5) {
								type = 'ios-help';
								reg = reg + this.$t('The signal is too weak')+';';
							}
							return h('div', [
								h('Poptip', {
									props: {
										trigger: "hover",
										placement: "right-start",
										content: reg,
									},
									'style': {
										color: '#FF7F24',
									}
								}, [
									h('Button', {
										props: {
											type: 'text',
											size: "small",
											display:"inline-block",
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
									}, params.row.device_name),
								]),
							])
						}
						
					},
					{
						title: 'IMEI(设备识别码)',
						key: 'IMEI',
						width: 148,
						align: 'center',
						render: (h, params) =>
							h('div',[
								h('Button', {
									props: {
										type: 'text',
										size: "small",
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
								}, params.row.IMEI)
							],)
					},
					{
						title: 'IMSI(用户识别码)',
						key: 'device_IMSI',
						width: 148,
					},
					{
						title: this.$t('device type'),
						key: 'device_type',
						width: 105,
						render: (h, params) => {
							var type = "-"
							if (params.row.device_type == '240') type = this.$t('ctrl')
							if (params.row.device_type == '15') type = this.$t('door')
							return h('div', type)
						}
					},
					{
						title: this.$t('IP location'),
						width: 120,
						render: (h, params) => {
							return h('div', params.row.ip_country + params.row.ip_region + params.row.ip_city)
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
					//              {
					//                title: '更新时间',
					//                key: 't_create',
					//                render: (h, params) => {
					//                  return h('p',this.$format(params.row.t_update, 'YYYY-MM-DD HH:mm:ss'))
					//                }
					//              },
					//              {
					//                title: '创建时间',
					//                key: 't_create',
					//                render: (h, params) => {
					//                  return h('p',this.$format(params.row.t_create, 'YYYY-MM-DD HH:mm:ss'))
					//                }
					//              },
					{
						title: this.$t('handle'),
						width: 280,
						render: (h, params) => {
							var follow = this.$t('follow')
							this.follow.forEach(item => {
								if (params.row.IMEI == item.imei) {
									follow = this.$t('remove follow')
								}
							})
							return h('div', [
								h('Button', {
									props: {
										type: 'success',
										size: "small",
									},
									style: {
										marginRight: '10px',
									},
									on: {
										click: () => {
											if (follow == this.$t('follow'))
												this.addfl(params.row.IMEI)
											if (follow == this.$t('remove follow'))
												this.delfl(params.row.id)
										},
									}
								}, follow),
								h('Button', {
									props: {
										type: 'error',
										size: "small",
										disabled:this.username=="demo",
									},
									style: {
										marginRight: '10px',
									},
									on: {
										click: () => {
											this.$router.push({
												name: 'alert',
												params: {
													IMEI: params.row.IMEI
												}
											})
										},
									}
								}, this.$t('new order')),
								h('Button', {
									props: {
										type: 'primary',
										size: "small",
									},
									style: {
										marginRight: '10px',
									},
									on: {
										click: () => {
											this.$router.push({
												name: 'elevatorFiles',
												params: {
													IMEI: params.row.IMEI
												}
											})
										},
									}
								}, this.$t('watch')+'/'+this.$t('edit')),
							])
						}
					}
				],
				refreshNum: 0,
				data: []
			}
		},
		created() {
			this.getList()
		},
		methods: {
			handleSearch1(selectword) {
				this.menu = [];
				var str;
				for (var i = 0; i < this.data.length; i++) {
					str = this.data[i].IMEI;
					// if ((str != null)&&(selectword!= null)){
					if(str.indexOf(selectword) >= 0){
						this.menu.push(str)
					}
					// }
					str = this.data[i].device_name;
					// if ((str != null)&&(selectword!= null)){
					if(str.indexOf(selectword) >= 0){
						this.menu.push(str)
					}
					// } 
				}
			},
			pageChange(val) {
				this.options.page = val
				this.getList()
			},
			async getList() {
				this.loading = true
				if (this.show.register == "all") {
					this.options.register = ""
				} else {
					this.options.register = this.show.register
				}
				if (this.show.device_type == "all") {
					this.options.device_type = ""
				} else {
					this.options.device_type = this.show.device_type
				}
				if (this.show.state == "all") {
					this.options.state = ""
				} else {
					this.options.state = this.show.state
				}
				let res = await this.$api.devices(this.options)
				let fol = await this.$api.follow({
					num: 100,
					page: 1
				})
				this.loading = false
				if (fol.data.code == 0) {
					this.follow = fol.data.data.list
				}
				if (res.data.code === 0) {
					this.data = res.data.data.list
					this.data.forEach(item => {
						if (item.register != null) {
							if (item.register == 'registered') {
								item.register = '已注册'
							}
						}
						if (item.register != null) {
							if (item.register == 'unregistered') {
								item.register = '注册'
							}
						}
						if (item.commond != null) {
							if (item.commond == 'contract') {
								item.register = '注册中'
							}
						}
						if (item.device_name != null) {
							if (item.device_name.length >= 10) {
								item.device_name = item.device_name.substring(0, 9) + "…"
							}
						}
					})
					this.total = res.data.data.totalNumber
				} else {
					this.$Notice.error({
						title: '错误',
						desc: '获取列表失败'
					});
				}
			},
			async search() {
				this.options.page = 1
				this.getList()
			},
			Onchange: function(val) {
				this.$router.push({
					name: val,
				})
			},
			async addfl(val) {
				let res = await this.$api.addfollow({
					imei: val
				})
				if (res.data.code == 0) {
					this.$Notice.success({
						title: '成功',
						desc: '关注成功'
					});
					this.getList()
				} else {
					this.$Notice.error({
						title: '错误',
						desc: '关注失败'
					});
				}
			},
			async delfl(val) {
				let res = await this.$api.delfollow({
					device_id: val
				})
				if (res.data.code == 0) {
					this.$Notice.success({
						title: '成功',
						desc: '不再关注该设备'
					});
					this.getList()
				} else {
					this.$Notice.error({
						title: '失败',
						desc: '发生错误'
					});
				}
			},
			async checkcolor(c) {
				this.color[c] = !this.color[c]
				if (this.color[c]) {
					document.getElementById(this.col[c]).className = "fa fa-bookmark fa-2x"
				} else {
					document.getElementById(this.col[c]).className = "fa fa-tag fa-2x"
				}
				this.options.tagcolor = ''
				for (var i = 0; i < 6; i++) {
					if (this.color[i]) {
						if (this.options.tagcolor != '') {
							this.options.tagcolor = this.options.tagcolor + ';'
						}
						this.options.tagcolor = this.options.tagcolor + this.col[i]
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

	.img {
		width: 200px;
		height: 200px;
	}

	.tags-close-box {

		box-sizing: border-box;
		padding-top: 1px;
		text-align: center;
		width: 90px;
		height: 30px;
		background: #fff;
		box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
		z-index: 10;
	}

	.pagination {
		position: absolute;
		margin-left: 20%;
		margin-top: 3%;
	}
	.mr-10{
		margin-left: 5px;
	}
</style>
