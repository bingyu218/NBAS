import { stringify } from 'qs';
import {
	root,
	AccountApi,
	DeviceApi,
	RootApi,
	CommonApi,
	OtherApi,
} from './config'
export default {
	ws: (data) => `${root.replace('http', 'ws')}/v1/devices/socket?${stringify(data)}`,
	debug: (data) => `${root.replace('http', 'ws')}/v1/devices/socketDebug?${stringify(data)}`,
  
	logoutdevices: (data) => {
		return RootApi.save({key1:'Command',key2:'Logout'}, data)
	},
	//other
	message:(data) => {
		return CommonApi.query(Object.assign({key1:'message'}, data))
	},
	sentmessage:(data) => {
		return CommonApi.save({key1:'message'}, data)
	},
	readmessage:(data) => {
		return CommonApi.save({key1:'message',key1:'settle'}, data)
	},
	messagecount:(data) => {
		return CommonApi.query(Object.assign({key1:'message',key2:'count'}, data))
	},
	chat:(data) => {
		return CommonApi.query(Object.assign({key1:'chat'}, data))
	},
	delchat: (data) => {
		return CommonApi.remove(Object.assign({key1:'chat'}, data))
	},
	sentchat:(data) => {
		return CommonApi.save({key1:'chat'}, data)
	},
	sentMessage:(data) => {
		return CommonApi.save({key1:'sms',key2:data}, data)
	},
	getcode:(data) => {
		return CommonApi.query(Object.assign({key1:'wechat',key2:'getqrcode'}, data))
	},
	//account
	register:(data)=>{
		return AccountApi.save({key1:'register'},data)
	},
	retrieve:(data)=>{
		return AccountApi.save({key1:'retrieve'},data)
	},
	update:(data)=>{
		return AccountApi.update(data)
	},
	user:(data)=>{
		return AccountApi.query(Object.assign({},data))
	},
	login:(data)=>{
		return AccountApi.save({key1:'login'},data)
	},
	logout:(data)=>{
		return AccountApi.save({key1:'logout'},data)
	},
	password:(data)=>{
		return AccountApi.save({key1:'password'},data)
	},
	people:(data) => {
		return AccountApi.query(Object.assign({}, data))
	},
	addpeople:(data) => {
		return AccountApi.save({}, data)
	},
	updatepeople:(data) => {
		return AccountApi.update({}, data)
	},
	removePeople:(data) => {
		return AccountApi.remove(Object.assign({}, data))
	},
	portrait:(data)=>{
		return AccountApi.save({key1:'portrait'},data)
	},
	getOrganization:(data)=>{
		return AccountApi.query(Object.assign({key1:'readOrganization'},data))
	},
	//role
	newMenu:(data)=>{
		return AccountApi.save({key1:'addMenu'},data)
	},
	getMenu:(data)=>{
		return AccountApi.query(Object.assign({key1:'Menu'},data))
	},
	updateMenu:(data) => {
		return AccountApi.update({key1:'Menu',key2:'update'}, data)
	},
	newFunction:(data)=>{
		return AccountApi.save({key1:'addFunction'},data)
	},
	getFunction:(data)=>{
		return AccountApi.query(Object.assign({key1:'Function'},data))
	},
	updateFunction:(data) => {
		return AccountApi.update({key1:'Function',key2:'update'}, data)
	},
	newRole:(data)=>{
		return AccountApi.save({key1:'addRole'},data)
	},
	getRole:(data)=>{
		return AccountApi.query(Object.assign({key1:'Role'},data))
	},
	confer:(data)=>{
		return AccountApi.save({key1:'Confer'},data)
	},
	delRole: (data) => {
		return AccountApi.remove(Object.assign({key1:'delete'},data))
	},
	//Device
	alert: (data) => {
		return DeviceApi.save({key1:'alert'}, data)
	},
	devices: (data) => {
		return DeviceApi.query(Object.assign({key1:'Device',key2:'ReadMore'}, data))
	},
	devicess: (data) => {
		return DeviceApi.query(Object.assign({key1:'Device'}, data))
	},
	devicecount: (data) => {
		return DeviceApi.query(Object.assign({key1:'Device',key2:'ReadCount'}, data))
	},
	setdevices: (data) => {
		return DeviceApi.update({key1:'Device'}, data)
	},	
 	deldevices: (data) => {
		return DeviceApi.remove(Object.assign({key1:'Device'}, data))
	},
	locate: (data) => {
		return DeviceApi.query(Object.assign({key1:'Device',key2:'Locate'}, data))
	},
 	regdevices: (data) => {
		return DeviceApi.save({key1:'Register'}, data)
	},
	//event
	event: (data) => {
		return DeviceApi.query(Object.assign({key1:'Event'}, data))
	},
	delevent: (data) => {
		return DeviceApi.remove(Object.assign({key1:'Event'}, data))
	},
	eventCount:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Event',key2:'ReadCount'}, data))
	},
	activedoor:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Event',key2:'Activedoor'}, data))
	},
	upload: (data) => {
		return DeviceApi.save({key1:'Upload'}, data)
	},
	updat: (data) => {
		return DeviceApi.save({key1:'Update'}, data)
	},
	//monitor
	monitor: (data) => {
		return DeviceApi.save({key1:'Monitor'}, data)
	},
	pernum: (data) => {
		return DeviceApi.query(Object.assign({key1:'Monitor',key2:'pernums'}, data))
	},
	gettype:(data) => {
		return DeviceApi.query(Object.assign({key1:'Binary'}, data))
	},
	//follow
	follow:(data)=> {
		return DeviceApi.query(Object.assign({key1:'follow'}, data))
	},
	followladder:(data)=> {
		return DeviceApi.query(Object.assign({key1:'followladder'}, data))
	},
	ladder:(data)=> {
		return DeviceApi.query(Object.assign({key1:'followladder',key2:'ReadMore'}, data))
	},
	addfollow:(data)=> {
		return DeviceApi.save({key1:'follow'}, data)
	},
	newfollow:(data)=> {
		return DeviceApi.save({key1:'followladder'}, data)
	},
	delfollow:(data)=> {
		return DeviceApi.remove(Object.assign({key1:'follow'}, data))
	},
	removefollow:(data)=> {
		return DeviceApi.remove(Object.assign({key1:'followladder'}, data))
	},
	//dispatch
	getRepair:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Dispatch'}, data))
	},
	dispatchExamine:(data)=> {
		return DeviceApi.save({key1:'Dispatch',key2:'examine'}, data)
	},
	finish:(data)=> {
		return DeviceApi.save({key1:'Dispatch',key2:'finish'}, data)
	},
	adopt:(data)=> {
		return DeviceApi.save({key1:'Dispatch',key2:'adopt'}, data)
	},
	runtime:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Runtime'}, data))
	},
	//order
	fault:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Order'}, data))
	},
	order:(data)=> {
		return DeviceApi.save({key1:'Order',key2:'receipt'}, data)
	},
	orderCount:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Order',key2:'ReadCount'}, data))
	},
	orderExamine:(data)=> {
		return DeviceApi.save({key1:'Order',key2:'examine'}, data)
	},
	orderAdopt:(data)=> {
		return DeviceApi.save({key1:'Order',key2:'adopt'}, data)
	},
	faultfreq:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Order',key2:'Faultfreq'}, data))
	},
	progress:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Order',key2:'Progress'}, data))
	},
	//ladder
	newLadder:(data)=> {
		return DeviceApi.save({key1:'Ladder'}, data)
	},
	readLadder:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Ladder'}, data))
	},
	reLadder:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Ladder',key2:'ReadMore'}, data))
	},
	removeLadder:(data)=> {
		return DeviceApi.remove(Object.assign({key1:'Ladder'}, data))
	},
	updateLadder: (data) => {
		return DeviceApi.update({key1:'Ladder'}, data)
	},
	upLadderGroup: (data) => {
		return DeviceApi.update({key1:'Ladder',key2:'Group'}, data)
	},
	rmLadderGroup: (data) => {
		return DeviceApi.update({key1:'Ladder',key2:'RemoveGroup'}, data)
	},
	//company
	newGroup:(data)=> {
		return DeviceApi.save({key1:'Group'}, data)
	},
	readGroup:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Group'}, data))
	},
	updateGroup: (data) => {
		return DeviceApi.update({key1:'Group'}, data)
	},
	rmGroup:(data)=> {
		return DeviceApi.remove(Object.assign({key1:'Group'}, data))
	},
	newOrganize:(data)=> {
		return DeviceApi.save({key1:'Organization'}, data)
	},
	readOrganize:(data)=> {
		return DeviceApi.query(Object.assign({key1:'Organization'}, data))
	},
	updateOrganize: (data) => {
		return DeviceApi.update({key1:'Organization'}, data)
	},
	rmOrganize:(data)=> {
		return DeviceApi.remove(Object.assign({key1:'Organization'}, data))
	},
	joinGroup: (data) => {
		return DeviceApi.update({key1:'Organization',key2:'join'}, data)
	},
	rmGroupPeo: (data) => {
		return DeviceApi.update({key1:'Organization',key2:'remove'}, data)
	},
	bindGroup: (data) => {
		return DeviceApi.update({key1:'Organization',key2:'bind'}, data)
	},
}