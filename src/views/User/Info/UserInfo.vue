<template lang="jade">
div.layout-content-main
	Tabs(value="name1",:animated="false",@on-click="Onchange")
		TabPane(label="基本信息",name="userInfo")
		TabPane(label="我的关注",name="followList")
		TabPane(label="我的维修",name="maintainList")
		TabPane(label="我的保养",name="upkeepList")
		TabPane(label="我的评估",name="assessList")
	div.form
		Row(:gutter="30")
			Col(span="16" style="padding-bottom:20px")
				Card()
					Row(:gutter="20")
						Col(span="12")
							p()|注册时间:2018-2-15			
				Card()
					p(slot="title")|公司
					Row(:gutter="20")
						Col(span="12")
							p()|公司名称:宁波申菱电梯配件有限公司
						Col(span="12")
							p()|公司地址:
				Card()
					p(slot="title")|群组
					Row(:gutter="30")
						Col(span="12")
							p()|群组类别:管理员用户
						Col(span="12")
							p()|群组名称:{{groupList.name}}
						Col(span="12" style="padding-top:20px")
							p()|群组负责人:{{groupList.contactor}}
						Col(span="12" style="padding-top:20px")
							p()|负责人电话: {{groupList.mobile}}	
			Col(span="8" style="padding-bottom:20px")
				Card(class="mgb20" style="height:252px;")
					div(class="user-info",align="center")
						img(src="../../../assets/admin.jpg",width="50%",style="border-radius:50%",align="center")
						div(class="user-info-cont")
							div( class="user-info-name")|{{options.username}}
							div()|{{role}}
							div()|宁波申菱
							div()|0574-65983333
</template>

<script>
export default {
	data() {
		const type= {
		15: '控制器',
		240: '控制柜',
		};
		return {		
			options: {
				page: 1,
				num: 10,
				total: 0,
				id:window.localStorage.getItem('id'),
				username:'',
				typeId:'',
			},
			loading: false,
			columns: [
			{
				title: '设备类型',
				key: 'typeId',
				render: (h, params) => {
					return h('p',type[params.row.typeId]||'')
				}
			}],
			groupList:[],
			peoList:[],
		}
	},
	computed: {
		role() {
			return this.options.username === 'admin' ? '超级管理员' : '普通用户';
		}
	},
	created(){
		this.getData()		
	},
	methods: {
		async getData() {
			let res = await this.$api.user({id:this.options.id})	
			this.options = res.data.data.list[0]
			let peo = await this.$api.people({userId:this.options.id})
			this.peoList = peo.data.data.list[0]
			let gro = await this.$api.team({groupId:this.peoList.groupId})
			this.groupList = gro.data.data.list[0]
		},
		Onchange: function(val) {
			this.$router.push({
				name: val,
			})
		}
	}
}
</script>

<style lang="css">
	.mgb20 {
		margin-bottom: 20px;
	}
	.user-info-cont {
		padding-left: 50px;
		flex: 1;
		font-size: 14px;
		color: #999;
	}
	.user-info {
		display: flex;
		align-items: center;
		padding-bottom: 20px;
		border-bottom: 2px solid #ccc;
		margin-bottom: 20px;
	}
</style>
