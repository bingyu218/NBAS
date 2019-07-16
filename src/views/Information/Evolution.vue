<template lang="jade">
div.layout-content-main
	div.form
		Form(ref='query',:model="query",label-position="right",:label-width="100" @keydown.enter.native.prevent="getList()")
			Row(:gutter=5)
				Col(span="3")
					Select(:placeholder="$t('Please select the version')",v-model="version" style="width:100%" @on-change="getList()")
						Option(v-for="item in versions",:key="item",:value="item")|{{item}}
				Col(span='3')
					AutoComplete(name="inpSer" v-model="options.search_info" ,:data="menu" ,@on-search="handleSearch1()", :placeholder="$t('keyword')" max=15 style="width:100%" class="handle-input mr10" id="serch1")
				Col(span="13")
					Button(type="primary" icon='ios-search' @click='getList()')|{{$t('search')}}
					Button.mr-10(type="success",:disabled="(select.length == 0) || !version",@click="update(select)")|{{$t('Update the selected device')}}
				Col(span="3")
					upload(:before-upload='handleUpload' action='')
						Button(icon='ios-cloud-upload-outline')|{{filename}}
				Col(span="2")
					Button.mr-10(type='success', @click='confirm()' style='' v-if='!upsuccess')|{{$t('upload')}}
	div(style="min-height: 450px;")
		Table(@on-selection-change="selection",:columns="columns",:data="data",size="small" stripe)
	div
	Col(span='6')|&nbsp;
	Col(span='18')
		Page(show-elevator :total="options.total",:page-size="options.num",:current="options.page",@on-change="pageChange",show-total)
</template>

<script>
import {
	api,
	ladderApi,
	formatDate
} from '@/utils'
export default {
	created() {
		this.getVersion()
	},
	data() {
		const type= {
			15: this.$t('door'),
			240: this.$t('ctrl'),
		};
		const netWork = {
			3: '联通3G',
			40: '移动4G',
			41: '联通4G',
		};
		return {
			versions: [],
			version: '',
			upsuccess: true,
			filename: this.$t('Please select the file'),
			select: [],
			query:{},
			api: api,
			ladderApi: ladderApi,
			loading:false,
			evelution:this.global.functions.info_evelution,
			columns: [{
				type: 'selection',
				align: 'center',
				width: 35,
			},{
				title: this.$t('device name'),
				key: 'device_name',
				align: 'center',
				width: 110,
			},{
				title: 'IMEI(设备识别码)',
				key: 'IMEI',
				width: 140,
				minWidth:140,
			},{
				title: this.$t('device type'),
				key: 'device_type',
				width:105,
				render: (h, params) => {
					var i='';
					if (params.row.device_type==240) i=this.$t('ctrl');
					if (params.row.device_type==15) i=this.$t('door');
					return h('p',i)
				}
			},
	//      {
	//        title: '网络类型',
	//        key: 'networkType',
	//					width:100,
	//        render: (h, params) => {
	//          return h('p',netWork[params.row.networkType]||'-')
	//        }
	//      },
			{
				title: this.$t('firmware version'),
				key: 'device_firmware',
				width:135,
			},
			{
				title: this.$t('state'),
				width:90,
				render: (h, params) => {
					return h('p',(params.row.commond=='update') ? this.$t('updating'):this.$t('updatable'))
				}
			},
			{
				title: this.$t('IP location'),
						 width: 110,
				 render: (h, params) => {
				 return h('div',params.row.ip_country+params.row.ip_region+params.row.ip_city)
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
				width:80,
				render: (h, params) => {
					return h('Button', {
						props: {
							type: 'primary',
							size: "small",
							disabled: (params.row.commond=='update'),
						},
						on: {
							click: () => {
								this.update([params.row])
							}
						}
					}, this.$t('update'))
				}
			}],
			data: [],
			menu:[],
			file: null,
			options: {
				page: 1,
				num: 10,
				total: 1,
				search_info: '',
			}
		}
	},
	methods: {
		handleSearch1 () {
			this.menu=[];
			var str;
			for (var i=0;i<this.data.length;i++){
				str=this.data[i].IMEI;
				if (str != null){
					if (str.indexOf(this.options.search_info)>=0){
					this.menu.push(str)
					}
				}
				str=this.data[i].device_name;		  	    	
				if (str != null){
					if (str.indexOf(this.options.search_info)>=0){
					this.menu.push(str)
					}
				} 
			}
		},
		handleUpload (file) {
			var type = file.name.split('.')
			if (type[type.length-1] == 'bin'){
				this.file = file;
				this.filename = this.file.name;
				this.upsuccess = false;
				return false;
			}
			else{
				this.$Notice.warning({
					title: '警告',
					desc: '只能上传bin类型的文件'
				})
			}
		},
		async confirm(){
			var flag=0;
			var formData = new FormData()
			var formData = new window.FormData()
			formData.append('file',this.file)
			this.versions.forEach(item=>{
				if(item==this.filename) {flag=1}
			})
			if (flag==1) {
				this.upsuccess=true
				this.$Notice.warning({
					title: '成功',
					desc: (this.filename+'已存在')
				})
				this.filename='已上传'+this.filename
			}else {
				let res = await this.$api.upload(formData)
				if (res.data.code == 0){
					this.versions=[]
					let typ= await this.$api.gettype({type:'firmware',num:100,page:1})
					typ.data.data.list.forEach(item=>{
						this.versions.push(item.name)
					})
					this.upsuccess=true
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
			}
		},
		pageChange(val) {
			this.options.page = val
			this.getList()
		},
		async getVersion() {
			this.versions=[]
			let typ= await this.$api.gettype({type:'firmware',num:100,page:1})
			typ.data.data.list.forEach(item=>{
				this.versions.push(item.name)
			})
			this.getList()
		},
		async getList() {
			this.loading = true
			let res = await this.$api.devices(this.options)
			let test = await this.$api.devicess(this.options)
			this.loading = false
			if(res.data.code === 0){
				for (var i=0;i<res.data.data.list.length;i++){
					if (res.data.data.list[i].device_firmware !=null) {
						var sub=''
					for (var j=0;j<res.data.data.list[i].device_firmware.length;j++){
						if (res.data.data.list[i].device_firmware.substring(j,j+1).charCodeAt()>1)
						sub=sub+res.data.data.list[i].device_firmware.substring(j,j+1)
					}
					res.data.data.list[i].device_firmware=sub
					}
					
				}
				this.data = res.data.data.list
				this.options.total = res.data.data.totalNumber
			}else{
				this.$Notice.error({
				  title: '错误',
				  desc: '获取列表失败'
				});
			}
		},
		selection(data) {
			this.select=[]
			data.forEach(item=>{
				this.select.push(item)
			})
		},
		update(val) {
			var name = []
			val.forEach(item=>{
				if(item.device_name!=null){
					name.push(item.device_name);
				}else{
					name.push(item.IMEI)
				}
			})
			this.$Modal.confirm({
				title: '请确认要升级的设备',
				content:name,
				onOk: () => {
					this.toupdate(val)
				},
				onCancel: () => {
				}
			})
		},
		async toupdate(val){
			var res
			var success=[]
			var error =[]
			for (var i=0;i<val.length;i++) {
				res = await this.$api.updat({IMEI:val[i].IMEI,firmware:this.version})
					if(res.data.code === 0){
						if(val[i].device_name!=null){
							success.push(val[i].device_name);
						}else{
							success.push(val[i].IMEI)
						}
					}else{
						if(val[i].device_name!=null){
							error.push(val[i].device_name);
						}else{
							error.push(val[i].IMEI)
						}
					}
			}
			if(success.length == val.length){
				this.getList()
				this.$Notice.success({
					title: '成功',
					desc: '成功升级'+success
				});
			}else{
				if (error.length == val.length) {
					this.$Notice.error({
						title: '错误',
						desc: '升级失败'
					});
				}
				else{
					this.getList()
					this.$Notice.warning({
						title: '警告',
						desc: '成功升级'+success+'；但是'+error+'升级失败'
					});
				}							
			}
		}
	},
}
</script>

<style lang="scss" scoped>
	.mr-10{
		margin-left: 5px;
	}
</style>
