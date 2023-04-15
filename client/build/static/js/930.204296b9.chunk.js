"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[930],{8389:function(e,t,n){n.d(t,{Z:function(){return b}});var i=n(1413),o=n(5671),s=n(3144),a=n(136),r=n(7277),c=n(2791),l=n(6918),d=n(7621),u=n(2363),m=n(9504),p=n(2169),v=n(4771),h=n(8820),x=n(9126),Z=n(6151),j=n(4182),f=n(1249),g=n(144),y=n(784),C=n(184),b=function(e){(0,a.Z)(n,e);var t=(0,r.Z)(n);function n(){var e;(0,o.Z)(this,n);for(var s=arguments.length,a=new Array(s),r=0;r<s;r++)a[r]=arguments[r];return(e=t.call.apply(t,[this].concat(a))).state={dialogOpen:!1,dialogItem:null},e.setDialogItem=function(t){e.setState({dialogItem:t})},e.closeDialog=function(){e.setState({dialogOpen:!1})},e.openDialog=function(t){e.setState({dialogItem:t}),e.setState({dialogOpen:!0})},e.addToFavour=function(t){var n=(0,i.Z)({},t);n.type=e.props.type,n.subType=e.props.subType,j.Z.dispatch((0,f.Yb)(n))},e.removeFromFavour=function(e){j.Z.dispatch((0,f.O4)(e))},e.openCart=function(){e.closeDialog(),j.Z.dispatch((0,g.Lr)(!0))},e.addOneToCart=function(t){var n=(0,i.Z)({},t);n.type=e.props.type,n.subType=e.props.subType,j.Z.dispatch((0,g.UY)((0,i.Z)((0,i.Z)({},n),{},{orderNum:1})))},e}return(0,s.Z)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.type,o=t.subType,s=t.list,a=t.loadMore,r=t.hasMoreToLoad;return(0,C.jsxs)("div",{className:"ProductList_wrapper",children:[(0,C.jsx)(v.Z,{dataLength:null===s||void 0===s?void 0:s.length,next:a,hasMore:r,loader:(0,C.jsx)("h4",{children:"Loading..."}),className:"ProductList_tableless",children:null===s||void 0===s?void 0:s.map((function(t){return(0,C.jsxs)(d.Z,{className:"ProductList_card",children:[(0,C.jsx)(p.Z,{className:"ProductList_image",image:"".concat(y.Z,"/").concat(t.PID),onClick:function(){return e.openDialog(t)}}),(0,C.jsxs)(m.Z,{children:[(0,C.jsxs)("div",{children:[(0,C.jsx)("span",{className:"ProductList_card_itemName",onClick:function(){return e.openDialog(t)},children:t.name}),"\xa0\xa0\xa0",(0,C.jsx)("span",{className:"ProductList_card_itemComeFrom",children:t.comeFrom})]}),(0,C.jsxs)("div",{className:"ProductList_card_itemPrice",children:["$",t.price," Now! ",(0,C.jsxs)("span",{className:"ProductList_card_itemPrevPrice",children:["$",t.prevPrice]})]})]}),(0,C.jsxs)(u.Z,{children:[(0,C.jsx)(Z.Z,{variant:"contained",onClick:function(){return e.openDialog(t)},size:"median",children:"Detail"}),"\xa0\xa0\xa0",j.Z.getState().FavourReducer.favourList.find((function(e){return e.PID===t.PID}))?(0,C.jsx)(Z.Z,{variant:"outlined",onClick:function(){return e.removeFromFavour(t)},size:"median",color:"secondary",children:(0,C.jsx)(h.pHD,{size:28})}):(0,C.jsx)(Z.Z,{variant:"outlined",onClick:function(){return e.addToFavour(t)},size:"median",color:"secondary",children:(0,C.jsx)(h.y5j,{size:28})}),"\xa0\xa0\xa0",j.Z.getState().CartReducer.cartList.find((function(e){return e.PID===t.PID}))?(0,C.jsx)(Z.Z,{variant:"outlined",onClick:e.openCart,size:"median",color:"success",children:(0,C.jsx)(x.xsh,{size:28})}):(0,C.jsx)(Z.Z,{variant:"outlined",onClick:function(){return e.addOneToCart(t)},size:"median",color:"secondary",children:(0,C.jsx)(h.nxQ,{size:28})})]})]},t.PID)}))}),(0,C.jsx)(l.Z,(0,i.Z)((0,i.Z)({},this.state.dialogItem),{},{type:n,subType:o,open:this.state.dialogOpen,openDialog:this.openDialog,closeDialog:this.closeDialog}))]})}}]),n}(c.Component)},5930:function(e,t,n){n.r(t),n.d(t,{default:function(){return v}});var i=n(1413),o=n(9439),s=n(2791),a=n(8389),r=n(9124),c=n(3896),l=n(4182),d=n(184);var u=function(e){var t,n,i,u=(0,s.useState)(0),m=(0,o.Z)(u,2),p=m[0],v=m[1],h=(0,s.useState)(null===(t=Object.keys(l.Z.getState().ItemReducer.itemList[e.name]))||void 0===t?void 0:t[0]),x=(0,o.Z)(h,2),Z=x[0],j=x[1],f=(0,s.useState)(null===(n=l.Z.getState().ItemReducer.itemList[e.name][Z])||void 0===n?void 0:n.slice(0,12)),g=(0,o.Z)(f,2),y=g[0],C=g[1],b=function(t){var n;j(t.target.textContent),C(null===(n=l.Z.getState().ItemReducer.itemList[e.name][t.target.textContent])||void 0===n?void 0:n.slice(0,12))};return(0,d.jsxs)("div",{className:"Home_listItem",children:[(0,d.jsx)(r.Z,{value:p,onChange:function(e,t){v(t)},scrollButtons:!0,allowScrollButtonsMobile:!0,className:"Home_listTabs",textColor:"secondary",children:null===e||void 0===e||null===(i=e.value)||void 0===i?void 0:i.map((function(e){return(0,d.jsx)(c.Z,{label:(0,d.jsx)("span",{className:"Home_listTab",children:e}),onClick:b},e)}))}),(0,d.jsx)(a.Z,{type:null===e||void 0===e?void 0:e.name,subType:Z,list:y})]})},m=n(6355),p=n(1087);function v(){var e=l.Z.getState().HomeListReducer.homeList,t=(0,s.useState)(!1),n=(0,o.Z)(t,2),a=n[0],r=n[1];l.Z.subscribe((function(){r(!a)}));return(0,d.jsxs)("div",{className:"Home_wrapper",children:[(0,d.jsx)("div",{className:"Home_imageWrapper",children:(0,d.jsx)("img",{src:"../../../home_img.jpg",alt:"match not found",className:"Home_image"})}),(0,d.jsx)("br",{}),(0,d.jsx)("div",{className:"Home_listContainer",children:null===e||void 0===e?void 0:e.map((function(e){return(0,d.jsx)(u,(0,i.Z)({},e),e.name)}))}),(0,d.jsx)("br",{}),(0,d.jsx)("div",{className:"Home_linkWrapper",children:(0,d.jsx)(p.OL,{to:"/subNavigation/food/new",onClick:function(){window.scrollTo(0,0)},children:(0,d.jsxs)("button",{className:"Home_viewMore",children:["View More",(0,d.jsx)(m.Rdr,{size:30})]})})})]})}}}]);
//# sourceMappingURL=930.204296b9.chunk.js.map