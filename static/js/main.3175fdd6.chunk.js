(this["webpackJsonpeclipsis-skin-preview"]=this["webpackJsonpeclipsis-skin-preview"]||[]).push([[0],[,,,,,,,function(e,t,n){e.exports=n.p+"static/media/Settings.982ae196.svg"},,,,,,function(e,t,n){e.exports=n.p+"static/media/Upload.90ba7a4b.svg"},function(e,t,n){e.exports=n.p+"static/media/Code.3354fae2.svg"},function(e,t,n){e.exports=n.p+"static/media/Switch.519a6516.svg"},function(e,t,n){e.exports=n.p+"static/media/Close.35eee04d.svg"},,function(e,t,n){e.exports=n(28)},,,,,function(e,t,n){},,function(e,t,n){},function(e,t,n){},function(e,t,n){},function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),i=n(10),o=n.n(i),s=(n(23),n(8)),c=n.n(s),l=n(11),u=n(2),d=n(5),g=n(4),m=n(3),p=n(0),h=n(12),f=n(17),v=(n(25),n(13)),w=n.n(v),b=n(14),S=n.n(b),k=n(15),E=n.n(k),y=n(7),R=n.n(y),C=(n(26),n(16)),G=n.n(C),N=function(e){Object(g.a)(n,e);var t=Object(m.a)(n);function n(e){var a;for(var r in Object(u.a)(this,n),(a=t.call(this,e)).settings={movementSmoothing:!0,panningLocked:!0,showGrid:!0,cameraZoomRate:1},a.updateSetting=function(e,t){a.settings[e]=t,a.forceUpdate(),a.props.eventBind(e,a.settings[e]),localStorage.setItem("settings",JSON.stringify(a.settings))},Object.assign(a.settings,JSON.parse(localStorage.getItem("settings")||"{}")),a.settings)a.props.eventBind(r,a.settings[r]);return a}return Object(d.a)(n,[{key:"prettyPrintVariable",value:function(e){var t=e.replace(/([A-Z])/g," $1").trim();return t.charAt(0).toUpperCase()+t.slice(1)}}]),Object(d.a)(n,[{key:"render",value:function(){var e=this,t=[],n=function(n){var a=e.settings[n],i=r.a.createElement(r.a.Fragment,null);switch(typeof a){case"boolean":i=r.a.createElement("div",{onClick:function(){return e.updateSetting(n,!e.settings[n])},className:"modify boolean ".concat(a?"active":"")},r.a.createElement("div",{className:"small-box"}));break;case"number":i=r.a.createElement("input",{type:"number",onChange:function(t){return e.updateSetting(n,Number(t.target.value))},value:a,className:"modify"});break;default:console.warn("Input type ".concat(typeof a," for field ").concat(n," is not supported."))}t.push(r.a.createElement("div",{className:"setting-field",key:n},r.a.createElement("p",null,e.prettyPrintVariable(n)),i))};for(var a in this.settings)n(a);return r.a.createElement("div",{className:"settings-container ".concat(this.props.hidden?"hidden":"")},r.a.createElement("div",{className:"settings"},r.a.createElement("div",{className:"settings-header"},r.a.createElement("div",{className:"img-container"},r.a.createElement("img",{src:R.a,draggable:!1,alt:""})),r.a.createElement("p",null,"Settings"),r.a.createElement("div",{className:"close-container img-container",onClick:this.props.closeSettings},r.a.createElement("img",{src:G.a,draggable:!1,alt:"Close"}))),r.a.createElement("div",{className:"settings-content"},t)))}}]),n}(r.a.PureComponent),j=(n(27),{All:"All Available Guns",Assault:"Assault Rifle",GrenadeLauncher:"Grenade Launcher",LaserDrill:"Laser Drill",Minigun:"Minigun",NapalmDestroyer:"Napalm Destroyer",Pistol:"Pistol",Portafab:"Portafab",RocketLauncher:"Rocket Launcher",SatchelCharge:"Satchel Charge",Scanner:"Scanner",Shotgun:"Shotgun",SMG:"Sub-Machine Gun",SniperRifle:"Sniper Rifle"}),x=function(e){Object(g.a)(n,e);var t=Object(m.a)(n);function n(){return Object(u.a)(this,n),t.apply(this,arguments)}return Object(d.a)(n,[{key:"render",value:function(){for(var e=this,t=[],n=function(){var n=i[a];t.push(r.a.createElement("div",{className:"gun-field",key:n,onClick:function(){return e.props.selectGun(n)}},r.a.createElement("p",null,j[n])))},a=0,i=Object.keys(j);a<i.length;a++)n();return r.a.createElement("div",{className:"gun-selector"},t)}}]),n}(r.a.PureComponent),P=function(e){Object(g.a)(n,e);var t=Object(m.a)(n);function n(e){var a;Object(u.a)(this,n),(a=t.call(this,e)).state={userUploaded:!1,settingsShown:!1,gunSelectorShown:!1},a.scene=new p.t,a.camera=new p.p(75,window.innerWidth/window.innerHeight,.1,1e3),a.renderer=new p.z({antialias:!0}),a.controls=new h.a(a.camera,a.renderer.domElement),a.currentSkin="",a.currentGun="Assault",a.lastGunId=null,a.loadWithTexture=function(){var e=Object(l.a)(c.a.mark((function e(t){var n,r,i,o,s,l;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=new f.a,e.next=3,new Promise((function(e){n.load("".concat(a.currentGun,".obj"),(function(t){e(t)}))}));case 3:r=e.sent,(i=document.createElement("img")).src=t,o=new p.w(i),i.addEventListener("load",(function(e){o.needsUpdate=!0})),s=new p.m({color:16777215,map:o,flatShading:!0}),r.traverse((function(e){e instanceof p.l&&(e.material=s)})),a.lastGunId&&(l=a.scene.getObjectById(a.lastGunId))&&a.scene.remove(l),a.lastGunId=r.id,a.scene.add(r);case 13:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),a.mountRef=r.a.createRef(),a.uploadRef=r.a.createRef(),a.uploadPassthrough=function(){var e;null===(e=a.uploadRef.current)||void 0===e||e.click()},a.fileUploaded=function(e){if(e.target.files&&e.target.files[0]){var t=new FileReader;t.addEventListener("load",(function(e){var t;e.target&&(a.currentSkin=(null===(t=e.target.result)||void 0===t?void 0:t.toString())||"",a.setState({userUploaded:!0}),a.loadWithTexture(a.currentSkin))})),t.readAsDataURL(e.target.files[0])}},a.toggleSettings=function(){a.setState({settingsShown:!a.state.settingsShown})},a.toggleGunSelector=function(){a.setState({gunSelectorShown:!a.state.gunSelectorShown})},a.settingChanged=function(e,t){switch(console.log("Settings ".concat(e," was changed to ").concat(t)),e){case"movementSmoothing":a.controls.enableDamping=t;break;case"panningLocked":a.controls.enablePan=!t;break;case"cameraZoomRate":a.controls.zoomSpeed=t;break;case"showGrid":var n=a.scene.getObjectByName("Grid");n&&(n.visible=t);break;default:console.warn("Property ".concat(e," was changed, but no handler was attached!"))}},a.selectGun=function(e){a.currentGun=e,a.loadWithTexture(a.currentSkin),a.forceUpdate()},a.scene.background=new p.c(3815994),a.camera.position.set(3,2,2),a.renderer.setPixelRatio(window.devicePixelRatio),a.renderer.setSize(window.innerWidth,window.innerHeight),a.controls.enableDamping=!0,a.controls.zoomSpeed=1,a.controls.enablePan=!1,a.controls.minDistance=1,a.controls.maxDistance=100,window.addEventListener("resize",(function(e){a.camera.aspect=window.innerWidth/window.innerHeight,a.camera.updateProjectionMatrix(),a.renderer.setPixelRatio(window.devicePixelRatio),a.renderer.setSize(window.innerWidth,window.innerHeight)}));return function e(){requestAnimationFrame(e),a.renderer.render(a.scene,a.camera),a.controls.update()}(),a}return Object(d.a)(n,[{key:"componentDidMount",value:function(){var e=this;if(!this.mountRef.current)throw new Error("Mount point not found");this.mountRef.current.appendChild(this.renderer.domElement);var t=new p.f(100,100,new p.c(16777215));t.name="Grid",t.position.set(0,-.75,0),this.scene.add(t),this.toDataUrl("GunTexture.png").then((function(t){e.currentSkin=t,e.loadWithTexture(e.currentSkin)}))}}]),Object(d.a)(n,[{key:"toDataUrl",value:function(e){return new Promise((function(t){var n=new XMLHttpRequest;n.addEventListener("load",(function(e){var a=new FileReader;a.onloadend=function(){var e;t(null===(e=a.result)||void 0===e?void 0:e.toString())},a.readAsDataURL(n.response)})),n.open("GET",e),n.responseType="blob",n.send()}))}},{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("input",{type:"file",className:"hidden",ref:this.uploadRef,onChange:this.fileUploaded}),r.a.createElement("div",{className:"app",ref:this.mountRef},r.a.createElement("div",{className:"sidebar"},r.a.createElement("button",{title:"Upload Skin",onClick:this.uploadPassthrough},r.a.createElement("img",{alt:"Upload Skin",draggable:!1,src:w.a})),r.a.createElement("button",{title:"Change Gun",onClick:this.toggleGunSelector},r.a.createElement("img",{alt:"Change Gun",draggable:!1,src:E.a})),r.a.createElement("button",{title:"Settings",onClick:this.toggleSettings},r.a.createElement("img",{alt:"Settings",draggable:!1,src:R.a})),r.a.createElement("button",{title:"View Source",onClick:function(){return window.location.href="https://github.com/xethlyx/eclipsis-skin-preview"}},r.a.createElement("img",{alt:"View Source",draggable:!1,src:S.a}))),!this.state.gunSelectorShown||r.a.createElement(x,{selectGun:this.selectGun}),r.a.createElement(N,{closeSettings:this.toggleSettings,eventBind:this.settingChanged,hidden:!this.state.settingsShown}),r.a.createElement("div",{className:"info-indicator"},r.a.createElement("p",null,this.state.userUploaded?"User Content":"System Default"),r.a.createElement("p",null,j[this.currentGun]))))}}]),n}(r.a.PureComponent),O=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function U(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(P,null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("/eclipsis-skin-preview",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("/eclipsis-skin-preview","/service-worker.js");O?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):U(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):U(t,e)}))}}()}],[[18,1,2]]]);
//# sourceMappingURL=main.3175fdd6.chunk.js.map