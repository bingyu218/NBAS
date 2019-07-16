<template lang="jade">
	div
		div.box
			div.box-header.with-border
				p.box-title {{$t('new elevator')}}
			form.form-horizontal
				div.box-body
					Row(:gutter="10")
						Col(span="8")
							Card
								div.form-group
									Card()
										p(slot="title")|{{$t('Basic Information')}}
										Form(:label-width="120")
											Row(:gutter="5")
												Col(span="20")
													Form-item(:label="$t('device name')+':'")
														Input(type='text', v-model="ladder.name")
													Form-item(:label="$t('install address')+':'")
														Input(type='text', v-model="ladder.install_addr")
								div.form-group
									Card
										p(slot="title")|{{$t('Device Binding')}}
										Row(:gutter=5)
											Col(span=6)
												Button(type="primary" @click='getList("240")')|{{$t('ctrl')}}
											Col(span=10)
												Input(type='text' v-model='ladder.ctrl', :placeholder="$t('ctrl')+'IMEI'" disabled)
											Col(span=6)
												Button(type="error" @click='remove(1)')|{{$t('delete')}}
										Row.mt-1(:gutter=5)
											Col(span=6)
												Button(type="primary"  @click='getList("15")')|{{$t('door')}}
											Col(span=10)
												Input(type='text' v-model='ladder.door1', :placeholder="$t('door')+'IMEI'" disabled)
											Col(span=6)
												Button(type="error" @click='remove(2)')|{{$t('delete')}}
										Row.mt-1(:gutter=5)
											Col(span=6)
												Button(type="primary"  @click='getList("15")')|{{$t('door')}}
											Col(span=10)
												Input(type='text' v-model='ladder.door2', :placeholder="$t('door')+'IMEI'" disabled)
											Col(span=6)
												Button(type="error" @click='remove(3)')|{{$t('delete')}}
								div.form-group
									Card
										Button(@click='NewLadder()' type='success')|{{$t('OK')}}
										Button.ml-5(@click="$router.back(-1)")|{{$t('cancel')}}
						Col(span="16")
							Card()
								Row
									Row(:gutter=5)
										Col(span=3)
											Select.smr(v-model="show.state" style="width:100%", :placeholder="$t('state')" @on-change="getList()")
												Option(key="1", :label="$t('all')" value='all')
												Option(key="2", :label="$t('online')" value="online")
												Option(key="3", :label="$t('offline')" value="offline")
												Option(key="4", :label="$t('long offline')" value="longoffline")
										Col(span=6)
											AutoComplete(name="inpSer" v-model="query.search_info", :placeholder="$t('keyword')" max=15 style="width:100%" class="handle-input mr10" id="serch1")
										Col(span=4)
											Input(v-model="query.install_addr", :placeholder="$t('install address')" max=10)
										Col(span=10)
											Button.mr-10(type="primary",icon="ios-search",@click="search()" style="margin-left:1px")|{{$t('search')}}
									div.ssa
										Table(:columns="columns",:data="list",size="small" stripe)
									Col(span='24' style="text-align:center;")
										Page(show-elevator :total="options.total",:page-size="options.num",:current="query.page",@on-change="pageChange",show-total)
						
</template>

<script>
	export default {
		data () {
			const type = {
				15: this.$t('door'),
				240: this.$t('ctrl'),
			};
			const model = {
				'online': this.$t('online'),
				'offline': this.$t('offline'),
				'longoffline': this.$t('long offline'),
			};
			return {
				list: [],
				show:{
					state: 'online',
				},
				query:{
					search_info: '',
					page: 1,
					num: 10,
					isreg: "True",
					state: 'online',
					device_type:"240",
					register: "registered",	
					install_addr:'',
				},
				columns: [
					{
						title: this.$t('device name'),
						key: 'device_name',
						align:'left',
					},
					{
						title: 'IMEI(设备识别码)',
						key: 'IMEI',
					},
					{
						title: this.$t('device type'),
						key: 'device_type',
						render: (h, params) => {
							return h('p', type[params.row.device_type] || '-')
						}
					},
					{
						title: this.$t('state'),
						key: 'state',
						render: (h, params) => {
							return h('p',model[params.row.state]||'')
						}
					},
					{
						title: this.$t('handle'),
						key: 'companyName',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('Button', {
									props: {
										type: 'success',
										size: 'small'
									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											if(this.query.device_type == "240"){
												this.ladder.ctrl = params.row.IMEI
											}else if(this.query.device_type != "240" && this.ladder.door1==null){
												this.ladder.door1 = params.row.IMEI
											}else if(this.ladder.door1 != ''){
												this.ladder.door2 = params.row.IMEI
											}
										}
									}
								}, this.$t('select')),
							]);
						}
					}
				],
				options: {
					name:'',
					page: 1,
					num: 10,
					total: 0,
					isreg: "True",
					model:'login',
					register: "registered",
				},
				ladder:{
					name:'',
					ctrl:null,
					door1:null,
					door2:null,
					install_addr:'',
				},
			}
		},
		created() {
			if(this.$route.params.type == 240){
				this.ladder.ctrl = this.$route.params.IMEI
			}else if(this.$route.params.type == 15){
				this.ladder.door1 = this.$route.params.IMEI
			}
			this.getList("240")
		},
		methods: {
			search() {
				this.options.page = 1
				this.getList()
			},
			async getList(item) {
				if(item!=null){
					this.query.device_type= item
				}
				if(this.show.state != "all"){
					this.query.state = this.show.state
				}else{
					this.query.state = ''
				}
				let res = await this.$api.devices(this.query);
				this.list=res.data.data.list;
				this.options.total = res.data.data.totalNumber
			},
			goRole(){
				this.$router.push({
					name: 'editrole',
				})
			},
			remove(item){
				if(item==1){
					this.ladder.ctrl = null
				}else if(item == 2){
					this.ladder.door1 = null
				}else if(item == 3){
					this.ladder.door2 = null
				}
			},
			pageChange(val) {
				this.query.page = val
				this.getList()
			},
			async NewLadder(){
				let res = await this.$api.newLadder(this.ladder);
				if (res.data.code == 0) {
					this.$Notice.success({
						title: this.$t('success'),
						desc: this.$t('successfully bind,it will show in ladder list')
					});
					this.$router.back(-1)
				}else{
					this.$Notice.error({
						title: this.$t('error'),
						desc: this.$t('fail to bind')
					});
				}
			},
		}
	}
</script>

<style lang="css">
	.content{
		overflow: auto;
	}
	.lp{
		margin-right: 5px;
	}
	.layout-content-main{
		overflow-y: scroll !important;
	}
	.ssa{
		margin-top: 5px;
		min-height: 450px;
	}
</style>
