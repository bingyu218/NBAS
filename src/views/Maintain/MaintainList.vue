<template>
	<div class="layout-content-main">
		<div>
		<Form class="imr" ref="form" label-position="left" :label-width="100">
		  <Row :gutter="5">
				<Col span='3'>
					<Select class="smr" v-model="show.state" style="width:100%;" :placeholder="$t('state')" @on-change="search()">
						<Option key="1" :label="$t('all')" value="all"></Option>
						<Option key="2" :label="$t('reprieve')" value="reprieve"></Option>
						<Option key="3" :label="$t('treating')" value="untreated"></Option>
						<Option key="4" :label="$t('examine finished')" value="examined"></Option>
						<Option key="5" :label="$t('finished')" value="treated"></Option>
					</Select>
				</Col>
				<Col span='3'>
					<Select class="smr" v-model="show.order_type" style="width:100%;" :placeholder="$t('maintenance type')" @on-change="search()">
						<Option key="1" :label="$t('all')" value="all"></Option>
						<Option key="2" :label="$t('fault')" value="1"></Option>
						<Option key="3" :label="$t('maintain')" value="2"></Option>
						<Option key="4" :label="$t('check')" value="3"></Option>
					</Select>
				</Col>
				<Col span='2'>
				</Col>
				<Col span='4'>
					<AutoComplete class="handle-input mr10" v-model="options.device_id" :data="menu" @on-search="handleSearch1" :placeholder="$t('Search by device ID')" style="width:100%;" id="serch1"></AutoComplete>
				</Col>
				<Col span='1'>
					<Button class="mr-10" type="primary" icon="ios-search" @click="search()">{{$t('search')}}</Button>
				</Col>
		  </Row>
		</Form>
		</div>
		<div style="min-height: 450px; margin-top: 20px;">
			<Table stripe class="mb-10" :columns="columns" :data="data" size="small"></Table>
		</div>
		<Col span='24' style="text-align: center;">
		<Page  show-elevator :total="options.total" :page-size="options.num" :current="options.page" @on-change="pageChange" show-total></Page>	  
		</Col>
	</div>
</template>

<script>
	export default {
		data() {
			return{
				username:window.localStorage.getItem('username'),
				color:[false,false,false,false,false,false],
				col:['green','red','yellow','blue','gray','black'],
				menu:[],
				data:[],
				data2:[],
				counter:0,
				show:{
					state:'untreated',
					order_type:'all',
				},
				options:{
					search_info: '',
					page: 1,
					num: 10,
					isreg: "True",
					state:'untreated',
					order_type:'',
					result:'',
					device_id:'',
				},
				columns: [ {
					title: this.$t('order ID'),
					key: 'order_id',
					width:90,
				},
				{
					title: this.$t('device name'),
					key: 'device_name',
					width:120,
				},
				{
					title: 'IMEI(设备识别码)',
					key: 'IMEI',
					width:150,
					sortable: true
				},
				{
					title: this.$t('state'),
					key: 'state',
					width:80,
					render: (h, params) => {
						var state
						if (params.row.state == "treated") {state = this.$t('finished')}
						if (params.row.state == "untreated") {state = this.$t('treating')}
						return h('div', state)
					}
				},
				{
					title: this.$t('phone'),
					key: 'phone',
					width: 140,
				},
				{
					title: this.$t('install address'),
					key: 'install_addr',

				},
// 				{
// 				title: '基站定位',
// 				// width: 260,
// 				key: 'cell_address',
// 				render: (h,params) => {
// 				var addr= params.row.cell_address
// 				if (params.row.cell_address !=null) {
// 				if(params.row.cell_address.length>=38){
// 					addr=item.cell_address.substring(0,38)+"…"
// 				}
// 				}
// 				return  h('Poptip',{
// 						props: {
// 							trigger:"hover",										
// 							placement:"top-start",
// 							content:params.row.cell_address
// 						},
// 					},addr)
// 				}
// 				},
				{
					title: this.$t('accept time'),
					key: 'create_time',
					width:150,
					render: (h, params) => {
						return h('p',this.$format(parseInt(params.row.create_time), 'YYYY-MM-DD HH:mm:ss'))
					}
				},
				{
					title: this.$t('finish time'),
					key: 'finish_time',
					width:170,
					render: (h, params) => {
						var time=''
						var color='#000'
						if (params.row.expect_time != null){
							time='预计 ' + this.$format(parseInt(params.row.expect_time), 'YYYY-MM-DD HH:mm:ss')
							if (parseInt(params.row.expect_time)+86400000<Date.parse(new Date())){color='#f00'}
							}
						if (params.row.finish_time != null){time=this.$format(parseInt(params.row.finish_time), 'YYYY-MM-DD HH:mm:ss');color="#000"}
						return h('div',{style:{color: color}},time)
					}
				},
				{
					title: this.$t('handle'),
					key: 'companyName',
					width: 115,
					align: 'center',
					render: (h, params) => {
						var state
						if (params.row.state == "treated") {state = this.$t('treated')}
						if (params.row.state == "untreated") {state = this.$t('finish')}
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									size: 'small',
									// disabled: (params.row.state == "treated"),
								},			
								on: {
									click: () => {
											this.$router.push({
												name: 'finish',
												params: {
													id: params.row.id										
												}
											})
// 										this.$Modal.confirm({
// 											title: '是否完成？',
// 											content: '<p>请确保设备功能恢复正常</p>',
// 											onOk: () => {
// 												params.row.state="treated"
// 												state='已修复'
// 												this.finish(params.row)											
// 											},
// 											onCancel: () => {
// 											}
// 										})
									}
								}
							}, this.$t('watch')+'/'+this.$t('confirm'))
						]);
					}
				}
				],
			}
			
		},
		created() {
			this.getList()
		},
		methods: {
			handleSearch1 (selectword) {
				this.menu=[];
				var str;
					for (var i=0;i<this.list.length;i++){
						str=this.list[i].device_id;
						if (str != null){
							if (str.indexOf(selectword)>=0)
							this.menu.push(str)
						}
					}
			},
			async finish(val) {
				let res = await this.$api.finish({id:val.id,result:'finish'})
				if (res.data.code == 0){
					this.$Notice.success({
						title: '成功',
						desc: '完成工单'
					});
					this.getList()
				}
				else{
					this.$Notice.error({
						title: '错误',
						desc: '发生错误'
					});
					this.getList()
				}
			},
			async getList() {
				this.loading = true
				if(this.show.state == "all"){
					this.options.state = ""
				}else{
					this.options.state = this.show.state
				}
				if(this.show.order_type == "all"){
					this.options.order_type=""
				}else{
					this.options.order_type = this.show.order_type
				}
				this.counter=0
				let res = await this.$api.getRepair(this.options)
				this.data2 = res.data.data.list
				this.options.total = res.data.data.totalNumber
				if (res.data.code === 0) {
					for (var i=0;i<res.data.data.list.length;i++) {
						this.getname(i)
					}
				} else {
					this.$Notice.error({
						title: '错误',
						desc: '获取列表失败'
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
			async checkcolor(c) {
				this.color[c]=!this.color[c]
				if (this.color[c]) {
					document.getElementById(this.col[c]).className="fa fa-bookmark fa-2x"
				}
				else {
					document.getElementById(this.col[c]).className="fa fa-tag fa-2x"
				}
				this.options.tagcolor=''
				for (var i=0;i<6;i++) {
				if (this.color[i]) {
					if (this.options.tagcolor!='') {
						this.options.tagcolor=this.options.tagcolor+';'
						}
					this.options.tagcolor=this.options.tagcolor+this.col[i]
				}
				}
				this.search()
			},
			handleUpload (file) {
				var type = file.name.split('.')
				if ((type[1] == 'png')||(type[1] == 'gif')||(type[1] == 'jpg')){
				this.file = file;
				this.filename = this.file.name;
				this.upsuccess = true;
				// document.getElementById('image').src=this.file;
				this.confirm()
				return false;
				}
				else{
					this.$Notice.warning({
						title: '警告',
						desc: '只能上传图片类型的文件'
					})
				}
			},
			async confirm(){
				var formData = new FormData()
				var formData = new window.FormData()
				formData.append('file',this.file)
				let res = await this.$api.portrait(formData)
				if (res.data.code == 0){
				this.upsuccess=false
				this.$Notice.success({
					title: '成功',
					desc: ('成功上传'+this.filename)
				})
				this.filename='已上传'+this.filename
				}
				else{
					this.$Notice.error({
						title: '错误',
						desc: '上传失败'
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
	.pagination {
	position: absolute;
	margin-left: 30%;
	margin-top: 3%;
	}
</style>
