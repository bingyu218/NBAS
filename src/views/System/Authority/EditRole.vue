<template lang="jade">
	div.layout-content-main
		div.box
			div.box-header.with-border
				p.box-title 编辑角色信息
			form.form-horizontal
				div.box-body
					Row(:gutter="10")
						Col(span="8")
							Card
								div.form-group
									Card()
										p(slot="title")|角色名称
										div.col-sm-8.col-md-6
											Input(type='text'  v-model="roleList.name" placeholder='请输入角色名称' disabled)
								div.form-group
									Card
										p(slot="title")|菜单名称
										Tree(ref="tree" ,:data='menus' show-checkbox)
						Col(span="16")
							Card()
								p(slot="title")|可执行功能
								div()
									Checkbox(v-model="show.monitor")|实时监控
									Checkbox(v-model="show.memory")|内存查看
									Checkbox(v-model="show.work_audt")|订单审核
									Checkbox(v-model="show.work_order")|接单
									Checkbox(v-model="show.work_dispatch")|提交工单
									Checkbox(v-model="show.work_up")|发起工单
									Checkbox(v-model="show.update_devices")|编辑设备信息
									Checkbox(v-model="show.rem_devices")|重置设备信息
									Checkbox(v-model="show.info_evelution")|固件更新
									Checkbox(v-model="show.new_ladder")|新建电梯
									Checkbox(v-model="show.rem_ladder")|删除电梯
									Checkbox(v-model="show.update_ladder")|编辑电梯
									Checkbox(v-model="show.new_user")|新建用户
									Checkbox(v-model="show.update_user")|编辑用户
									Checkbox(v-model="show.rem_user")|删除用户
									Checkbox(v-model="show.new_roles")|新建角色
									Checkbox(v-model="show.rem_roles")|删除角色
									Checkbox(v-model="show.update_roles")|编辑角色
									Checkbox(v-model="show.assign_roles")|分配角色
									Checkbox(v-model="show.print")|打印二维码
				div.box-footer
					div.col-sm-offset-2
						Button(@click='submit()', type='success' v-if="uprole != true" disabled="false")|编辑
						Button(@click='submit()', type='success' v-else)|编辑
						Button.ml-5(@click='delRoles()', type='error' v-if="delrole != true" disabled="false")|删除
						Button.ml-5(@click='delRoles()', type='error' v-else)|删除
						Button.ml-5(@click="$router.back(-1)")|返回
</template>

<script>
	export default {
		data () {
			return {
				menu:[{
					id: 0,
					pId: 0,
					label: 'Dashboard',
					key:false,
					val:0,
				},{
					id: 1,
					pId: 0,
					label: '运行监控',
					key:false,
					val:1,
					sub: [{
						id: 11,
						pId: 1,
						label: '运行状态',
						key:false,
						val:2,
					}, {
						id: 12,
						pId: 1,
						label: '电梯状态',
						key:false,
						val:3,
					}, 
		// 			{
		// 				id: 13,
		// 				pId: 1,
		// 				label: '更新状态',
		// 				val:2,
		// 			},
					]
				}, {
					id: 2,
					pId: 0,
					label: '工作流',
					key:false,
					val:4,
					sub: [{
						id: 21,
						pId: 2,
						label: '审核列表',
						key:false,
						val:5,
					}, {
						id: 22,
						pId: 2,
						label: '工单列表',
						key:false,
						val:6,
					},
					{
						id: 23,
						pId: 2,
						label: '维保信息',
						key:false,
						val:7,
					}],
				}, {
					id: 3,
					pId: 0,
					label: '基础信息维护',
					key:false,
					val:8,
					sub: [{
						id: 31,
						pId: 3,
						label: '设备信息',
						key:false,
						val:9,
					},{
						id: 32,
						pId: 3,
						label: '固件更新',
						key:false,
						val:10,
					},{
						id: 33,
						pId: 3,
						label: '电梯信息',
						key:false,
						val:11,
					}],
				}, {
					id: 4,
					pId: 0,
					label: '系统管理',
					key:false,
					val:12,
					sub: [{
						id: 41,
						pId: 4,
						label: '用户管理',
						key:false,
						val:13,
					}, {
						id: 42,
						pId: 4,
						label: '通知记录',
						key:false,
						val:14,
					}, {
						id: 43,
						pId: 4,
						label: '说明文档',
						key:true,
						val:15,
					}, {
						id: 44,
						pId: 4,
						label: '权限管理',
						key:false,
						val:16,
					}]
				}, {
					id: 5,
					pId: 0,
					label: '出厂设置',
					key:false,
					val:17,
					sub: [{
						id: 51,
						pId: 5,
						label: '打印二维码',
						key:false,
						val:18,
					}]
				}],
				menus:[],
				list:{
					id:this.$route.params.id,
					name:'',
					dashboard:0,
					menu:0,
					map:0,
					laddermap:0,
					maintain:0,
					auditinglist:0,
					maintainlist:0,
					event:0,
					allist:0,
					evolution:0,
					ladder:0,
					sys:0,
					user_manage:0,
					inform:0,
					authority:0,
					setting:0,
					print:0,
				},
				show:{
					name:'',
					monitor:0,
					memory:0,
					work_audt:0,
					work_order:0,
					work_up:0,
					work_dispatch:0,
					update_devices:0,
					rem_devices:0,
					info_evelution:0,
					new_ladder:0,
					rem_ladder:0,
					update_ladder:0,
					new_user:0,
					update_user:0,
					rem_user:0,
					new_roles:0,
					rem_roles:0,
					update_roles:0,
					assign_roles:0,
					print:0,
				},
				fun:{
					id:this.$route.params.id,
					name:'',
					monitor:0,
					memory:0,
					work_audt:0,
					work_order:0,
					work_up:0,
					work_dispatch:0,
					update_devices:0,
					rem_devices:0,
					info_evelution:0,
					new_ladder:0,
					rem_ladder:0,
					update_ladder:0,
					new_user:0,
					update_user:0,
					rem_user:0,
					new_roles:0,
					rem_roles:0,
					update_roles:0,
					assign_roles:0,
					print:0,
				},
				options: {
					page: 1,
					num: 10,
					id:'',
				},
				roleList:{},
				menuList:{},
				functionList:{},
				delrole:this.global.functions.rem_roles,
				uprole:this.global.functions.update_roles,
			}
		},
		created() {
			this.options.id = this.$route.params.id
			this.getRole()
		},
		methods: {
			checkedMenu(){
				if(this.menuList.dashboard == true){
					this.menu[0].key = true
				}
				if(this.menuList.menu == true){
					this.menu[1].key = true
				}
				if(this.menuList.map == true){
					this.menu[1].sub[0].key = true
				}
				if(this.menuList.laddermap == true){
					this.menu[1].sub[1].key = true
				}
				if(this.menuList.auditinglist == true){
					this.menu[2].sub[0].key = true
				}
				if(this.menuList.maintain == true){
					this.menu[2].sub[1].key = true
				}
				if(this.menuList.maintainlist == true){
					this.menu[2].sub[2].key = true
				}
				if(this.menuList.allist == true){
					this.menu[3].sub[0].key = true
				}
				if(this.menuList.evolution == true){
					this.menu[3].sub[1].key = true
				}
				if(this.menuList.ladder == true){
					this.menu[3].sub[2].key = true
				}
				if(this.menuList.user_manage == true){
					this.menu[4].sub[0].key = true
				}
				if(this.menuList.inform == true){
					this.menu[4].sub[1].key = true
				}
				if(this.menuList.authority == true){
					this.menu[4].sub[3].key = true
				}
				if(this.menuList.print == true){
					this.menu[5].sub[0].key = true
				}
				
			},
			getMenus(){
				let nodes = []
				let child = []
				this.menu.forEach(item => {
					nodes.push({
						id: item.id,
						pId: item.pId,
						title: item.label,
						key: item.key,
						val:item.val,
					})
					if(item.sub){
						item.sub.forEach(sub => {
							child.push({
								id: sub.id,
								pId: sub.pId,
								title: sub.label,
								key: sub.key,
								val:sub.val,
							})
						})
					}
				})
				nodes.forEach((item,index)=>{
					if(item.key == true){
						let menus = []
						menus.title = item.title
						menus.val = item.val
						menus.expend = true
						menus.checked = true
						menus.children = []
						child.forEach(res=>{
							if(res.pId==item.id){
								if(res.key == true){
									menus.children.push({
										title:	res.title,
										val:	res.val,
										checked: true,
									})
								}else{
									menus.children.push({
										title:	res.title,
										val:	res.val,
									})
								}
							}
						})
						this.menus.push(menus)
					}else{
						let menus = []
						menus.title = item.title
						menus.val = item.val
						menus.expend = true
						menus.children = []
						child.forEach(res=>{
							if(res.pId==item.id){
								if(res.key == true){
									menus.children.push({
										title:	res.title,
										val:	res.val,
										checked: true,
									})
								}else{
									menus.children.push({
										title:	res.title,
										val:	res.val,
									})
								}
							}
						})
						this.menus.push(menus)
					}
				})
			},
			goRole(val){
				this.$router.push({
					name: 'editrole',
					params: {
						id: val,
					}
				})
			},
			async submit(){
				this.fun.name = this.roleList.name
				this.list.name = this.roleList.name
				const fun = this.show
				const menus = this.$refs.tree.getCheckedNodes()
				menus.forEach((item)=>{
					if(item.val==0){
						this.list.dashboard = 1
					}else if(item.val==1){
						this.list.menu = 1
					}else if(item.val==2){
						this.list.map = 1
					}else if(item.val==3){
						this.list.laddermap = 1
					}else if(item.val==6){
						this.list.maintain = 1
					}else if(item.val==5){
						this.list.auditinglist = 1
					}else if(item.val==7){
						this.list.maintainlist = 1
					}else if(item.val==8){
						this.list.event = 1
					}else if(item.val==9){
						this.list.allist = 1
					}else if(item.val==10){
						this.list.evolution = 1
					}else if(item.val==11){
						this.list.ladder = 1
					}else if(item.val==12){
						this.list.sys = 1
					}else if(item.val==13){
						this.list.user_manage = 1
					}else if(item.val==14){
						this.list.inform = 1
					}else if(item.val==16){
						this.list.authority = 1
					}else if(item.val==17){
						this.list.setting = 1
					}else if(item.val==18){
						this.list.print = 1
					}
				})
				if(fun.monitor==true){
					this.fun.monitor=1
				}
				if(fun.memory==true){
					this.fun.memory=1
				}
				if(fun.work_audt==true){
					this.fun.work_audt=1
				}
				if(fun.work_order==true){
					this.fun.work_order=1
				}
				if(fun.work_up==true){
					this.fun.work_up=1
				}
				if(fun.work_dispatch==true){
					this.fun.work_dispatch=1
				}
				if(fun.update_devices==true){
					this.fun.update_devices=1
				}
				if(fun.rem_devices==true){
					this.fun.rem_devices=1
				}
				if(fun.info_evelution==true){
					this.fun.info_evelution=1
				}
				if(fun.new_ladder==true){
					this.fun.new_ladder=1
				}
				if(fun.rem_ladder==true){
					this.fun.rem_ladder=1
				}
				if(fun.update_ladder==true){
					this.fun.update_ladder=1
				}
				if(fun.new_user==true){
					this.fun.new_user=1
				}
				if(fun.update_user==true){
					this.fun.update_user=1
				}
				if(fun.rem_user==true){
					this.fun.rem_user=1
				}
				if(fun.new_roles==true){
					this.fun.new_roles=1
				}
				if(fun.rem_roles==true){
					this.fun.rem_roles=1
				}
				if(fun.update_roles==true){
					this.fun.update_roles=1
				}
				if(fun.assign_roles==true){
					this.fun.assign_roles=1
				}
				if(fun.print==true){
					this.fun.print=1
				}
				const res = await this.$api.updateMenu(this.list)
				if(res.data.code==0){
					const rep = await this.$api.updateFunction(this.fun)
					if(rep.data.code==0){
						this.$Notice.success({
							title: '成功',
							desc: '编辑角色成功！'
						});
						this.$router.back(-1)
					}else{
						this.$Notice.error({
							title: '失败',
							desc: '编辑失败！'
						});
					}
				}else{
					this.$Notice.error({
						title: '失败',
						desc: '编辑失败！'
					});
				}
			},
			async getRole(){
				const res = await this.$api.getRole(this.options)
				if(res.data.code==0){
					this.roleList = res.data.data.list[0]
				}
				const itm = await this.$api.getFunction({
					page:1,
					num:1,
					id:this.roleList.id,
				})
				if(itm.data.code==0){
					this.show = itm.data.data.list[0]
				}
				const rep = await this.$api.getMenu({
					page:1,
					num:1,
					id:this.roleList.id,
				})
				if(rep.data.code==0){
					this.menuList = rep.data.data.list[0]
					this.checkedMenu()
					this.getMenus()
					// this.menus[0].checked = true
				}
			},
			async delRoles(){
				const res = await this.$api.delRole({
					id:this.options.id,
				})
				if(res.data.code==0){
					this.$Notice.success({
						title: '成功',
						desc: '删除角色成功！'
					});
					this.$router.back(-1)
				}else{
					this.$Notice.error({
						title: '失败',
						desc: '删除失败！'
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
	.ml-5{
		margin-left: 5px;
	}
</style>
