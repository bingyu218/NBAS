export const menu = [
// 	{
// 		id: 1,
// 		pId: 0,
// 		label: '系统首页',
// 	}, 

	{
		id: 0,
		pId: 0,
		label: 'Dashboard',
		value: 'dashboard',
		val:0,
	},{
		id: 1,
		pId: 0,
		label: '运行监控',
		value: 'menu',
		val:1,
		sub: [
			{
				id: 11,
				pId: 1,
				label: '运行状态',
				value: 'map',
				val:2,
			}, {
				id: 12,
				pId: 1,
				label: '电梯状态',
				value: 'laddermap',
				val:3,
			}, 
			{
				id: 13,
				pId: 1,
				label: '测试',
				value: 'test',
				val:4,
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
		value: 'maintain',
		val:4,
		sub: [
			{
				id: 21,
				pId: 2,
				label: '审核列表',
				value: 'auditinglist',
				val:5,
			}, {
				id: 22,
				pId: 2,
				label: '工单列表',
				value: 'maintain',
				val:6,
			},
			{
				id: 23,
				pId: 2,
				label: '维保信息',
				value: 'maintainlist',
				val:7,
			}],
	}, {
		id: 3,
		pId: 0,
		label: '基础信息维护',
		value: 'event',
		val:8,
		sub: [
			{
				id: 31,
				pId: 3,
				label: '设备信息',
				value: 'allist',
				val:9,
			},{
				id: 32,
				pId: 3,
				label: '固件更新',
				value: 'evolution',
				val:10,
			},{
				id: 33,
				pId: 3,
				label: '电梯信息',
				value: 'ladder',
				val:11,
			}],
	}, {
		id: 4,
		pId: 0,
		label: '群组',
		value: 'group',
		val:12,
		sub: [
			{
				id: 41,
				pId: 4,
				label: '电梯群组',
				value: 'eleGroup',
				val:13,
			},{
				id: 42,
				pId: 4,
				label: '人员群组',
				value: 'organize',
				val:14,
			}],
	},{
		id: 5,
		pId: 0,
		label: '系统管理',
		value: 'sys',
		val:15,
		sub: [
			{
				id: 51,
				pId: 5,
				label: '用户管理',
				value: 'user_manage',
				val:16,
			}, {
				id: 52,
				pId: 5,
				label: '通知记录',
				value: 'inform',
				val:17,
			}, {
				id: 53,
				pId: 5,
				label: '说明文档',
				value: 'instructions',
				checked: true,
				val:18,
			}, {
				id: 54,
				pId: 5,
				label: '权限管理',
				value: 'authority',
				val:19,
			}]
	}, {
		id: 6,
		pId: 0,
		label: '出厂设置',
		value: 'setting',
		val:20,
		sub: [
			{
				id: 61,
				pId: 6,
				label: '打印二维码',
				value: 'print',
				val:21,
			}]
	}, 
];
