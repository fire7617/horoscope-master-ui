(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d230898"],{ed69:function(e,t,l){"use strict";l.r(t);var a=function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("el-form",{ref:"basicInfoForm",attrs:{model:e.info,rules:e.rules,"label-width":"150px"}},[l("el-row",[l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"表名稱",prop:"tableName"}},[l("el-input",{attrs:{placeholder:"請輸入倉庫名稱"},model:{value:e.info.tableName,callback:function(t){e.$set(e.info,"tableName",t)},expression:"info.tableName"}})],1)],1),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"表描述",prop:"tableComment"}},[l("el-input",{attrs:{placeholder:"請輸入"},model:{value:e.info.tableComment,callback:function(t){e.$set(e.info,"tableComment",t)},expression:"info.tableComment"}})],1)],1),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"實體類名稱",prop:"className"}},[l("el-input",{attrs:{placeholder:"請輸入"},model:{value:e.info.className,callback:function(t){e.$set(e.info,"className",t)},expression:"info.className"}})],1)],1),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"作者",prop:"functionAuthor"}},[l("el-input",{attrs:{placeholder:"請輸入"},model:{value:e.info.functionAuthor,callback:function(t){e.$set(e.info,"functionAuthor",t)},expression:"info.functionAuthor"}})],1)],1),l("el-col",{attrs:{span:24}},[l("el-form-item",{attrs:{label:"備註",prop:"remark"}},[l("el-input",{attrs:{type:"textarea",rows:3},model:{value:e.info.remark,callback:function(t){e.$set(e.info,"remark",t)},expression:"info.remark"}})],1)],1)],1)],1)},r=[],o={props:{info:{type:Object,default:null}},data:function(){return{rules:{tableName:[{required:!0,message:"請輸入表名稱",trigger:"blur"}],tableComment:[{required:!0,message:"請輸入表描述",trigger:"blur"}],className:[{required:!0,message:"請輸入實體類名稱",trigger:"blur"}],functionAuthor:[{required:!0,message:"請輸入作者",trigger:"blur"}]}}}},n=o,s=l("2877"),i=Object(s["a"])(n,a,r,!1,null,null,null);t["default"]=i.exports}}]);