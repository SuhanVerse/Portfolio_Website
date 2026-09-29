import * as THREE from 'three';
// An illustrative teaching robot, not a CAD reconstruction of a project.
// No idle animation loop, external model, texture request or gesture capture.
export function createScene(host,onLost){
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0xe8e9df);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,60);camera.position.set(5.7,4.3,6.5);camera.lookAt(0,.6,0);scene.add(new THREE.HemisphereLight(0xffffff,0x69755e,3));const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(3,7,5);scene.add(key);
 const robot=new THREE.Group();scene.add(robot);let disposed=false,visible=true,angle=-.3;
 const parts={sense:[],compute:[],act:[]};const materials=[];
 function mat(color,metalness=0){const m=new THREE.MeshStandardMaterial({color,roughness:.65,metalness});materials.push(m);return m;}
 const deck=mat(0xd8c89e,.2),green=mat(0x315b43),metal=mat(0xb8c0b6,.45),black=mat(0x29312d),orange=mat(0xb85a32),blue=mat(0x365e66),tire=mat(0x303833);
 function mesh(geo,m,x,y,z,part,parent=robot){if(part){m=m.clone();materials.push(m);}const obj=new THREE.Mesh(geo,m);obj.position.set(x,y,z);parent.add(obj);if(part)parts[part].push(obj);return obj;}
 const box=(w,h,d,m,x,y,z,part)=>mesh(new THREE.BoxGeometry(w,h,d),m,x,y,z,part);
 box(2.2,.14,2.9,deck,0,.48,0);box(1.9,.12,2.15,deck,0,1.05,-.12);
 for(const x of [-.85,.85])for(const z of [-.85,.7])mesh(new THREE.CylinderGeometry(.045,.045,.5,8),metal,x,.79,z);
 for(const x of [-1.2,1.2])for(const z of [-.95,.95]){const wheel=mesh(new THREE.CylinderGeometry(.47,.47,.28,24),tire,x,.4,z,'act');wheel.rotation.z=Math.PI/2;const hub=mesh(new THREE.CylinderGeometry(.24,.24,.3,16),green,x,.4,z,'act');hub.rotation.z=Math.PI/2;for(let a=0;a<8;a++){const tread=box(.3,.05,.14,black,x,.4+Math.cos(a*Math.PI/4)*.45,z+Math.sin(a*Math.PI/4)*.45,'act');tread.rotation.x=-a*Math.PI/4;}}
 box(1.15,.08,.8,green,0,1.18,-.05,'compute');box(.38,.12,.36,black,0,1.28,-.06,'compute');box(.2,.16,.27,metal,-.57,1.28,.14,'compute');for(const x of [-.42,.42])for(let i=0;i<6;i++)box(.045,.08,.045,metal,x,1.26,-.32+i*.1,'compute');
 box(.6,.18,1.0,black,0,.68,-.4);box(.38,.25,.33,blue,0,1.28,1.03,'sense');box(.92,.45,.09,green,0,1.63,1.14,'sense');for(const x of [-.25,.25]){const sensor=mesh(new THREE.CylinderGeometry(.17,.17,.15,24),metal,x,1.66,1.26,'sense');sensor.rotation.x=Math.PI/2;const face=mesh(new THREE.CylinderGeometry(.125,.125,.16,24),black,x,1.66,1.28,'sense');face.rotation.x=Math.PI/2;}
 for(const x of [-.68,.68])box(.17,.1,.32,black,x,.38,1.5,'sense');
 for(const x of [-.4,.4]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,1.2,.2),new THREE.Vector3(x+.15,1.65,.5),new THREE.Vector3(x,1.35,1.1)]);mesh(new THREE.TubeGeometry(curve,12,.018,6,false),orange,0,0,0);}
 const ground=mesh(new THREE.CylinderGeometry(2.7,2.7,.1,64),mat(0xd4d9c9),0,-.14,0,null,scene);const grid=new THREE.GridHelper(7,14,0xb6bfac,0xcbd1c1);grid.position.y=-.21;scene.add(grid);robot.rotation.y=angle;
 const base=new Map(materials.map(m=>[m,m.color.clone()]));
 function render(){if(!disposed&&visible&&!document.hidden)renderer.render(scene,camera);}
 const resize=()=>{if(disposed)return;const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();};
 const ro=new ResizeObserver(resize);ro.observe(host);const io=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible)render();});io.observe(host);document.addEventListener('visibilitychange',render);
 const lost=e=>{e.preventDefault();onLost();};renderer.domElement.addEventListener('webglcontextlost',lost);resize();
 return {highlight(part){for(const [m,c]of base){m.color.copy(c);m.emissive.set(0x000000);}for(const obj of parts[part]||[])obj.material.emissive.set(0x423018);render();},rotate(){angle+=Math.PI/5;robot.rotation.y=angle;render();},dispose(){if(disposed)return;disposed=true;ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',render);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{o.geometry?.dispose();});for(const m of materials)m.dispose();grid.material.dispose();renderer.dispose();renderer.domElement.remove();}};
}
