import{_ as o,r as u,o as _,a,c,F as d,b as i,d as l,e as p,B as m,u as f}from"./index-DX1WmWX1.js";const k={__name:"ResultGoals",props:{initGoals:{type:Array,default(){return[]}},backend:Object},setup(s){const e=s,t=u(e.initGoals);return _(async()=>{try{t.value=await e.backend.getResultGoals()}finally{}}),(r,y)=>(a(),c("ul",null,[(a(!0),c(d,null,i(t.value,n=>(a(),l(p,{class:"item",model:n,key:n.id},null,8,["model"]))),128))]))}},b=o(k,[["__scopeId","data-v-838cf88b"]]),G={__name:"ResultView",setup(s){const e=m.getBackend();return(t,r)=>(a(),l(b,{backend:f(e)},null,8,["backend"]))}};export{G as default};
