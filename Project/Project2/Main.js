var numpoints;
Main.TRAVEL_INCREMENT   = .00001;//speed of tunnel
Main.ROTATION_INCREMENT = 0.0025;//rate which tunnel rotates
var points = [];//points array for path
var keyboard;//input
var clock = new THREE.Clock();//timer
var container, scene, camera, renderer, controls, stats;
var first = 1;//if first time
var count = 0;
var addx = 0;//tracks x location of ball
var addy = 0;//tracks y location of ball
var randomx = [];//random Xs
var randomy = [];//random Ys
var randomz = [];//random Zs
var random = 1;
var randompaths = [];
var numglowsphers = 5;
var tunnels = [];
var numtunnels = 10;
var maxballs = 15;
var maxtunnels =50;
var particlegroups = [];
var particlegroupsAttributes = [];
var controlledrotation = 0.0;
var rotationspeed = 1;
var manualrotate = 0;
var camerarotate;
var camerarotate2;
var lastmode = 0;
var customUniforms;
var pulse = 0.4;//rate at which the spheres pulse
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
	
    
	// global coordinates
	if (manualrotate != 0) {
	    if (keyboard.pressed("left"))
	        controlledrotation -= 0.0025;
	    //Main.ROTATION_INCREMENT += 0.00025;//.0025
	    //MovingCube.position.x -= moveDistance;
	    // addy -= moveDistance;
	    if (keyboard.pressed("right"))
	        controlledrotation += 0.0025; //.0025
	    //	MovingCube.position.x += moveDistance;
	    // addy += moveDistance;
	    if (keyboard.pressed("up"))
	    // addx += moveDistance;
	        Main.TRAVEL_INCREMENT += .000001;
	    if (keyboard.pressed("down")) {
	        if (Main.TRAVEL_INCREMENT > 0.000001)
	            Main.TRAVEL_INCREMENT -= .000001;
	    }
	}
        //addx -= moveDistance;
        //MovingCube.position.z += moveDistance;
        /*
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
    particlegroups[num].position.x = p3.x;//+addx;
    particlegroups[num].position.y = p3.y;//+addy;

	for ( var c = 0; c < particlegroups[num].children.length; c ++ ) 
	{
		var sprite = particlegroups[num].children[ c ];

		// particle wiggle
		 var wiggleScale = 300;
		 sprite.position.x += wiggleScale * (Math.random() - 0.5);
		 sprite.position.y += wiggleScale * (Math.random() - 0.5);
		 sprite.position.z += wiggleScale * (Math.random() - 0.5);
		
		// pulse away/towards center
		// individual rates of movement
		var a = particlegroupsAttributes[num].randomness[c] + 1;
		var pulseFactor = Math.sin(a * time) * pulse + 0.9;
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
	
	customUniforms.time.value += delta;
//keeps it on tunnel path
  MovingCube.position.z +=(p3.z-MovingCube.position.z);
    MovingCube.position.x += (p3.x-(MovingCube.position.x));MovingCube.position.x += addx;
    if ( count > 100)
    {
    count = 0;
    }
count++;
    MovingCube.position.y += (p3.y-MovingCube.position.y);
        MovingCube.position.y += addy;

		
	// move movable ball
if (keyboard.pressed("A"))
    addy -= moveDistance;
	if ( keyboard.pressed("D") )
    addy += moveDistance;
    if ( keyboard.pressed("W") )
	  addx += moveDistance;
	if ( keyboard.pressed("S") )
		addx -= moveDistance;

   MovingCube.rotation.x += rotateAngle;
	 MovingCube.rotation.y += rotateAngle;
	 MovingCube.rotation.z += rotateAngle;


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
 //distance traveled
	this.travelledStep = 0.0;

	//used to rotates
    this.rotationStep = 0.0;

    // Creates the renderer.
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


    // Creates the scene and sets up the camera.
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
//directionalLight3.color.setRGB(.8, .4, .4);
this.scene.add( directionalLight3 );


numpoints = 90;
 Main.TRAVEL_INCREMENT   = .000015*(1000/numpoints);
    // Create the tunnel and add it to the scene.
 this.generatePoints(numpoints,40,60);
 
 for (var fu = 0; fu < maxtunnels; fu++ )
 {
     var color;
     color = getRandomColor();
     this.geom = this.generateTunnelGeometry2(points, 2048, .075, 3, 9);
      tunnels.push(this.createTunnelMesh2(this.geom, color,color));
       this.scene.add(tunnels[fu]);
  }
  
        	this.geom = this.generateTunnelGeometry(3072, 12, 40);
    this.tunnel = this.createTunnelMesh(this.geom);
    this.scene.add(this.tunnel);
  //code for cube that I replces with defrming sphere
   /*     	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/xneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/ypos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/yneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/zneg.png' ) }));
	var MovingCubeMat = new THREE.MeshFaceMaterial(materialArray);
	var MovingCubeGeom = new THREE.CubeGeometry( 1, 1, 1, 1, 1, 1, materialArray );*/
	//MovingCube = new THREE.Mesh( MovingCubeGeom, MovingCubeMat );
	
   // MovingCube.position.set(points[0].x+5, points[0].y+5, points[0].z + 10);
	//this.scene.add( MovingCube );

    //DEFORMED SPHERE TEXTURE CODE

    	var lavaTexture = new THREE.ImageUtils.loadTexture( 'http://i252.photobucket.com/albums/hh35/optics2/rainbow2.png.html');
	lavaTexture.wrapS = lavaTexture.wrapT = THREE.RepeatWrapping; 
	//  distortion speed multiplyer		
	var baseSpeed = 0.08;
	// number of times to repeat texture in each direction
	var repeatS = repeatT = 4.0;
	
	// texture used to generate "randomness", distort all other textures
	var noiseTexture = new THREE.ImageUtils.loadTexture( 'http://i252.photobucket.com/albums/hh35/optics2/cloud.png' );
	noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping; 
	// magnitude of noise effect
	var noiseScale = 0.6;
	
	// texture to additively blend with base image texture
	var blendTexture = new THREE.ImageUtils.loadTexture( 'http://i252.photobucket.com/albums/hh35/optics2/rainbow2.png.html' );
	blendTexture.wrapS = blendTexture.wrapT = THREE.RepeatWrapping; 
	// multiplier for distortion speed 
	var blendSpeed = 0.01;
	// adjust lightness/darkness of blended texture
	var blendOffset = 0.25;

	// texture to determine normal displacement
	var bumpTexture = noiseTexture;
	bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
	// multiplier for distortion speed 		
	var bumpSpeed   = 0.19;
	// magnitude of normal displacement
	var bumpScale   = 2.5;
	
	// use "this." to create global object
	customUniforms = {
		baseTexture: 	{ type: "t", value: lavaTexture },
		baseSpeed:		{ type: "f", value: baseSpeed },
		repeatS:		{ type: "f", value: repeatS },
		repeatT:		{ type: "f", value: repeatT },
		noiseTexture:	{ type: "t", value: noiseTexture },
		noiseScale:		{ type: "f", value: noiseScale },
		blendTexture:	{ type: "t", value: blendTexture },
		blendSpeed: 	{ type: "f", value: blendSpeed },
		blendOffset: 	{ type: "f", value: blendOffset },
		bumpTexture:	{ type: "t", value: bumpTexture },
		bumpSpeed: 		{ type: "f", value: bumpSpeed },
		bumpScale: 		{ type: "f", value: bumpScale },
		alpha: 			{ type: "f", value: 1.0 },
		time: 			{ type: "f", value: 1.0 }
	};
	
	// create custom material from the shader code above
	//   that is within specially labeled script tags
	customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: customUniforms,
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	}   );
		
	var ballGeometry = new THREE.SphereGeometry( 1, 64, 64 );
	MovingCube = new THREE.Mesh(ballGeometry, customMaterial );
	MovingCube.position.set(points[0].x+5, points[0].y+5, points[0].z + 10);
	this.scene.add( MovingCube );




    for (var fu = 0; fu < maxballs; fu++) {
        var particleGroup, particleAttributes;
        var particleTexture = THREE.ImageUtils.loadTexture('http://i252.photobucket.com/albums/hh35/optics2/spark.png');

        particleGroup = new THREE.Object3D();
        particleAttributes = { startSize: [], startPosition: [], randomness: [] };

        var totalParticles = 100;
        var radiusRange = 2;
        for (var i = 0; i < totalParticles; i++) {
            var spriteMaterial = new THREE.SpriteMaterial({ map: particleTexture, useScreenCoordinates: false, color: 0xffffff });

            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(1, 1, .4); // imageWidth, imageHeight
            sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            
            sprite.position.setLength(radiusRange * (Math.random() * 0.1 + 0.9)); //makes a hollow sphere

            sprite.material.color.setRGB(Math.random(), Math.random(), Math.random());
            sprite.material.color.setHSL(Math.random(), 1.9, 0.7);

            sprite.opacity = 0.60; // translucent particles //,6

            sprite.material.blending = THREE.NormalBlending; 

            particleGroup.add(sprite); //add them to arrays for use in other methods
            particleAttributes.startPosition.push(sprite.position.clone());
            particleAttributes.randomness.push(Math.random());
        }
        particleGroup.position.set(points[0].x + 5, points[0].y + 5, points[0].z + 10);//set initial position
        particlegroupsAttributes.push(particleAttributes);
        particlegroups.push(particleGroup);
        this.scene.add(particleGroup);
         randompaths.push( this.generaterandom(points, 1048, 4, 1, 9));//set path of particle
         randomx.push(Math.random());
         randomy.push(Math.random());
         randomz.push(Math.random());
    }
     






    //CREATES GUI And handles gui reaction and responses


       	
	gui = new dat.GUI();
	
	parameters = 
	{
		x: 0, y: 30, z: 0,
		color: "#ff80ff", // color (change "#" to "0x")
        color2: "#ff4Dff",
         color3: "#ff66ff",
         numballs: 5,
         ballpulse: .4,
         numtunnels: 10,
         speed: .000015*(1000/numpoints),
         rotatespeed: .0025,
         manualrotatemode : 0,
         manualrotatespeed: 1.000,
          movablesphere : 0,
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
    var bpulse = gui.add( parameters, 'ballpulse' ).min(0).max(1.5).step(.1).name('Ball Pulse').listen();
	bpulse.onChange(function(value)
	{   pulse = value;   });
        var numbtunnels = gui.add( parameters, 'numtunnels' ).min(0).max(maxtunnels).step(1).name('Number of Lines').listen();
	numbtunnels.onChange(function(value)
	{   numtunnels = value;   });

    var speed = gui.add( parameters, 'speed' ).min(0.00001).max(.0009).step(0.00001).name('Speed').listen();
	speed.onChange(function(value)
	{   Main.TRAVEL_INCREMENT = value;   });

       var rotatespeed = gui.add( parameters, 'rotatespeed' ).min(0).max(.12).step(0.0001).name('RotateSpeed').listen();
	rotatespeed.onChange(function(value)
	{   Main.ROTATION_INCREMENT = value;   });

         var manualrotatemode = gui.add( parameters, 'manualrotatemode' ).min(0).max(3).step(1).name('Manual Mode').listen();
	manualrotatemode.onChange(function(value)
	{   manualrotate = value;
        
         });
      var manualrotatespeed = gui.add( parameters, 'manualrotatespeed' ).min(1).max(10).step(0.5).name('ManualRotateSpeed').listen();
      manualrotatespeed.onChange(function (value) {
          var oldspeed = rotationspeed;
          rotationspeed = value;
          controlledrotation = controlledrotation / (rotationspeed/oldspeed);
      });
        var movablesphere = gui.add( parameters, 'movablesphere' ).min(0).max(1).step(1).name('Movable Sphere').listen();
        movablesphere.onChange(function (value) {
            if (value)
                MovingCube.visible = true;
            else MovingCube.visible = false;
        });

	
	gui.open();



    MovingCube.visible = false;




	

	camerarotate = -Math.PI / 2;//initialize camera rotation
    camerarotate2 = -Math.PI / 2;


    // Kick off the main loop.
    this.render();
}

// Constants
Main.prototype.generatePoints = function(numPoints, variance, distancebetween)//generates random points to be uses for other paths
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

Main.prototype.generateTunnelGeometry = function(segments, radius, radiusSegments)//gennerates tunnel from points
{
	
    // generates a line curve from points.
    spline = new THREE.SplineCurve3(points);
    
    //generates a geometry.
    return new THREE.TubeGeometry(spline, segments, radius, radiusSegments, false);
}
Main.prototype.generaterandom = function (vertices, segments, radius, radiusSegments, radius2) {//generates random tunnel lines
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

Main.prototype.createTunnelMesh2 = function (geom, color, ambient) {//creates mesh maps texture and geom
    
    var texture = THREE.ImageUtils.loadTexture("http://i252.photobucket.com/albums/hh35/optics2/water.jpg");
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

    // material.map = THREE.ImageUtils.loadTexture("http://i252.photobucket.com/albums/hh35/optics2/water.jpg");
    //   material.needsUpdate = true;
    return new THREE.Mesh(geom, material);
}
Main.prototype.createpath = function (geom) {//creates paths

    var texture = THREE.ImageUtils.loadTexture("http://i252.photobucket.com/albums/hh35/optics2/water.jpg");
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
    // material.map = THREE.ImageUtils.loadTexture("http://i252.photobucket.com/albums/hh35/optics2/water.jpg");
    //   material.needsUpdate = true;
    return new THREE.Mesh(geom, material);
}

Main.prototype.createTunnelMesh = function (geom) {//creates tunnel maps texture

    var texture = THREE.ImageUtils.loadTexture("http://i252.photobucket.com/albums/hh35/optics2/water.jpg");
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
    // material.map = THREE.ImageUtils.loadTexture("http://i252.photobucket.com/albums/hh35/optics2/water.jpg");
    //   material.needsUpdate = true;
    return new THREE.Mesh(geom, material);
}

Main.prototype.render = function () {//renderer method handles rendering after setup is complete handles modes etc

    if (this.travelledStep > .95 - Main.TRAVEL_INCREMENT) {
        this.travelledStep = 0.0;
    }

    spline = new THREE.SplineCurve3(points);
    var p1 = spline.getPointAt(this.travelledStep);
    var p2 = spline.getPointAt(this.travelledStep + Main.TRAVEL_INCREMENT);
    this.camera.position.set(p1.x, p1.y, p1.z);//set camera location aka move
    this.camera.lookAt(p2);//set camera new look location, make it look down tunnel
    var p3 = spline.getPointAt(this.travelledStep + 12 * .00015);
    //manual rotate modes
       if (manualrotate == 3) {//Hyper Mode/Seizure Mode
   
    this.camera.rotation.z = camerarotate + (controlledrotation * rotationspeed) + (Math.sin(this.rotationStep) * Math.PI);
    camerarotate2 =  this.camera.rotation.z - (Math.sin(this.rotationStep) * Math.PI);
    this.rotationStep += Main.ROTATION_INCREMENT;
    camerarotate = this.camera.rotation.z;

    //controlledrotation = 0;
    } /*HYPER MODE! */

    if (manualrotate == 2) {//Both Mode
        //alert(controlledrotation);
        if (lastmode == 1) {
            camerarotate = camerarotate2;
            controlledrotation = 0;
        }
        else if (lastmode == 0) {
            controlledrotation = 0;
            // this.rotationStep = 0;
            camerarotate = camerarotate - (Math.sin(this.rotationStep) * Math.PI);
        }
        this.camera.rotation.z = camerarotate + (controlledrotation * rotationspeed) + (Math.sin(this.rotationStep) * Math.PI);
        camerarotate2 = this.camera.rotation.z - (Math.sin(this.rotationStep) * Math.PI);
        this.rotationStep += Main.ROTATION_INCREMENT;
        lastmode = 2;
        camerarotate3 = this.camera.rotation.z;

       
    }
    else if (manualrotate) {//Manual Mode
        
        if (lastmode == 2) {
            camerarotate = camerarotate3;

            controlledrotation = 0;
        }
        else if (lastmode == 0)
            controlledrotation = 0;
        this.camera.rotation.z = camerarotate + (controlledrotation * rotationspeed);
        camerarotate2 = this.camera.rotation.z - (Math.sin(this.rotationStep) * Math.PI);
        lastmode = 1;
        
    }
    else {//automatic mode

        this.camera.rotation.z = camerarotate2 + (Math.sin(this.rotationStep) * Math.PI);
        this.rotationStep += Main.ROTATION_INCREMENT;
        camerarotate = this.camera.rotation.z;
        controlledrotation = 0;
        lastmode = 0;

    }


    this.travelledStep += Main.TRAVEL_INCREMENT;

    if (first == 1) {//handles first instaces of rendering
        MovingCube.position.set(p3.x, p3.y, p3.z);
        first = 0;
    }
    else


     
      update(p3);//updates movable sphere
        if (random == 1) {//updates sprite groups
            for (var fu = 0; fu < numglowsphers; fu++) {
                spline = new THREE.SplineCurve3(randompaths[fu]);
                var p4 = spline.getPointAt(this.travelledStep + 20 * .00015);
                update2(p4, fu);
            }

        }
    for (var fu = 0; fu < maxtunnels; fu++) {//updates tunnels to visible or not
        if (fu < numtunnels)
            tunnels[fu].visible = true;
        else
            tunnels[fu].visible = false;
    }
    stats.update();//fps counter
    requestAnimationFrame(this.render.bind(this));
    this.webGLRenderer.render(this.scene, this.camera);//render frame
}

Main.prototype.resize = function()
{
	this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);
	this.camera.aspect = window.innerWidth / window.innerHeight;
	this.camera.updateProjectionMatrix();
}

