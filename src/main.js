import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/global.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'

// 按需导入需要的组件
import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Radio,
  InputNumber,
  Checkbox,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Tag,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Card,
  Steps,
  Step,
  Cascader,
  Container,
  Header,
  Aside,
  Main,
  MessageBox,
  Message
} from 'element-ui'
// 注册组件
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(CheckboxGroup)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Alert)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Card)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// 注册方法
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message

axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
Vue.prototype.$http = axios
axios.interceptors.request.use(function (config) {
  // 做业务逻辑处理
  // config = axios.defaults
  // console.dir(config)
  // 给axios配置携带token
  NProgress.start()
  var token = window.sessionStorage.getItem('token')
  config.headers.Authorization = token
  return config
}, function (error) {
  return Promise.reject(error)
})
axios.interceptors.response.use(function (response) {
  // axios完整请求的后续逻辑处理
  NProgress.done()
  return response
}, function (error) {
  // Do something with response error
  NProgress.done()
  return Promise.reject(error)
})
Vue.config.productionTip = false
// Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
