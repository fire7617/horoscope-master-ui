(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0da2ea"],{"6b08":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-form",{ref:"queryForm",attrs:{model:e.queryParams,size:"small",inline:!0,"label-width":"68px"}},[a("el-form-item",{attrs:{label:"登錄地址",prop:"ipaddr"}},[a("el-input",{attrs:{placeholder:"請輸入登錄地址",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.ipaddr,callback:function(t){e.$set(e.queryParams,"ipaddr",t)},expression:"queryParams.ipaddr"}})],1),a("el-form-item",{attrs:{label:"用戶名稱",prop:"userName"}},[a("el-input",{attrs:{placeholder:"請輸入用戶名稱",clearable:""},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleQuery(t)}},model:{value:e.queryParams.userName,callback:function(t){e.$set(e.queryParams,"userName",t)},expression:"queryParams.userName"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary",icon:"el-icon-search",size:"mini"},on:{click:e.handleQuery}},[e._v("搜索")]),a("el-button",{attrs:{icon:"el-icon-refresh",size:"mini"},on:{click:e.resetQuery}},[e._v("重置")])],1)],1),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.list.slice((e.pageNum-1)*e.pageSize,e.pageNum*e.pageSize)}},[a("el-table-column",{attrs:{label:"序號",type:"index",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s((e.pageNum-1)*e.pageSize+t.$index+1))])]}}])}),a("el-table-column",{attrs:{label:"會話編號",align:"center",prop:"tokenId","show-overflow-tooltip":!0}}),a("el-table-column",{attrs:{label:"登錄名稱",align:"center",prop:"userName","show-overflow-tooltip":!0}}),a("el-table-column",{attrs:{label:"主機",align:"center",prop:"ipaddr","show-overflow-tooltip":!0}}),a("el-table-column",{attrs:{label:"登錄地點",align:"center",prop:"loginLocation","show-overflow-tooltip":!0}}),a("el-table-column",{attrs:{label:"瀏覽器",align:"center",prop:"browser"}}),a("el-table-column",{attrs:{label:"操作系統",align:"center",prop:"os"}}),a("el-table-column",{attrs:{label:"登錄時間",align:"center",prop:"loginTime",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(e.parseTime(t.row.loginTime)))])]}}])}),a("el-table-column",{attrs:{label:"操作",align:"center","class-name":"small-padding fixed-width"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{directives:[{name:"hasPermi",rawName:"v-hasPermi",value:["monitor:online:forceLogout"],expression:"['monitor:online:forceLogout']"}],attrs:{size:"mini",type:"text",icon:"el-icon-delete"},on:{click:function(a){return e.handleForceLogout(t.row)}}},[e._v("強退")])]}}])})],1),a("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.pageNum,limit:e.pageSize},on:{"update:page":function(t){e.pageNum=t},"update:limit":function(t){e.pageSize=t}}})],1)},l=[],r=a("b775");function o(e){return Object(r["a"])({url:"/monitor/online/list",method:"get",params:e})}function i(e){return Object(r["a"])({url:"/monitor/online/"+e,method:"delete"})}var s={name:"Online",data:function(){return{loading:!0,total:0,list:[],pageNum:1,pageSize:10,queryParams:{ipaddr:void 0,userName:void 0}}},created:function(){this.getList()},methods:{getList:function(){var e=this;this.loading=!0,o(this.queryParams).then((function(t){e.list=t.rows,e.total=t.total,e.loading=!1}))},handleQuery:function(){this.pageNum=1,this.getList()},resetQuery:function(){this.resetForm("queryForm"),this.handleQuery()},handleForceLogout:function(e){var t=this;this.$modal.confirm('是否確認強退名稱為"'+e.userName+'"的用戶？').then((function(){return i(e.tokenId)})).then((function(){t.getList(),t.$modal.msgSuccess("強退成功")})).catch((function(){}))}}},u=s,c=a("2877"),p=Object(c["a"])(u,n,l,!1,null,null,null);t["default"]=p.exports}}]);