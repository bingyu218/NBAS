<template lang="jade">
	div
		div.box
			div.box-header.with-border
				p.box-title {{$t('Edit elevator')}}
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
						div.form-group
							Card()
								p(slot="title")|{{$t('Device Binding')}}
								Row(:gutter=5)
									Col(span=6 offset=3)
										Button(type="primary")|{{$t('ctrl')}}
									Col(span=10)
										Input(type='text' v-model='ladder.ctrl', :placeholder="$t('ctrl')+'IMEI'" disabled)
								Row.mt-1(:gutter=5)
									Col(span=6 offset=3)
										Button(type="primary")|{{$t('door')}}
									Col(span=10)
										Input(type='text' v-model='ladder.door1', :placeholder="$t('door')+'IMEI'" disabled)
								Row.mt-1(:gutter=5)
									Col(span=6 offset=3)
										Button(type="primary")|{{$t('door')}}
									Col(span=10)
										Input(type='text' v-model='ladder.door2', :placeholder="$t('door')+'IMEI'" disabled)
								Row.mt-1(:gutter=5 style="text-align:center")
										Button(@click='updateLadder()' type='success')|{{$t('OK')}}
										Button.ml-5(@click="$router.back(-1)")|{{$t('cancel')}}
						
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
					install_addr:'',
				},
				save:{
					ladder_id:0,
					name:'',
					install_addr:'',
				},
			}
		},
		created() {
			this.getData()
		},
		methods: {
			async getData() {
				let res = await this.$api.reLadder({
					id:this.$route.params.id
				});
				this.ladder=res.data.data.list[0];
			},
			async updateLadder(){
				this.save.ladder_id = this.ladder.id
				this.save.name = this.ladder.name
				this.save.install_addr = this.ladder.install_addr
				let res = await this.$api.updateLadder(this.save);
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
