<template>
	<div class="layout-content-main">
		<div>
			<Form class="imr" ref="form" label-position="left" :label-width="100" @keydown.enter.native.prevent="search()">
				<Row :gutter="5">
					<Col span='3'>
						<Select class="smr" v-model="show.state" style="width:100%;" :placeholder="$t('state')" @on-change="search()">
							<Option key="1" :label="$t('all')" value="all"></Option>
							<Option key="2" :label="$t('untreated')" value="untreated"></Option>
							<Option key="3" :label="$t('treating')" value="treating"></Option>
							<Option key="4" :label="$t('treated')" value="treated"></Option>
						</Select>
					</Col>
					<Col span='3'>
						<Select class="smr" v-model="show.type" style="width:100%;" :placeholder="$t('maintenance type')" @on-change="search()">
							<Option key="1" :label="$t('all')" value="all"></Option>
							<Option key="2" :label="$t('fault')" value="1"></Option>
							<Option key="3" :label="$t('maintain')" value="2"></Option>
							<Option key="4" :label="$t('check')" value="3"></Option>
						</Select>
					</Col>
					<Col span='3'>
						<Select class="smr" v-model="show.device_type" style="width:100%;" :placeholder="$t('device type')" @on-change="search()">
							<Option key="1" :label="$t('all')" value="all"></Option>
							<Option key="2" :label="$t('door')" value="door"></Option>
							<Option key="3" :label="$t('ctrl')" value="ctrl"></Option>
						</Select>
					</Col>
					<Col span='4'>
						<AutoComplete class="handle-input mr10" v-model="options.device_id" :data="menu" @on-search="handleSearch1"
						 :placeholder="$t('Search by device ID')" style="width:100%;" id="serch1"></AutoComplete>
					</Col>
					<Col span='2'>
						<Button class="mr-10" type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
					</Col>
					<Col span='5'>
						<checkbox style="margin-top:10px" v-model="last" @on-change="search()">{{$t('Show the last order for each device')}}</checkbox>
					</Col>
					<Col span='4'>
						<Button type="default" icon="" @click="code()">
							{{$t('fault code')}}
						</Button>
					</Col>
				</Row>
			</Form>
		</div>
		<el-dialog :title='$t("tip")' :visible.sync="ctrl" width="30%">
			<img id='c' width="100%" src='' onerror="src='../../../static/miss.png'"></img>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="ctrl = false">{{$t('OK')}}</el-button>
			</span>
		</el-dialog>
		<el-dialog :title='$t("tip")' :visible.sync="door" width="30%">
			<img id='d' width="100%" src='' onerror="src='../../../static/miss.png'"></img>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="door = false">{{$t('OK')}}</el-button>
			</span>
		</el-dialog>
		<div style="min-height: 450px; margin-top: 20px;">
			<Table stripe class="mb-10" :columns="columns" :data="data" size="small"></Table>
		</div>
		<Col span='24' style="text-align: center;">
			<Page show-elevator :total="options.total" :page-size="options.num" :current="options.page" @on-change="pageChange"
			 show-total></Page>
		</Col>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				ctrl: false,
				door: false,
				last: true,
				color: [false, false, false, false, false, false],
				col: ['green', 'red', 'yellow', 'blue', 'gray', 'black'],
				menu: [],
				data: [],
				data2:[],
				counter:0,
				orders:this.global.functions.work_order,
				show: {
					state: 'untreated',
					type: 'all',
					device_type: 'all',
				},
				options: {
					search_info: '',
					page: 1,
					num: 10,
					isreg: "True",
					state: '',
					type: '',
					device_type: '',
					device_id: '',
					islast: 1,
				},
				columns: [{
						title: this.$t('device name'),
						width: 110,
						key: 'device_name'
					}, {
						title: 'IMEI(设备识别码)',
						width: 150,
						key: 'IMEI',
						sortable: true
					}, {
						title: this.$t('device type'),
						width: 110,
						key: 'device_type',
						render: (h, params) => {
							var type = ''
							if (params.row.device_type == "ctrl") type = this.$t('ctrl')
							if (params.row.device_type == "door") type = this.$t('door')
							return h('div', type)
						},
					}, {
						title: this.$t('maintenance type'),
						width: 140,
						key: 'device_type',
						render: (h, params) => {
							var type = ''
							if (params.row.type == "1") type = this.$t('fault')
							if (params.row.type == "2") type = this.$t('maintain')
							if (params.row.type == "3") type = this.$t('check')
							return h('div', type)
						}
					}, {
						title: this.$t('creator'),
						width: 95,
						key: 'producer',
						sortable: true
					}, {
						title: this.$t('fault code'),
						width: 100,
						key: 'type',
						render: (h, params) => {
							var type = ''
							var e = ''
							if ((params.row.type == '1') && (params.row.code != null)) {
								type = params.row.code.toString(16)
								if (type.length == 1) {
									type = '0' + type
								}
								e = 'E' + type
							}
							return h('div', [
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
											if (params.row.device_type == "ctrl") {
												setTimeout(() => {
													document.getElementById('c').src = '../../../static/c' + type + '.png'
												}, 200)
												this.ctrl = true
											}
											if (params.row.device_type == "door") {
												setTimeout(() => {
													document.getElementById('d').src = '../../../static/d' + type + '.png'
												}, 200)
												this.door = true
											}
										}
									}
								}, e)
							], )
						}
					}, {
						title: this.$t('state'),
						width: 90,
						key: 'state',
						render: (h, params) => {
							var state
							if (params.row.state == "treating") {
								state = this.$t('treating')
							}
							if (params.row.state == "untreated") {
								state = this.$t('untreated')
							}
							if (params.row.state == "treated") {
								state = this.$t('treated')
							}
							return h('div', state)
						}
					},
					{
						title: this.$t('install address'),
						key: 'install_addr'
					},
					{
						title: this.$t('create time'),
						key: 'createTime',
						render: (h, params) => {
							return h('p', this.$format(parseInt(params.row.createTime), 'YYYY-MM-DD HH:mm:ss'))
						}
					},
					{
						title: this.$t('handle'),
						width: 100,
						render: (h, params) => {
							var order
							if (params.row.state == "untreated") {
								order = this.$t('receive')
							}
							if (params.row.state == "treating") {
								order = this.$t('treating')
							}
							if (params.row.state == "treated") {
								order = this.$t('treated')
							}
							return h('div', [
								h('Button', {
									props: {
										type: 'primary',
										size: "small",
										disabled: ((params.row.state != 'untreated')||(this.orders != true)),
									},
									style: {
										marginRight: '10px',
									},
									on: {
										click: () => {
											this.$router.push({
												name: 'order',
												params: {
													id: params.row.id
												}
											})
										},
									}
								}, order),
							])
						}
					}
				],
			}
		},
		created() {
			this.getList()
		},
		methods: {
			handleSearch1() {
				this.menu = [];
				var str;
				for (var i = 0; i < this.list.length; i++) {
					str = this.list[i].device_id;
					if (str != null) {
						if (str.indexOf(this.options.search_info) >= 0)
							this.menu.push(str)
					}
				}
			},
			async getList() {
				if (this.show.state == "all") {
					this.options.state = ""
				} else {
					this.options.state = this.show.state
				}
				if (this.show.type == "all") {
					this.options.type = ""
				} else {
					this.options.type = this.show.type
				}
				if (this.show.device_type == "all") {
					this.options.device_type = ""
				} else {
					this.options.device_type = this.show.device_type
				}
				if (this.last) {
					this.options.islast = 1
				} else {
					this.options.islast = ''
				}
				this.loading = true
				this.counter = 0
				let res = await this.$api.fault(this.options)
				if (res.data.code === 0) {
					this.data2 = res.data.data.list
					this.options.total = res.data.data.totalNumber
					for (var i = 0; i < res.data.data.list.length; i++) {
						this.getname(i)
					}
				} else {
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('fail to get list')
					});
				}
			},
			async getname(val) {
					var ech = await this.$api.devices({
					device_id: this.data2[val].device_id,
					num: 1,
					page: 1
				})
				if (ech.data.data.list.length == 1) {
					this.data2[val].device_name = ech.data.data.list[0].device_name
					this.data2[val].IMEI = ech.data.data.list[0].IMEI
					this.data2[val].cell_address = ech.data.data.list[0].cell_address
					this.data2[val].ipaddr = ech.data.data.list[0].ip_country + ech.data.data.list[0].ip_region + ech.data.data.list[0].ip_city
					this.data2[val].install_addr = ech.data.data.list[0].install_addr
				}
				this.counter++
				if (this.counter == this.data2.length) {
					this.loading = false
					this.data=this.data2
					}
// 				ech = await this.$api.runtime({
// 					page: 1,
// 					num: 20,
// 					type: 8195,
// 					device_id: this.data[val].device_id
// 				})
			},
			pageChange(val) {
				this.options.page = val
				this.getList()
			},
			async search() {
				this.options.page = 1
				this.getList()
			},
			code() {
				this.$router.push({
					name: 'ctrlcode',
					params: {}
				})
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
			// 					order(val){
			// 						this.$Modal.confirm({
			// 							title: '确定要接单吗',
			// 							content:val.device_name,
			// 							onOk: () => {
			// 								this.toorder(val)
			// 							},
			// 							onCancel: () => {
			// 							}
			// 						})	
			// 					},
			async toorder(val) {
				let res = await this.$api.order({
					order_id: val.id
				})
				if (res.data.code == 0) {
					this.$Notice.success({
						title: this.$t('success'),
						desc: this.$t('receive the order successfully')
					});
					this.getList()
				} else {
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('fail to receive the order')
					});
				}
			}
		}

	}
</script>

<style lang="scss" scoped>
	.box-header {
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

	.click {
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

	.pagination {
		position: absolute;
		margin-left: 30%;
		margin-top: 3%;
	}

	.mr-10 {
		margin-left: 5px;
	}
</style>
