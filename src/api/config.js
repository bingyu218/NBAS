import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)

// HTTP相关
let API_ROOT = (process.env.NODE_ENV == 'production')
			? 'http://server.asynciot.com/'
			: 'http://server.asynciot.com/'
			// : 'http://localhost:9000/'
			// : 'http://localhost:9002/'
Vue.http.options.root = API_ROOT
Vue.http.options.crossOrigin = true;
Vue.http.options.credentials = true ;

export const root = API_ROOT
export const AccountApi = Vue.resource('account{/key1}{/key2}{/key3}')
export const DeviceApi = Vue.resource('device{/key1}{/key2}{/key3}{/key4}')
export const RootApi = Vue.resource('{key1}{/key2}{/key3}{/key4}')
export const CommonApi = Vue.resource('common{/key1}{/key2}{/key3}{/key4}')
export const OtherApi = Vue.resource('other{/key1}{/key2}{/key3}{/key4}')