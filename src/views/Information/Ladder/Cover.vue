<template lang="jade">
	div
		div.box
			div.box-header.with-border
				p.box-title {{$t('add to existing elevator')}}
			div.form
				Row(:gutter="30")
					Col(span="8")
						Card()
							p(slot="title")|{{$t('Basic Information')}}
							Form(:label-width="120")
								Row(:gutter="5")
									Col(span="20")
										Form-item(:label="$t('device name')+':'")
											Input(type='text', v-model="ladder.name" disabled)
										Form-item(:label="$t('install address')+':'")
											Input(type='text', v-model="ladder.install_addr" disabled)
						Card(style="margin-top:10px;")
							p(slot="title")|{{$t('Device Replace')}}
							Form(:label-width="120")
								Row(:gutter="5")
									Col(span="20")
										Form-item(:label="$t('Please select the equipment to replace')")
							Row(:gutter=5)
								Col(span=6 offset=3)
									Button(type="primary" @click='cover(1)')|{{$t('ctrl')}}
								Col(span=10)
									Input(type='text' v-model='ladder.ctrl', :placeholder="$t('ctrl')+'IMEI'" disabled)
							Row.mt-1(:gutter=5)
								Col(span=6 offset=3)
									Button(type="primary"  @click='cover(2)')|{{$t('door')}}
								Col(span=10)
									Input(type='text' v-model='ladder.door1', :placeholder="$t('door')+'IMEI'" disabled)
							Row.mt-1(:gutter=5)
								Col(span=6 offset=3)
									Button(type="primary"  @click='cover(3)')|{{$t('door')}}
								Col(span=10)
									Input(type='text' v-model='ladder.door2', :placeholder="$t('door')+'IMEI'" disabled)
							Row.mt-1(:gutter=5 style="text-align:center")
									Button(@click='updateLadder()' type='success')|{{$t('OK')}}
									Button.ml-5(@click="$router.back(-1)")|{{$t('cancel')}}
					Col(span="16")
						Card()
							Row
								Row(:gutter=5)
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
			return {
				list: [],
				show:{
					state: 'online',
				},
				query:{
					search_info: '',
					page: 1,
					num: 10,
				},
				columns: [
					{
						title: this.$t('device name'),
						key: 'name',
                        fixed: 'left',
                        width: 100,
					},
					{
						title: this.$t('ctrl'),
						key: 'ctrl',
                        width: 150,
					},
					{
						title: this.$t('door'),
						key: 'door1',
                        width: 150,
					},
					{
						title: this.$t('door'),
						key: 'door2',
                        width: 150,
					},
					{
						title: this.$t('install address'),
						key: 'install_addr',
                        width: 200,
					},
					{
						title: this.$t('handle'),
						key: 'companyName',
						align: 'center',
                        width: 100,
                        fixed: 'right',
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
											this.ladder.id = params.row.id
											this.ladder.name = params.row.name
											this.ladder.install_addr = params.row.install_addr
											this.ladder.ctrl = params.row.ctrl
											this.ladder.door1 = params.row.door1
											this.ladder.door2 = params.row.door2
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
					id:0,
					name:'',
					ctrl:'',
					door1:'',
					door2:'',
					install_addr:'',
					type:'',
				},
				save:{
					ladder_id:0,
					name:'',
					IMEI:'',
					install_addr:'',
					type:'',
				},
				coverladder:'',
			}
		},
		created() {
			this.getList()
		},
		methods: {
			async getList() {
				let res = await this.$api.readLadder(this.query);
				this.list=res.data.data.list;
				this.options.total = res.data.data.totalNumber
			},
			cover(item){
				const i =  this.$route.params.IMEI
				if(item == 1){
					this.coverladder = this.ladder.ctrl
					this.ladder.type = item
				}else if(item == 2){
					this.coverladder = this.ladder.door1
					this.ladder.type = item
				}else if(item == 3){
					this.coverladder = this.ladder.door2
					this.ladder.type = item
				}
				this.$Modal.confirm({
					title: this.$t('Device Replace'),
					content: this.$t('Are you sure replace ')+this.coverladder+this.$t(' with ')+i,
					onOk: () => {
						if(item == 1){
							this.ladder.ctrl = i
						}else if(item == 2){
							this.ladder.door1 = i
						}else if(item == 3){
							this.ladder.door2 = i
						}
					},
					onCancel: () => {
					}
				})
			},
			pageChange(val) {
				this.query.page = val
				this.getList()
			},
			async updateLadder(){
				this.save.ladder_id = this.ladder.id
				this.save.IMEI = this.$route.params.IMEI
				this.save.name = this.ladder.name
				this.save.install_addr = this.ladder.install_addr
				this.save.type = this.ladder.type
				let res = await this.$api.updateLadder(this.save);
				if (res.data.code == 0) {
					this.$Notice.success({
						title: this.$t('success'),
						desc: ''
					});
					this.$router.back(-1)
				}else{
					this.$Notice.error({
					title: this.$t('error'),
					desc: ''
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
