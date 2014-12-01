var numpoints;
Main.TRAVEL_INCREMENT   = .00001;
Main.ROTATION_INCREMENT = 0.0025;//.0025
var points = [];
var keyboard;
var clock = new THREE.Clock();
var container, scene, camera, renderer, controls, stats;
var first = 1;
var count = 0;
var addx = 0;
var addy = 0;
var randomx = [];
var randomy = [];
var randomz = [];
var random = 1;
var randompaths = [];
var numglowsphers = 5;
var tunnels = [];
var numtunnels = 5;
var maxballs = 15;
var maxtunnels =60;
var particlegroups = [];
var particlegroupsAttributes = [];
// custom global variables

var MovingCube;
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function update2(p3,num)
{
    /*
    	var delta = clock.getDelta(); // seconds.
	var moveDistance = 20 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
    */
	var time = 4 * clock.getElapsedTime();
	/*
    
	// global coordinates
if (keyboard.pressed("left"))
//MovingCube.position.x -= moveDistance;
    addy -= moveDistance;
	if ( keyboard.pressed("right") )
	//	MovingCube.position.x += moveDistance;
    addy += moveDistance;
    if ( keyboard.pressed("up") )
	  addx += moveDistance;
      //  MovingCube.position.y += moveDistance;
	if ( keyboard.pressed("down") )
		addx -= moveDistance;
        //MovingCube.position.z += moveDistance;

if (addx > 6)
    addx = 6;
    if (addx < -6)
    addx = -6;
    if (addy > 6)
    addy = 6;
    if (addy < -6)
    addy = -6;
    */
//addx = Math.random()*10;
//addy = Math.random()*10;

	particlegroups[num].position.z = p3.z;
    particlegroups[num].position.x = p3.x+addx;
    particlegroups[num].position.y = p3.y+addy;

	for ( var c = 0; c < particlegroups[num].children.length; c ++ ) 
	{
		var sprite = particlegroups[num].children[ c ];

		// particle wiggle
		 var wiggleScale = 2;
		 sprite.position.x += wiggleScale * (Math.random() - 0.5);
		 sprite.position.y += wiggleScale * (Math.random() - 0.5);
		 sprite.position.z += wiggleScale * (Math.random() - 0.5);
		
		// pulse away/towards center
		// individual rates of movement
		var a = particlegroupsAttributes[num].randomness[c] + 1;
		var pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
		sprite.position.x = particlegroupsAttributes[num].startPosition[c].x * pulseFactor;
		sprite.position.y = particlegroupsAttributes[num].startPosition[c].y * pulseFactor;
		sprite.position.z = particlegroupsAttributes[num].startPosition[c].z * pulseFactor;	
	}

	// rotate the entire group
     particlegroups[num].rotation.x = time * randomx[num];
	particlegroups[num].rotation.y = time * randomy[num];
	 particlegroups[num].rotation.z = time * randomz[num];




//	if ( keyboard.pressed("z") ) 
	//{ 
		// do something cool
	//}
	
	//controls.update();
	//stats.update();
}


function update(p3)
{
	var delta = clock.getDelta(); // seconds.
	var moveDistance = 20 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
	
  MovingCube.position.z +=(p3.z-MovingCube.position.z);
    MovingCube.position.x += (p3.x-(MovingCube.position.x));MovingCube.position.x += addx;
    if ( count > 100)
    {
   // alert(MovingCube.position.y);
    count = 0;
    }
count++;
    MovingCube.position.y += (p3.y-MovingCube.position.y);
        MovingCube.position.y += addy;
	// local coordinates

	// local transformations

	// move forwards/backwards/left/right
	if ( keyboard.pressed("W") )
		MovingCube.translateZ( -moveDistance );
	if ( keyboard.pressed("S") )
		MovingCube.translateZ(  moveDistance );
	if ( keyboard.pressed("Q") )
		MovingCube.translateX( -moveDistance );
	if ( keyboard.pressed("E") )
		MovingCube.translateX(  moveDistance );	

	// rotate left/right/up/down
	var rotation_matrix = new THREE.Matrix4().identity();
	if ( keyboard.pressed("A") )
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	if ( keyboard.pressed("D") )
		MovingCube.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	if ( keyboard.pressed("R") )
		MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
	if ( keyboard.pressed("F") )
		MovingCube.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
	
//	if ( keyboard.pressed("Z") )
//	{
	//	MovingCube.position.set(0,25,0);
	//	MovingCube.rotation.set(0,0,0);
//	}
		
	// global coordinates
if (keyboard.pressed("left"))
//MovingCube.position.x -= moveDistance;
    addy -= moveDistance;
	if ( keyboard.pressed("right") )
	//	MovingCube.position.x += moveDistance;
    addy += moveDistance;
    if ( keyboard.pressed("up") )
	  addx += moveDistance;
      //  MovingCube.position.y += moveDistance;
	if ( keyboard.pressed("down") )
		addx -= moveDistance;
        //MovingCube.position.z += moveDistance;

if (addx > 6)
    addx = 6;
    if (addx < -6)
    addx = -6;
    if (addy > 6)
    addy = 6;
    if (addy < -6)
    addy = -6;



	//controls.update();
	//stats.update();
}

function Main()
{
   keyboard= new THREEx.KeyboardState();
 
	// The distance we've travelled through the tunnel. Between 0.0 and 1.0.
	this.travelledStep = 0.0;

	// We'll rotate the camera around its z-axis as it moves through the tunnel.
    this.rotationStep = 0.0;

    // Create the renderer.
	this.webGLRenderer = new THREE.WebGLRenderer();
    this.webGLRenderer.setClearColorHex( 0xFFAA88, 1.0);
	this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
	$("#WebGL-output").append(this.webGLRenderer.domElement);

    container = document.getElementById( 'ThreeJS' );
	container.appendChild( this.webGLRenderer.domElement );

    stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );


    // Create the scene and setup the camera.
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
    	45,
    	window.innerWidth / window.innerHeight,
    	0.1, 1000
	);
     var light = new THREE.AmbientLight( 0x888888 ); // soft white light
this.scene.add( light );
    var directionalLight = new THREE.DirectionalLight( 0xff80ff, 3 );
directionalLight.position.set( -1, 1, 1 );
directionalLight.color.setRGB(1, .5, 1);
this.scene.add( directionalLight );
    var directionalLight2 = new THREE.DirectionalLight( 0xff4Dff, 3 );
directionalLight2.position.set( 1, 1, -1 );
directionalLight2.color.setRGB(1, 0.3, 0.7);
this.scene.add( directionalLight2 );
    var directionalLight3 = new THREE.DirectionalLight( 0xff66ff, 3 );
directionalLight3.position.set( 0, -1, 0 );
directionalLight3.color.setRGB(.8, .4, .4);
this.scene.add( directionalLight3 );


numpoints = 90;
 Main.TRAVEL_INCREMENT   = .000015*(1000/numpoints);
    // Create the tunnel and add it to the scene.
 this.generatePoints(numpoints,40,60);
 
 for (var fu = 0; fu < maxtunnels; fu++ )
 {
     var color;
     color = getRandomColor();
     this.geom = this.generateTunnelGeometry2(points, 3072, .075, 3, 9);
      tunnels.push(this.createTunnelMesh2(this.geom, color,color));
       this.scene.add(tunnels[fu]);
  }
  /* {

     this.geom = this.generateTunnelGeometry2(points, 3072, .1, 3, 8);
     this.tunnel = this.createTunnelMesh2(this.geom, 0xFF0000,0xFF0000);
       this.scene.add(this.tunnel);
  }*/

    //       this.geom = this.generateTunnelGeometry2(points, 3072, .1, 20,10);
     // this.tunnel = this.createTunnelMesh2(this.geom, 1.0);
     
      // this.scene.add(this.tunnel);
        	this.geom = this.generateTunnelGeometry(3072, 12, 40);
    this.tunnel = this.createTunnelMesh(this.geom);
    this.scene.add(this.tunnel);
  
        	var materialArray = [];
/*	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/ypos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/yneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zneg.png' ) }));
*/	var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
	var MovingCubeGeom = new THREE.CubeGeometry( 1, 1, 1, 1, 1, 1, materialArray );
	MovingCube = new THREE.Mesh( MovingCubeGeom, MovingCubeMat );
	
    MovingCube.position.set(points[0].x+5, points[0].y+5, points[0].z + 10);
	//this.scene.add( MovingCube );



    for (var fu = 0; fu < maxballs; fu++) {
        var particleGroup, particleAttributes;
        var particleTexture = THREE.ImageUtils.loadTexture('https://lh5.googleusercontent.com/PWCjADf5ZcpJmET4xKXe3uqr6kucW-0whHVLhZoST8u3BeuRszmGHDjgY52758on2rETOO5Kbwc=w1106-h569');

        particleGroup = new THREE.Object3D();
        particleAttributes = { startSize: [], startPosition: [], randomness: [] };

        var totalParticles = 100;
        var radiusRange = 2;
        for (var i = 0; i < totalParticles; i++) {
            var spriteMaterial = new THREE.SpriteMaterial({ map: particleTexture, useScreenCoordinates: false, color: 0xffffff });

            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(1, 1, .4); // imageWidth, imageHeight
            sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            // for a cube:
            // sprite.position.multiplyScalar( radiusRange );
            // for a solid sphere:
            // sprite.position.setLength( radiusRange * Math.random() );
            // for a spherical shell:
            sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9));

            sprite.material.color.setRGB(Math.random(), Math.random(), Math.random());
            sprite.material.color.setHSL(Math.random(), 1.9, 0.7);

            sprite.opacity = 0.60; // translucent particles

            sprite.material.blending = THREE.NormalBlending; // "glowing" particles

            particleGroup.add(sprite);
            // add variable qualities to arrays, if they need to be accessed later
            particleAttributes.startPosition.push(sprite.position.clone());
            particleAttributes.randomness.push(Math.random());
        }
        particleGroup.position.set(points[0].x + 5, points[0].y + 5, points[0].z + 10);
        particlegroupsAttributes.push(particleAttributes);
        particlegroups.push(particleGroup);
        this.scene.add(particleGroup);
         randompaths.push( this.generaterandom(points, 1048, 4, 1, 9));
         randomx.push(Math.random());
         randomy.push(Math.random());
         randomz.push(Math.random());
    }
      //  	THREEx.WindowResize(renderer, camera);
//	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	//controls = new THREE.OrbitControls( this.camera, this.webGLRenderer.domElement );
  

//    this.generateTunnelGeometry2()
   //  var color;
    // color = getRandomColor();
     //this.geom = this.generateTunnelGeometry2();
    //  randompaths.push( this.generaterandom(points, 3072, .1, 3, 10));
       //this.scene.add(randompaths[randompaths[randompaths.length-1]]);









       	
	gui = new dat.GUI();
	
	parameters = 
	{
		x: 0, y: 30, z: 0,
		color: "#ff0000", // color (change "#" to "0x")
        color2: "#ff0000",
         color3: "#ff0000",
         numballs: 5,
         numtunnels: 10,
         speed: .000015*(1000/numpoints),
         rotatespeed: .0025,
          tunnel0 : "#ffffff",
         tunnel1 : "#ffffff",
          tunnel2 : "#ffffff",
           tunnel3 : "#ffffff",
            tunnel4 : "#ffffff",
             tunnel5 : "#ffffff",
              tunnel6 : "#ffffff",
               tunnel7 : "#ffffff",
               tunnel8 : "#ffffff",
                tunnel9 : "#ffffff",
                 tunnel10 : "#ffffff",
                  tunnel11 : "#ffffff",
                  tunnel12 : "#ffffff",
                   tunnel13 : "#ffffff",
                    tunnel14 : "#ffffff",
                     tunnel15 : "#ffffff",
                      tunnel16 : "#ffffff",
                       tunnel17 : "#ffffff",
                        tunnel18 : "#ffffff",
                         tunnel19 : "#ffffff",
                          tunnel20 : "#ffffff"
		
	};

/*	var folder1 = gui.addFolder('Position');
	var cubeX = folder1.add( parameters, 'x' ).min(-200).max(200).step(1).listen();
	var cubeY = folder1.add( parameters, 'y' ).min(0).max(100).step(1).listen();
	var cubeZ = folder1.add( parameters, 'z' ).min(-200).max(200).step(1).listen();

    */
    var folder2 = gui.addFolder('TunnelColors');

        
      
        var Colortunnel0 = folder2.addColor(parameters, 'tunnel' + '0').name('tunnel' + '0' + ' Color').listen();
          Colortunnel0.onChange(function (value) // onFinishChange
          {
              tunnels[0].material.color.setHex(value.replace("#", "0x"));
              tunnels[0].material.ambient.setHex(value.replace("#", "0x"));
          });
            var Colortunnel1 = folder2.addColor(parameters, 'tunnel' + '1').name('tunnel' + '1' + ' Color').listen();
          Colortunnel1.onChange(function (value) // onFinishChange
          {
              tunnels[1].material.color.setHex(value.replace("#", "0x"));
              tunnels[1].material.ambient.setHex(value.replace("#", "0x"));
          });
           var Colortunnel2 = folder2.addColor(parameters, 'tunnel' + '2').name('tunnel' + '2' + ' Color').listen();
          Colortunnel2.onChange(function (value) // onFinishChange
          {
              tunnels[2].material.color.setHex(value.replace("#", "0x"));
              tunnels[2].material.ambient.setHex(value.replace("#", "0x"));
          });
           var Colortunnel3 = folder2.addColor(parameters, 'tunnel' + '3').name('tunnel' + '3' + ' Color').listen();
          Colortunnel3.onChange(function (value) // onFinishChange
          {
              tunnels[3].material.color.setHex(value.replace("#", "0x"));
              tunnels[3].material.ambient.setHex(value.replace("#", "0x"));
          });
     var Colortunnel4 = folder2.addColor(parameters, 'tunnel' + '4').name('tunnel' + '4' + ' Color').listen();
          Colortunnel4.onChange(function (value) // onFinishChange
          {
              tunnels[4].material.color.setHex(value.replace("#", "0x"));
              tunnels[4].material.ambient.setHex(value.replace("#", "0x"));
          });
 var Colortunnel5 = folder2.addColor(parameters, 'tunnel' + '5').name('tunnel' + '5' + ' Color').listen();
          Colortunnel5.onChange(function (value) // onFinishChange
          {
              tunnels[5].material.color.setHex(value.replace("#", "0x"));
              tunnels[5].material.ambient.setHex(value.replace("#", "0x"));
          });
 var Colortunnel6 = folder2.addColor(parameters, 'tunnel' + '6').name('tunnel' + '6' + ' Color').listen();
          Colortunnel6.onChange(function (value) // onFinishChange
          {
              tunnels[6].material.color.setHex(value.replace("#", "0x"));
              tunnels[6].material.ambient.setHex(value.replace("#", "0x"));
          });
 var Colortunnel7 = folder2.addColor(parameters, 'tunnel' + '7').name('tunnel' + '7' + ' Color').listen();
          Colortunnel7.onChange(function (value) // onFinishChange
          {
              tunnels[7].material.color.setHex(value.replace("#", "0x"));
              tunnels[7].material.ambient.setHex(value.replace("#", "0x"));
          });
 var Colortunnel8 = folder2.addColor(parameters, 'tunnel' + '8').name('tunnel' + '8' + ' Color').listen();
          Colortunnel8.onChange(function (value) // onFinishChange
          {
              tunnels[8].material.color.setHex(value.replace("#", "0x"));
              tunnels[8].material.ambient.setHex(value.replace("#", "0x"));
          });
 var Colortunnel9 = folder2.addColor(parameters, 'tunnel' + '9').name('tunnel' + '9' + ' Color').listen();
          Colortunnel9.onChange(function (value) // onFinishChange
          {
              tunnels[9].material.color.setHex(value.replace("#", "0x"));
              tunnels[9].material.ambient.setHex(value.replace("#", "0x"));
          });

	//folder1.open();
	
/*	cubeX.onChange(function(value) 
	{   cube.position.x = value;   });
	cubeY.onChange(function(value) 
	{   cube.position.y = value;   });
	cubeZ.onChange(function(value) 
	{   cube.position.z = value;   });
	*/
	var cubeColor = gui.addColor( parameters, 'color' ).name('Color').listen();
	cubeColor.onChange(function(value) // onFinishChange
	{   directionalLight.color.setHex( value.replace("#", "0x") );   });
    var cubeColor2 = gui.addColor( parameters, 'color2' ).name('Color2').listen();
    cubeColor2.onChange(function (value) // onFinishChange
    { directionalLight2.color.setHex(value.replace("#", "0x")); });
    var cubeColor3 = gui.addColor( parameters, 'color3' ).name('Color3').listen();
	cubeColor3.onChange(function(value) // onFinishChange
	{   directionalLight3.color.setHex( value.replace("#", "0x") );   });
	
    var numballs = gui.add( parameters, 'numballs' ).min(0).max(maxballs).step(1).name('Number of Balls').listen();
	numballs.onChange(function(value)
	{   numglowsphers = value;   });

        var numbtunnels = gui.add( parameters, 'numtunnels' ).min(0).max(maxtunnels).step(1).name('Number of Lines').listen();
	numbtunnels.onChange(function(value)
	{   numtunnels = value;   });

    var speed = gui.add( parameters, 'speed' ).min(0.00001).max(.0009).step(0.00001).name('Speed').listen();
	speed.onChange(function(value)
	{   Main.TRAVEL_INCREMENT = value;   });

       var rotatespeed = gui.add( parameters, 'rotatespeed' ).min(0).max(.12).step(0.0001).name('RotateSpeed').listen();
	rotatespeed.onChange(function(value)
	{   Main.ROTATION_INCREMENT = value;   });
	


	
	gui.open();














    // Kick off the main loop.
    this.render();
}

// Constants
Main.prototype.generatePoints = function(numPoints, variance, distancebetween)
{
      var prevPoint = new THREE.Vector3(0, 0, 0);
    for (var i = 0; i < numPoints; i++)
    {
        var randomX = prevPoint.x + distancebetween + Math.round(Math.random() * variance);//10, 50
        var randomY = prevPoint.y + distancebetween + Math.round(Math.random() * variance);
        var randomZ = prevPoint.z + distancebetween + Math.round(Math.random() * variance);

        prevPoint.x = randomX;
        prevPoint.y = randomY;
        prevPoint.z = randomZ;

        points.push(new THREE.Vector3(randomX, randomY, randomZ));
    }

}

Main.prototype.generateTunnelGeometry = function(segments, radius, radiusSegments)
{
	// Create an array of points that we will generate our spline from.
	
  

    // Generate a spline from our points.
    spline = new THREE.SplineCurve3(points);
    
    // Generate geometry for a tube using our spline.
    return new THREE.TubeGeometry(spline, segments, radius, radiusSegments, false);
}
Main.prototype.generaterandom = function (vertices, segments, radius, radiusSegments, radius2) {
    var vertices2 = [];

    for (var fu = 0; fu < vertices.length; fu++) {
        vertices2.push(new THREE.Vector3(vertices[fu].x, vertices[fu].y, vertices[fu].z));
        var random2 = 0;
        var random = 0;
        while ((((random2 * random2) + (random * random)) > radius2 * radius2) || random2 == 0 || random === 0) {
            random2 = (((Math.random() - .5) * 2) * (radius2));
            while ((random2 < radius && random2 > -1 * radius) || (random2 < (-1 * radius2) && random2 > radius2))
                random2 = (((Math.random() - .5) * 2) * (radius2));

            random = (((Math.random() - .5) * 2) * (radius2));
            while ((random < radius && random > -1 * radius) || (random < (-1 * radius2) && random > radius2))
                random = (((Math.random() - .5) * 2) * (radius2));
        }
        vertices2[fu].y += random; //10, 50
        vertices2[fu].x += random2; //10, 50

    }

  //  spline = new THREE.SplineCurve3(vertices2);

    return vertices2;
}


Main.prototype.generateTunnelGeometry2 = function (vertices, segments, radius, radiusSegments, radius2) {
    var vertices2 = [];

    for (var fu = 0; fu < vertices.length; fu++) {
        vertices2.push(new THREE.Vector3(vertices[fu].x, vertices[fu].y, vertices[fu].z));
        var random2 = 0;
        var random = 0;
        while ((((random2 * random2) + (random * random)) > radius2 * radius2) || random2 == 0 || random === 0) {
            random2 = (((Math.random() - .5) * 2) * (radius2));
            while ((random2 < radius && random2 > -1 * radius) || (random2 < (-1 * radius2) && random2 > radius2))
                random2 = (((Math.random() - .5) * 2) * (radius2));

            random = (((Math.random() - .5) * 2) * (radius2));
            while ((random < radius && random > -1 * radius) || (random < (-1 * radius2) && random > radius2))
                random = (((Math.random() - .5) * 2) * (radius2));
        }
        vertices2[fu].y += random; //10, 50
        vertices2[fu].x += random2; //10, 50

    }

    spline = new THREE.SplineCurve3(vertices2);

    return new THREE.TubeGeometry(spline, segments, radius, radiusSegments, false);
}

Main.prototype.createTunnelMesh2 = function (geom, color, ambient) {

    var texture = THREE.ImageUtils.loadTexture("https://lh3.googleusercontent.com/9sdHJOqlrtaEnpCjWRaGaFgkhPIbsErz1vXJx9fDgMbhEm0DOQKgU-Ra_MLkAOjXX28b7F7uXqA=w1106-h569");
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(numpoints / 2, 1);
    // texture.mapping = new THREE.SphericalRefractionMapping();
    // var material = new THREE.MeshNormalMaterial({ transparent: true, opacity: opacity, side: THREE.DoubleSide });
    var material = new THREE.MeshLambertMaterial({
        ambient: ambient,
        color: color,
        specular: 0xCC88ff,
        shininess: 400,
        side: THREE.DoubleSide,
        map: texture

    });
    material.opacity = 0.8;
    material.transparent = true;

    // material.map = THREE.ImageUtils.loadTexture("images/water.jpg");
    //   material.needsUpdate = true;
    return new THREE.Mesh(geom, material);
}
Main.prototype.createpath = function (geom) {

    var texture = THREE.ImageUtils.loadTexture("https://lh3.googleusercontent.com/9sdHJOqlrtaEnpCjWRaGaFgkhPIbsErz1vXJx9fDgMbhEm0DOQKgU-Ra_MLkAOjXX28b7F7uXqA=w1106-h569");
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set( numpoints/2, 1 );
   // texture.mapping = new THREE.SphericalRefractionMapping();
    var material = new THREE.MeshNormalMaterial({ transparent: true, opacity: 0.0, side: THREE.DoubleSide });
   /* var material = new THREE.MeshLambertMaterial({
        ambient: ambient,
        color: color,
        specular: 0xCC88ff,
        shininess: 400,
        side: THREE.DoubleSide,
        map: texture
  
    });*/
    // material.map = THREE.ImageUtils.loadTexture("images/water.jpg");
    //   material.needsUpdate = true;
    return new THREE.Mesh(geom, material);
}

Main.prototype.createTunnelMesh = function (geom) {

    var texture = THREE.ImageUtils.loadTexture("https://lh3.googleusercontent.com/9sdHJOqlrtaEnpCjWRaGaFgkhPIbsErz1vXJx9fDgMbhEm0DOQKgU-Ra_MLkAOjXX28b7F7uXqA=w1106-h569");
    texture.wrapT = THREE.RepeatWrapping;
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set( numpoints/2, 1 );
   // texture.mapping = new THREE.SphericalRefractionMapping();
    //var material = new THREE.MeshNormalMaterial({ transparent: false, opacity: 0.8, side: THREE.DoubleSide });
    var material = new THREE.MeshLambertMaterial({
        ambient: 0x444444,
        color: 0xFFAA88,
        specular: 0xCC88ff,
        shininess: 400,
        side: THREE.DoubleSide,
        map: texture
  
    });
    // material.map = THREE.ImageUtils.loadTexture("images/water.jpg");
    //   material.needsUpdate = true;
    return new THREE.Mesh(geom, material);
}

Main.prototype.render = function () {

    if (this.travelledStep > .95 - Main.TRAVEL_INCREMENT) {
        this.travelledStep = 0.0;
    }

    spline = new THREE.SplineCurve3(points);
    var p1 = spline.getPointAt(this.travelledStep);
    var p2 = spline.getPointAt(this.travelledStep + Main.TRAVEL_INCREMENT);
    this.camera.position.set(p1.x, p1.y, p1.z);
    this.camera.lookAt(p2);
    var p3 = spline.getPointAt(this.travelledStep + 20 * .00015);
    this.camera.rotation.z = -Math.PI / 2 + (Math.sin(this.rotationStep) * Math.PI);



    this.travelledStep += Main.TRAVEL_INCREMENT;
    this.rotationStep += Main.ROTATION_INCREMENT;
    if (first == 1) {
        MovingCube.position.set(p3.x, p3.y, p3.z);
        first = 0;
    }
    else


    // MovingCube.position.x = MovingCube.position.x;
    //  update(p3);
        if (random == 1) {
            for (var fu = 0; fu < numglowsphers; fu++) {
                spline = new THREE.SplineCurve3(randompaths[fu]);
                var p4 = spline.getPointAt(this.travelledStep + 20 * .00015);
                update2(p4, fu);
            }

        }
    for (var fu = 0; fu < maxtunnels; fu++) {
        if (fu < numtunnels)
            tunnels[fu].visible = true;
        else
            tunnels[fu].visible = false;
    }
    stats.update();
    requestAnimationFrame(this.render.bind(this));
    this.webGLRenderer.render(this.scene, this.camera);
}

Main.prototype.resize = function()
{
	this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
}

