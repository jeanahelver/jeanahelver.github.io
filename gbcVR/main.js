import * as THREE from './three/three.module.js';

///imports
let gamelink = ""
function a(){
  
  let newlink = document.createElement("INPUT");
  newlink.type = "url";
  newlink.placeholder = "gb or gbc rom url"
  newlink.value = "https://cdn.glitch.global/cd8a76ea-3e25-4742-99ee-2bc19d59143f/crystal-clear-2.5.1.gbc"
  let button = document.createElement('button')
  button.addEventListener('click', () => {
    gamelink = newlink.value
    
    window.jeana()
  })
  button.innerText = "add game"
  document.getElementById('btns').appendChild(newlink)
  document.getElementById('btns').appendChild(button)
  document.getElementById('btns').appendChild(document.createElement("br"))
}a()
let links = JSON.parse(localStorage.getItem("links"))
if(links == null) links = {}
for (let key in links) {
  let button = document.createElement('button')
  button.addEventListener('click', () => {
    console.log(links[key])
    gamelink = links[key]
    window.jeana()
  })
  button.innerText = key
  document.getElementById('btns').appendChild(document.createElement("br"))
  document.getElementById('btns').appendChild(button)
}


//////:



			import { BoxLineGeometry } from './three/BoxLineGeometry.js';
			import { VRButton } from './three/VRButton.js';
			let camera, scene, renderer;
			let controller1, controller2;

      //gbc
      let gbcanvas, gbtex,gbmat,gbright,gbleft, group;
      const intersected = [];
      const tempMatrix = new THREE.Matrix4();
      window.addEventListener('beforeunload', function (e) {autoSave()})

			let room;
let raycaster;
   window.jeana = ()=>{
      document.getElementById('btns').style.display = 'none';
      //document.getElementById('btnsave').style.display = 'block';
			init();
			animate();
  }
      function startGame (blob) {
  var binaryHandle = new FileReader();
  binaryHandle.onload = function () {
    if (this.readyState === 2) {
      try {
        start(gbcanvas, this.result);
        openSRAM(gameboy.name)
        settings[3] = 0.01
        gameboy.changeVolume();
        
        links[gameboy.name] = gamelink
        localStorage.setItem("links",JSON.stringify(links))
        
      } catch (e) {
        alert(e.message);
      }
    }
  };
  binaryHandle.readAsBinaryString(blob);
};
			function init() {
          
         gbcanvas = document.createElement('canvas')
         gbtex = new THREE.CanvasTexture(gbcanvas);
         gbtex.magFilter  =THREE.NearestFilter
         gbtex.needsUpdate = true;
         gbcanvas.width = 160
         gbcanvas.height = 144
       
         let load=()=>{
           
           var xhr = new XMLHttpRequest();
           let v = getUrlVars() 
           xhr.open("GET", gamelink);
           xhr.responseType = "blob";
           xhr.onload = function () {
             startGame(new Blob([this.response], { type: "text/plain" }));
          };
          xhr.send();
        };
        load()
        raycaster = new THREE.Raycaster();
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x202020 );
        group = new THREE.Group();
				scene.add( group );
				camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
				camera.position.set( 0, 1.6, 3 );

				room = new THREE.LineSegments(
					new BoxLineGeometry( 10, 5, 10, 10, 5, 10 ),
					new THREE.LineBasicMaterial( { color: 0xffff00 } )
				);
				room.geometry.translate( 0, 2.5, 0 );
				scene.add( room );

				scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

				const light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );
        
        gbmat = new THREE.MeshBasicMaterial({
          map: gbtex
        });
        let gbox = new THREE.Mesh(new THREE.BoxGeometry(1.60*2, 1.44*2, 0.1),new THREE.MeshStandardMaterial({color:0x000000,emissive:0xffffff,emissiveMap:gbtex}));
        gbox.position.set(0,2,-4)
        //group.add(gbox)
				//
      
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.xr.enabled = true;
				document.body.appendChild( renderer.domElement );
        document.body.appendChild(gbcanvas);
				//

				document.body.appendChild( VRButton.createButton( renderer ) );

		
       
        group.add(gbox)
        
        
        /////////////////////////////
        //////////////////////////////
        
        function onSelectStart( event ) {

				const controller = event.target;

				const intersections = getIntersections( controller );

				if ( intersections.length > 0 ) {

					const intersection = intersections[ 0 ];

					const object = intersection.object;
					//object.material.emissive.b = 1;
					controller.attach( object );

					controller.userData.selected = object;

				}

			}

			function onSelectEnd( event ) {

				const controller = event.target;

				if ( controller.userData.selected !== undefined ) {

					const object = controller.userData.selected;
					//object.material.emissive.b = 0;
					group.attach( object );

					controller.userData.selected = undefined;

				}


			}

        
				controller1 = renderer.xr.getController( 0 );
				controller1.addEventListener( 'selectstart', onSelectStart );
				controller1.addEventListener( 'selectend', onSelectEnd );
				controller1.addEventListener( 'connected', function ( event ) {
          
          
					this.add( buildController( event.data ) );

				} );
				controller1.addEventListener( 'disconnected', function () {

					this.remove( this.children[ 0 ] );

				} );
				scene.add( controller1 );

				controller2 = renderer.xr.getController( 1 );
				controller2.addEventListener( 'selectstart', onSelectStart );
				controller2.addEventListener( 'selectend', onSelectEnd );
				controller2.addEventListener( 'connected', function ( event ) {
          
					this.add( buildController( event.data ) );

				} );
				controller2.addEventListener( 'disconnected', function () {

					this.remove( this.children[ 0 ] );

				} );
				scene.add( controller2 );
 

				window.addEventListener( 'resize', onWindowResize );

			}

			function buildController( data ) {

				let geometry, material;

				switch ( data.targetRayMode ) {

					case 'tracked-pointer':

						geometry = new THREE.BufferGeometry();
						geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
						geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

						material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

						return new THREE.Line( geometry, material );

					case 'gaze':

						geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
						material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
						return new THREE.Mesh( geometry, material );

				}

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			

			//

			function animate() {

				renderer.setAnimationLoop( render );

			}
function cleanIntersected() {

				while ( intersected.length ) {

					const object = intersected.pop();
          //object.material.color.g = 0;
				}

			}
function intersectObjects( controller ) {

				// Do not highlight when already selected

				if ( controller.userData.selected !== undefined ) return;

				const intersections = getIntersections( controller );

				if ( intersections.length > 0 ) {

					const intersection = intersections[ 0 ];

					const object = intersection.object;
          //object.material.color.g = 0.5;
					intersected.push( object );

					

				} 

			}
function getIntersections( controller ) {

				tempMatrix.identity().extractRotation( controller.matrixWorld );

				raycaster.ray.origin.setFromMatrixPosition( controller.matrixWorld );
				raycaster.ray.direction.set( 0, 0, - 1 ).applyMatrix4( tempMatrix );

				return raycaster.intersectObjects( group.children, false );

			}
			function render() {
         cleanIntersected();

				intersectObjects( controller1 );
			  intersectObjects( controller2 );
        
        ////quest buttons
        const session = renderer.xr.getSession();
        let i = 0
        if (session) {
          for (const source of session.inputSources) {
            if (!source.gamepad) continue;
            if (source && source.handedness) {
                //const controller = renderer.xr.getController(i++);
                 
                if(source.handedness == "right"){
                  if(source.gamepad.buttons[5].pressed){
                    GameBoyKeyDown("a")
                  }else GameBoyKeyUp("a")
                  if(source.gamepad.buttons[4].pressed){
                    GameBoyKeyDown("b")
                  } else GameBoyKeyUp("b")
                }
              if(source.handedness == "left"){
                  if(source.gamepad.buttons[5].pressed){
                    GameBoyKeyDown("select")
                  } else GameBoyKeyUp("select")
                  if(source.gamepad.buttons[4].pressed){
                    GameBoyKeyDown("start")
                  } else GameBoyKeyUp("start")
                  if(source.gamepad.axes[2]>0.5){
                    GameBoyKeyDown("right")
                  } else GameBoyKeyUp("right")
                  if(source.gamepad.axes[3]>0.5){
                    GameBoyKeyDown("down")
                  }else GameBoyKeyUp("down")
                  if(source.gamepad.axes[2]<-0.5){
                    GameBoyKeyDown("left")
                  }else  GameBoyKeyUp("left")
                  if(source.gamepad.axes[3]<-0.5){
                    GameBoyKeyDown("up")
                  }else GameBoyKeyUp("up")
                }
            }
          }
        }
        
        
        gbtex.needsUpdate = true;
				//

				

				renderer.render( scene, camera );

			}
