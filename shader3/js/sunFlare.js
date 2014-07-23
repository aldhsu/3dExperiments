function sunFlare() {// Put the main code
  // // to keep track of the mouse position
  // var mouseX = 0, mouseY = 0;
  var camera,
  // 3d objects
  verts, material, mesh, cloudSystem,
  fov = 30,
  // create shader objects
  // create attributes for vertex shader
  attributes = {
    displacement: {
      type: 'f',
      value: []
    }
  },
  //create uniform for fragment shader
  uniforms = {
    red: {
      type: 'f', // a float
      value: 0
    },
    green: {
      type: 'f', // a float
      value: 0
    },
    blue: {
      type: 'f', // a float
      value: 0
    },
    texture1: {type: "t", value: THREE.ImageUtils.loadTexture( "explosion.png" )}
  },
  // may not be used
  volumeMusic = [];

  var init = function() {
    //3d creation
    // create a scene
    scene = new THREE.Scene();

    // create a camera the size of the browser window
    // and place it 100 units away, looking towards the center of the scene
    camera = new THREE.PerspectiveCamera(
        fov,
        window.innerWidth / window.innerHeight,
        1,
        10000 );
    camera.position.z = 1000;
    camera.target = new THREE.Vector3( 0, 0, 0 );
    scene.add( camera );

    // create a material for globe
    material = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      attributes: attributes,
      vertexShader: $('#vertexShader').text(),
      fragmentShader: $('#fragmentShader').text()
    });
    material.depthTest = true;

    // create a sphere and assign the material
    mesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry( 20, 4 ),
        material
    );

    verts = mesh.geometry.vertices; 
    // create cloud
    // cloud vector builder
    function vectorFactory(bounds) {
      var x = Math.random() * bounds - bounds/2;
      var z = Math.random() * bounds - bounds/2;
      var y = Math.random() * bounds - bounds/2;
      return new THREE.Vector3(x ,y, z);
    }
    // create cloudGeom
    var points = 200000;
    var cloudGeom = new  THREE.Geometry();
    for (var i = 0; i < points; i++) {
      cloudGeom.vertices.push(vectorFactory(10000))
    }
    // create material
    var cloudMat = new THREE.PointCloudMaterial({
      color: 0xFFFFFF,
      size: 20,
      map: THREE.ImageUtils.loadTexture(
        "images/particle.png"
      ),
      blending: THREE.AdditiveBlending,
      transparent: true    });
    cloudSystem = new THREE.PointCloud(cloudGeom, cloudMat);
    scene.add(cloudSystem);
    console.log(cloudSystem);

    // create the renderer and attach it to the DOM
    renderer = new THREE.WebGLRenderer();
    // renderer.shadowMapEnabled = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    $('#container').append(renderer.domElement);
    scene.add( mesh );

    // function beatDetection() {
        //might be used later
    // };
  };

  function render() {
    //Getting data
    var values = attributes.displacement.value;
    var TimeDomain = getTimeDomain();
    var frequency = getFrequencies();
    var red = frequency[5]/255;
    var green = frequency[7]/255;
    var blue = frequency[10]/255;
    cloudSystem.rotation.y += 0.0001;
    //updating each element
    //vertices updater
    attributes.displacement.needsUpdate = true;
    for (var v = 0; v < verts.length; v++) {
      attributes.displacement.value[v] = TimeDomain[(v) % TimeDomain.length];
    }
    //future beat detection particle reactions
    // var currentVolume = _.reduce(TimeDomain.subarray(0,300), function(memo, num) { return memo + num;}, 0)
    // volumeMusic.push(currentVolume);
    // if (volumeMusic.length > 30) volumeMusic.shift();
    // if (_.max(volumeMusic) == currentVolume) {
    //   velocityBase     : new THREE.Vector3( 1000, 1000, 1000 );
    //   accelerationBase : new THREE.Vector3( 1000, 1000, 1000 );
    //   velocityStyle    : 1;
    //   engine.positionSpread.x += 100;
    //   engine.positionSpread.y += 100;
    //   engine.positionSpread.z += 100;
    //   particlesPerSecond : 7000;
    //   particleDeathAge   : 1.0;
    //   emitterDeathAge    : 120;
    // }
    renderer.render( scene, camera );
    currentAnimationId = requestAnimationFrame( render );
    controls.update();
  };

  // Begin
  init();
  render();
};
