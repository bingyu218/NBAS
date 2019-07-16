<template>
	<div class="layout">
		<div class="header">
			<router-link to="/demo">
				<div class="collapse-btn">
				   <Icon style="color: white;" type="md-desktop" />
				</div>
			</router-link>
			
		    <!-- 折叠按钮 -->
		    <div class="collapse-btn" @click="collapseChage">
		        <i class="el-icon-menu"></i>
		    </div>
			
			
			
			
			<div class="logo"><img style="height: 32px;width: 32px;" src="../../static/logo-menu.png" alt="">   宁波申凌公司</div>
		    <div class="header-right">
		        <div class="header-user-con">
					<!--语言切换-->
					<div>
						<Dropdown class="layout-header-user fr" @on-click="changelang" trigger="click" >
						<!-- <Button type="primary"   style="width: 20px;height: 20px;background:#242f41;border: none;">
							 -->
						<div style="margin-top: 3px;margin-right: 20px;">
							<img style="height: 20px;width: 20px;" src="../assets/demo/img/language.png" alt="">
						</div>
						
						<Dropdown-menu slot="list">
							<Dropdown-item :name="1">中文</Dropdown-item>
							<Dropdown-item :name="2">English</Dropdown-item>
						</Dropdown-menu>
					</Dropdown>	
					</div>
				    <!-- 全屏显示 -->
		            <div class="btn-fullscreen" @click="handleFullScreen">
		                <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
		                    <i class="el-icon-rank"></i>
		                </el-tooltip>
		            </div>
		            <!-- 消息中心 -->
		            <div class="btn-bell">
		                <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
		                    <router-link to="/system/inform">
		                        <i class="el-icon-bell"></i>
		                    </router-link>
		                </el-tooltip>
		                <span class="btn-bell-badge" v-if="message"></span>
		            </div>
		            <!-- 用户头像 -->
					
		            <div class="user-avator"><img :src="portrait" class="img-circle" alt="User Image" onerror="src='../../static/admin.jpg'"></div>
		            <!-- 用户名下拉菜单 -->
		            <el-dropdown class="user-name" trigger="click" @command="logout">
		                <span class="el-dropdown-link">
		                    {{info.nickname}} <i class="el-icon-caret-bottom"></i>
		                </span>
		                <el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="4">{{$t("Personal Information")}}</el-dropdown-item>
		                    <el-dropdown-item command="6">{{$t("Change Password")}}</el-dropdown-item>
		                    <el-dropdown-item command="5">{{$t("WeChat Follow")}}</el-dropdown-item>
		                    <el-dropdown-item command="3" style="color: red;" divided>{{$t("Logout")}}</el-dropdown-item>
		                </el-dropdown-menu>
		            </el-dropdown>
		        </div>
		    </div>
		</div>
		
	     <Layout class="test" :style="{minHeight: '100vh',width: screenwidth+'px'}" style="" id="layout">
			
			
			<Sider >
				<div class="sidebar">
				    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
				        text-color="#bfcbd9" active-text-color="#20a0ff" @select="go">
				        <template v-for="item in items">
				            <template v-if="item.subs">
				                <el-submenu :index="item.index" :key="item.index">
				                    <template slot="title">
				                        <i :class="item.icon"></i><span slot="title">{{$t(isCollapsed?'':item.title.toString())}}</span>
				                    </template>
				                    <template v-for="subItem in item.subs">
				                        <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
				                            <template slot="title">{{$t(isCollapsed?'':subItem.title.toString())}}</template>
				                            <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
				                                {{$t(isCollapsed?'':threeItem.title.toString())  }}
				                            </el-menu-item>
				                        </el-submenu>
				                        <el-menu-item v-else :index="subItem.index" :key="subItem.index">
				                            {{$t(isCollapsed?'':subItem.title.toString())  }}
				                        </el-menu-item>
				                    </template>
				                </el-submenu>
				            </template>
				            <template v-else>
				                <el-menu-item :index="item.index" :key="item.index">
				                    <i :class="item.icon"></i><span slot="title">{{ $t(isCollapsed?'':item.title.toString())}}</span>
				                </el-menu-item>
				            </template>
				        </template>
				    </el-menu>
				</div>
		
			</Sider>
			
			<Layout>
				
				
				 <div class="content-box" :class="{'content-collapse':collapse}">
				    <div class="content">
				        <transition name="move" mode="out-in">
				            <keep-alive :include="tagsList">
				                <router-view></router-view>
				            </keep-alive>
				        </transition>
				    </div>
				</div>
		
				<div @click="quitfull()" v-if='full' style="height:15px;" @mouseover="show(1)">
					<Col span='22'>
						<div @mouseout="show(2)">&nbsp;</div>
					</Col>
					<Col span='2' v-if='quit' @mouseout="show(2)" style="cursor: pointer;">
						<div @mouseout="show(2)">
							<icon name="quit" width="10" height="10" slot="prepend" ></icon> {{$t("Quit")}}
						</div>
					</Col>
				</div>
			</Layout>
		</Layout>
	</div>
</template>

<script>
	import bus from './bus';
	import Vue from "vue";
	import vTags from './Tags.vue';
	export default {
		data() {
			const validateOldPassCheck = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.password.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
			items: [
				    {
				        icon: 'fa fa-dashboard',
				        index: '/',
				        title: '系统首页',
						subs:[
							{
								index:'dashboard',
								title:'Dashboard'
							},
							{
								index:'dashboard2',
								title:'Dashboard2'
							}
						]
				    },
					{
						icon:'fa fa-map-o',
						index:'menu',
						title:'Operation Monitor',
						subs:[
							{
								index:'map',
								title:'Operation State'
							},
							{
								index:'laddermap',
								title:'Devices State'
							}
							
						]
					},
					{
						icon:'fa fa-cogs',
						index:'maintain',
						title:'Work Flow',
						subs:[
							{
								index:'auditinglist',
								title:'Examine List'
							},
							{
								index:'maintain',
								title:'Order List'
							},
							{
								index:'maintainList',
								title:'Dispatch List'
							}
						]
					},
					{
						icon:'fa fa-list-alt',
						index:'event',
						title:'Basic Information',
						subs:[
							{
								index:'alList',
								title:'Devices Information'
							},
							{
								index:'evolution',
								title:'Firmware Update'
							},
							{
								index:'ladder',
								title:'Elevator Information'
							}
						]
					},
					{
						icon:'fa fa-group',
						index:'group',
						title:'Group',
						subs:[
							{
								index:'elevator',
								title:'Elevator Group'
							},
							{
								index:'organize',
								title:'Member Group'
							}
						]
					},
					{
						icon:'fa fa-address-card-o',
						index:'system',
						title:'System',
						subs:[
							{
								index:'userManage',
								title:'User Management'
							},
							{
								index:'inform',
								title:'Notification Record'
							},
								{
								index:'instructions',
								title:'Instructions'
							},
								{
								index:'authority',
								title:'Permission Assignment'
							}
						]
					},
					{
						icon:'fa fa-cog',
						index:'setting',
						title:'Default Setting',
						subs:[
							{
								index:'print',
								title:'Print QR Code'
							}
						]
					}
				],
				
				collapse: true,
				fullscreen: false,
				bg1:'#367fa9',
				bg2:'#3c8dbc',
				bg3:"dark",
				bottomcolor:"#1e282c",
				fontcolor:"#ffffff",
				full:false,
				quit:false,
				tagsList: [],
				portrait:'../../static/admin.jpg',
				isCollapsed: false,
				modal: false,
				logo:'../assets/logo-menu.png',
				modalType: 0,
				username:window.localStorage.getItem('username'),
				info: {
					nickname: '',
					phone: ''
				},
				password: {
					oldPassword: '',
					password: ''
				},
				passwordRules: {
					oldPassword: [{
						required: true,
						message: '旧密码不能为空',
						trigger: 'blur'
					},{
						min: 5,
						message: '密码不能少于6个字符',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '新密码不能为空',
						trigger: 'blur'
					},{
						min: 5,
						message: '密码不能少于6个字符',
						trigger: 'blur'
					}],
					confirm: [{
						validator: validateOldPassCheck,
						required: true,
						trigger: 'blur'
					}],
				},
				role: {
					0: '管理员',
				},
				count: null,
				screenwidth:'',
				active: this.$route.path.split('/')[1],
// 			menu: [{
// 					name: 'dashboard',
// 					icon: 'fa fa-dashboard',
// 					label: 'Dashboard',
// 					key:false,
// 				},{
// 					name: 'menu',
// 					icon: 'fa fa-map-o',
// 					label: 'Operation Monitor',
// 					key:false,
// 					sub:[{
// 						name:'map',
// 						label:'Operation State',
// 						key:false,
// 					},{
// 						name:'laddermap',
// 						label:'Devices State',
// 						key:false,
// 					},]
// 				},{
// 					name: 'maintain',
// 					icon: 'fa fa-cogs',
// 					label: 'Work Flow',
// 					key:false,
// 					sub: [{
// 						name: 'auditinglist',
// 						label: 'Examine List',
// 						key:false,
// 					},{
// 						name: 'maintain',
// 						label: 'Order List',
// 						key:false,
// 					},{
// 						name: 'maintainList',
// 						label: 'Dispatch List',
// 						key:false,
// 					}],
// 				},{
// 					name: 'event',
// 					icon: 'fa fa-list-alt',
// 					label: 'Basic Information',
// 					key:false,
// 					sub: [{
// 						name: 'alList',
// 						label: 'Devices Information',
// 						key:false,
// 					},{
// 						name:'evolution',
// 						label:'Firmware Update',
// 						key:false,
// 					},{
// 						name:'ladder',
// 						label:'Elevator Information',
// 						key:false,
// 					}],
// 				},{
// 					name: 'group',
// 					icon: 'fa fa-group',
// 					label: 'Group',
// 					key:true,
// 					sub: [{
// 						name:'elevator',
// 						label:'Elevator Group',
// 						key:true,
// 					},{
// 						name: 'organize',
// 						label: 'Member Group',
// 						key:true,
// 					}],
// 				},{
// 					name: 'system',
// 					icon: 'fa fa-address-card-o',
// 					label: 'System',
// 					key:true,
// 					sub:[{
// 						name: 'userManage',
// 						label: 'User Management',
// 						key:false,
// 					},{
// 						name: 'inform',
// 						label: 'Notification Record',
// 						key:false,
// 					},{
// 						name: 'instructions',
// 						label: 'Instructions',
// 						key:true,
// 					},{
// 						name: 'authority',
// 						label: 'Permission Assignment',
// 						key:false,
// 					}]
// 				},{
// 					name: 'setting',
// 					icon: 'fa fa-cog',
// 					label: 'Default Setting',
// 					key:false,
// 					sub:[{
// 						name:'print',
// 						key:false,
// 						label:'Print QR Code'
// 					}],
// 				},{
// 					name: 'dashboard2',
// 					icon: 'fa fa-dashboard',
// 					label: 'Dashboard2',
// 					key:true,
// 				}],
				menus:{},
				roles:0,
				lang:'',
			}
		},
		computed: {
			menuitemClasses: function() {
				return [
					'menu-item',
					this.isCollapsed ? 'collapsed-menu' : ''
				]
			},
		},
		mounted(){
			
			 if(document.body.clientWidth < 1500){
			    this.collapseChage();
			}
			window.onresize = () =>{
				document.getElementById('layout').style.width=document.documentElement.clientWidth+'px'
			}
		},
		async beforeCreate(){
			const val = await this.$api.people({
				id:window.localStorage.getItem('id'),
				num:1,
				page:1,
			})
			this.roles = val.data.data.list[0].role
			window.localStorage.setItem("role",this.roles)
		},
		created(){
			// this.getMenu()
			this.screenwidth=document.documentElement.clientWidth*1
			this.getportrait()
			this.getFunction()
		},
		methods: {
			 onRoutes(){
			    return this.$route.path.replace('/','');
			},
			 // 侧边栏折叠
			collapseChage(){
			    this.collapse = !this.collapse;
			    bus.$emit('collapse', this.collapse);
			},
			 // 全屏事件
			handleFullScreen(){
			    let element = document.documentElement;
			    if (this.fullscreen) {
			        if (document.exitFullscreen) {
			            document.exitFullscreen();
			        } else if (document.webkitCancelFullScreen) {
			            document.webkitCancelFullScreen();
			        } else if (document.mozCancelFullScreen) {
			            document.mozCancelFullScreen();
			        } else if (document.msExitFullscreen) {
			            document.msExitFullscreen();
			        }
			    } else {
			        if (element.requestFullscreen) {
			            element.requestFullscreen();
			        } else if (element.webkitRequestFullScreen) {
			            element.webkitRequestFullScreen();
			        } else if (element.mozRequestFullScreen) {
			            element.mozRequestFullScreen();
			        } else if (element.msRequestFullscreen) {
			            // IE11
			            element.msRequestFullscreen();
			        }
			    }
			    this.fullscreen = !this.fullscreen;
			},
			
// 			getMenu(){
// 				this.menus = JSON.parse(window.localStorage.getItem('menu'))
// 				if(this.menus.dashboard == true){
// 					this.menu[0].key = true
// 				}
// 				if(this.menus.menu == true){
// 					this.menu[1].key = true
// 				}
// 				if(this.menus.map == true){
// 					this.menu[1].sub[0].key = true
// 				}
// 				if(this.menus.laddermap == true){
// 					this.menu[1].sub[1].key = true
// 				}
// 				if(this.menus.auditinglist== true){
// 					this.menu[2].sub[0].key = true
// 				}
// 				if(this.menus.maintain== true){
// 					this.menu[2].sub[1].key = true
// 				}
// 				if(this.menus.maintainlist == true){
// 					this.menu[2].sub[2].key = true
// 				}
// 				if(this.menus.maintainlist == true||this.menus.auditinglist == true||this.menus.maintain == true){
// 					this.menu[2].key = true
// 				}
// 				if(this.menus.allist == true||this.menus.evolution == true||this.menus.ladder == true){
// 					this.menu[3].key = true
// 				}
// 				if(this.menus.allist == true){
// 					this.menu[3].sub[0].key = true
// 				}
// 				if(this.menus.evolution == true){
// 					this.menu[3].sub[1].key = true
// 				}
// 				if(this.menus.ladder == true){
// 					this.menu[3].sub[2].key = true
// 				}
// 				
// 				if(this.menus.user_manage == true){
// 					this.menu[5].sub[0].key = true
// 				}
// 				if(this.menus.inform == true){
// 					this.menu[5].sub[1].key = true
// 				}
// 				if(this.menus.authority == true){
// 					this.menu[5].sub[3].key = true
// 				}
// 				if(this.menus.print == true){
// 					this.menu[6].key = true
// 					this.menu[6].sub[0].key = true
// 				}
// 				this.$forceUpdate()
// 			},
			async getFunction(){
				const res = await this.$api.getFunction({
					page:1,
					num:1,
					id:this.global.roles,
				})
				if(res.data.code == 0){
					this.global.functions = res.data.data.list[0]
				}
			},
// 			fullscreen(){
// 				this.full=true
// 				var el = document.documentElement;
// 				var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;      
//                 if(typeof rfs != "undefined" && rfs) {
//                     rfs.call(el);
//                 };
// 			},
// 			quitfull(){
// 				this.full=false
// 				if (document.exitFullscreen) {  
// 					document.exitFullscreen();  
// 				}  
// 				else if (document.mozCancelFullScreen) {  
// 					document.mozCancelFullScreen();  
// 				}  
// 				else if (document.webkitCancelFullScreen) {  
// 					document.webkitCancelFullScreen();  
// 				}  
// 				else if (document.msExitFullscreen) {  
// 					document.msExitFullscreen();  
// 				} 
// 				if(typeof cfs != "undefined" && cfs) {
// 					cfs.call(el);
// 				}
// 			},
			gethome(){
				this.$router.push({
					name:'index'
				})
			},
			show(val){
				if (val == 1){this.quit=true}
				if (val == 2){this.quit=false}
			},
			async changelang(index) {
				this.modalType = parseInt(index)
				switch (parseInt(index)) {
					case 1:
						this.$i18n.locale = 'zh-CN';
						localStorage.setItem('language',this.$i18n.locale)
						this.$router.push(0)
						// Vue.config.lang = 'zh-CN'
						break;
					case 2:
						this.$i18n.locale = 'en-US';
						localStorage.setItem('language',this.$i18n.locale)
						this.$router.push(0)
						// Vue.config.lang = 'en-US'
				}
			},
			async logout(command) {
				this.modalType = parseInt(command)
				switch (parseInt(command)) {
					case 1:
						let user = await this.$api.user(this.$cookie.get('id'))
						this.info = user.data.account.data
						this.modal = true
						break;
					case 2:
						this.modal = true
						break;
						break;
					case 3:
						let res = await this.$api.logout({})
						window.$cookie.delete('id')
						window.$cookie.delete('role')
						window.localStorage.removeItem('id');
						window.localStorage.removeItem('menu');
						window.localStorage.removeItem('username');
						this.$router.replace({
							name: 'login'
						})
						break;
					case 4:
						let resp = await this.$api.user({})
						this.$router.push({
							name: 'person'
						})
						break;
					case 6:
						this.$router.push({
							name: 'newpassword'
						})
						break;
					case 5:
						let http = await this.$api.getcode()
						window.location.href= http.data.qrcode.url
				}
			},
			go(name) {
				if (typeof name === 'string')
					this.$router.push({
						name: name
					});
			},
			goHome() {
				this.$router.push({
					name: 'index'
				});
			},	
			isActive(path) {
                return path === this.$route.fullPath;
            },
            handleTags(command){
                command === 'other' ? this.closeOther() : this.closeAll();
            },
			collapsedSider () {
				this.$refs.side1.toggleCollapse();
			},
			emil(){
				this.$router.push({
					name:'inform'
				})
			},
			async getportrait(){
				let res = await this.$api.people({id:window.localStorage.getItem('id'),num:1,page:1})
				if (0 === res.data.code) {
					if (res.data.data.list[0].portrait != null) {
						this.portrait='http://server.asynciot.com/getfile?filePath='+res.data.data.list[0].portrait
						}

					if (res.data.data.list[0].nickname != null) {
						this.info.nickname=res.data.data.list[0].nickname
					}else {
						this.info.nickname=res.data.data.list[0].username
					}
					
					res = await this.$api.readOrganize({
						id:res.data.data.list[0].organization_id,
						nums:1,
						page:1,
					})
					if (res.data.data.list.length>0){
					this.bg1=res.data.data.list[0].bg1
					this.bg2=res.data.data.list[0].bg2
					console.log(res.data.data.list[0].bg3)
					if (res.data.data.list[0].bg3!=null){
						this.bg3=res.data.data.list[0].bg3
						if (this.bg3=="dark"){this.bottomcolor="#1e282c";this.fontcolor="#ffffff"}
						if (this.bg3=="light"){this.bottomcolor="#ffffff";this.fontcolor="#1e282c"}
						if (this.bg3=="primary"){this.bottomcolor="#2d8cf0";this.fontcolor="#ffff22"}
						}
					this.logo='http://server.asynciot.com/getfile?filePath='+res.data.data.list[0].logo
					}
					
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	
		//模板样式
		//头部
	 .header {
	    position: relative;
	    box-sizing: border-box;
	    width: 100%;
	    height: 70px;
	    font-size: 22px;
	    color: #fff;
	}
	.collapse-btn{
	    float: left;
	    padding: 0 21px;
	    cursor: pointer;
	    line-height: 70px;
	}
	.header .logo{
	    float: left;
	    width:250px;
	    line-height: 70px;
	}
	.header-right{
	    float: right;
	    padding-right: 50px;
	}
	.header-user-con{
	    display: flex;
	    height: 70px;
	    align-items: center;
	}
	.btn-fullscreen{
	    transform: rotate(45deg);
	    margin-right: 5px;
	    font-size: 24px;
	}
	.btn-bell, .btn-fullscreen{
	    position: relative;
	    width: 30px;
	    height: 30px;
	    text-align: center;
	    border-radius: 15px;
	    cursor: pointer;
	}
	.btn-bell-badge{
	    position: absolute;
	    right: 0;
	    top: -2px;
	    width: 8px;
	    height: 8px;
	    border-radius: 4px;
	    background: #f56c6c;
	    color: #fff;
	}
	.btn-bell .el-icon-bell{
	    color: #fff;
	}
	.user-name{
	    margin-left: 10px;
	}
	.user-avator{
	    margin-left: 20px;
	}
	.user-avator img{
	    display: block;
	    width:40px;
	    height:40px;
	    border-radius: 50%;
	}
	.el-dropdown-link{
	    color: #fff;
	    cursor: pointer;
	}
	.el-dropdown-menu__item{
	    text-align: center;
	}
	//侧边栏
	.sidebar{
	    display: block;
	    position: absolute;
	    left: 0;
	    top: 0px;
	    bottom:0;
	    overflow-y: scroll;
	}
	.sidebar::-webkit-scrollbar{
	    width: 0;
	}
	.sidebar-el-menu:not(.el-menu--collapse){
	    width: 250px;
	}
	.sidebar > ul {
	    height:100%;
	}
	//小哥哥们的
	.layout {
		// border: 1px solid #d7dde4;
		background: #f5f7f9;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.layout-breadcrumb {
		padding: 10px 15px 0;
	}

	.laycontent {
		position: relative;
	}

	.layout-content {
		// position: relative;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 10px;
		margin: 15px;
		overflow: hidden;
		background: #fff;
		border-radius: 4px;
		// min-height: 500px;
		// min-height: 100%;
	}
	.m-header{
		background: #3c8dbc;
		boxShadow: 0 2px 3px 2px rgba(0,0,0,.1);
		min-height:64px;
	}
	.layout-copy {
		position: absolute;
		left: 0;
		right: 0;
		text-align: center;
		padding: 0 0 15px;
		color: #9ea7b4;
		bottom: 0;
	}

	.ivu-row-flex {
		height: 100%;
	}

	.layout-menu-left {
		background: #464c5b;
		// overflow-y: scroll;
	}

	.layout-menu-ul {
		padding-top: 1px;
	}

	.layout-header {
		padding: 0px;
		height: 60px;
		background: #3c8dbc;
	}

	.layout-header-user {
		height: 40px;
		float: left;
	}

	.layout-logo-left {
		width: 90%;
		height: 130px;
		line-height: 30px;
		background: #5b6270;
		border-radius: 3px;
		margin: 15px auto 36px;
		color: #fff;
		font-size: 18px;
		font-weight: bold;
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
	}

	.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item {
		color: #FDFEFC;
	}

	.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
		// color: #39f;
	}
	.submenu {
		padding: 8px 24px;
	}

	.header-titles {
		line-height: 60px;
		padding-left: 20px;
		margin-top: -1%;
	}

	.info {
		display: flex;
		flex-flow: row;
		justify-content: center;
		align-items: center;
	}
	
	.tags {
        position: relative;
        height: 30px;
        overflow: hidden;
        background: #fff;
        padding-right: 120px;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
        float: left;
        margin: 3px 5px 2px 3px;
        border-radius: 3px;
        font-size: 12px;
        overflow: hidden;
        cursor: pointer;
        height: 23px;
        line-height: 23px;
        border: 1px solid #e9eaec;
        background: #fff;
        padding: 0 5px 0 12px;
        vertical-align: middle;
        color: #666;
        -webkit-transition: all .3s ease-in;
        -moz-transition: all .3s ease-in;
        transition: all .3s ease-in;
    }

    .tags-li:not(.active):hover {
        background: #f8f8f8;
    }

    .tags-li.active {
        color: #fff;
        background: #59f;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
        color: #666;
    }

    .tags-li.active .tags-li-title {
        color: #fff;
    }

    .tags-close-box {
 		position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: 30px;
        background: #0ff;
    }
	.w-button{
		min-width: 150px;
		border: #fff;
		height: 64px;
		background-color: #3c8dbc;
	}
	.w-button:hover{
		background-color: #0B93D5;
	}
	.img-circle{
		width: 100%;
		max-width: 45px;
		height: auto;
		border-radius: 50%;
	}
	.user-panel{
		padding-left: 20%;
	}
	.layout-content-main{
		width:100%;
		background-color: white;
		overflow-y: hidden;
	}
	.test{
		margin-top: -1px;
		margin-left: -1px;
	}
	.box-username{
		display: table-cell;
		vertical-align: middle;
		text-align: center;
		width: 100%;
	}
	Dropdown:hover Button{
		background-color: white;
	}
	
	

</style>
