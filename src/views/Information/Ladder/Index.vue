<template lang="jade">
	div
		Form.imr(ref="form" label-position="left" ,:label-width="100" @keydown.enter.native.prevent="search()")
			Row(:gutter=5)
				Col(span='2')
					Select.smr(v-model="show.state" style="width:100%;", :placeholder="$t('state')" @on-change="search()")
						Option(key="1", :label="$t('all')" value="all")
						Option(key="2", :label="$t('online')" value="online")
						Option(key="3", :label="$t('offline')" value="offline")
						Option(key="4", :label="$t('long offline')" value="longoffline")
				Col(span=4)
					AutoComplete.handle-input(v-model="options.search_info" ,:data="menu" @on-search="handleSearch1"
					 :placeholder="$t('keyword')" style="width:100%;" id="serch1")
				Col( span=2)
					Input( v-model="options.install_addr", :placeholder="$t('install address')" max=10)
				Col( span='10')
					Button(type="primary" icon="ios-search" @click="search()")|{{$t('search')}}
					Button.mr-10(type="success",icon="md-add",:loading="loading",@click="goLadder()")|{{$t('new elevator')}}
		div( style="min-height: 450px; margin-top: 5px;")
			Table.mb-10( stripe :columns="columns" ,:data="list" size="small")
		Col( span="24" style="text-align: center;")
			Page( show-elevator :total="total" ,:page-size="options.num" ,:current="options.page" @on-change="pageChange"
			 show-total)
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
				menu: [],
				follow: [],
				list:[],
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
				loading: false,
				columns: [
					{
						title: this.$t('ladder name'),
						width: 120,
						key: 'name',
					},
					{
						title: this.$t('ctrl'),
						key: 'ctrl',
					},
					{
						title: this.$t('door'),
						key: 'door1',
					},
					{
						title: this.$t('door'),
						key: 'door2',
					},
					{
						title: this.$t('IP location'),
						key: 'ipaddr',
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
					{
						title: this.$t('handle'),
						width:280,
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
											if (follow == this.$t('follow')){
												this.addfl(params.row.ctrl,params.row.door1,params.row.door2)
											}else if(follow == this.$t('remove follow')){
												this.delfl(params.row.id)
											}
										},
									}
								}, follow),
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
												name: 'editladder',
												params: {
													id: params.row.id
												}
											})
										},
									}
								}, this.$t('watch')+'/'+this.$t('edit')),
								h('Button', {
									props: {
										type: 'error',
										size: "small",
									},
									style: {
										marginRight: '10px',
									},
									on: {
										click: () => {
											this.remLadder(params.row.id)
											this.getList()
										},
									}
								}, this.$t('delete')),
							])
						}
					}
				],
				refreshNum: 0,
				data: [],
				query:{
					state:"online",
					page: 1,
					num: 10,
				},
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
				if(this.show.state == 'all'){
					this.query.state = ''
				}else{
					this.query.state = this.show.state
				}
				let res = await this.$api.reLadder(this.query)
				let fol = await this.$api.followladder({
					num: 100,
					page: 1
				})
				this.loading = false
				if (fol.data.code == 0) {
					this.follow = fol.data.data.list
				}
				this.list = res.data.data.list
				this.total = res.data.data.totalNumber
			},
			async search() {
				this.options.page = 1
				this.getList()
			},
			async addfl(val,item,inx){
				const res = await this.$api.newfollow({
					ctrl:val,
					door1:item,
					door2:inx,
				})
				if(res.data.code==0){
					this.$Notice.success({
						title: this.$t('success'),
						desc: ''
					});
				}else{
					this.$Notice.error({
						title: this.$t('error'),
						desc: ''
					});
				}
			},
			Onchange: function(val) {
				this.$router.push({
					name: val,
				})
			},
			async remLadder(val) {
				this.$Modal.confirm({
					title: this.$t('delete'),
					content:this.$t('Make sure you want to delete this item？'),
					onOk: () => {
						let res = this.$api.removeLadder({
							ladder_id: val
						})
						if(res.data.code==0){
							this.$Notice.success({
								title: this.$t('success'),
								desc: ''
							});
						}else{
							this.$Notice.error({
								title: this.$t('error'),
								desc: ''
							});
						}
					},
					onCancel: () => {
					}
				})
				setTimeout(()=>{
					this.getList()
				},500)
			},
			goLadder(){
				this.$router.push({
					name: 'addladder',
				})
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
