function emitter() {// Put the main code
  // // to keep track of the mouse position
  // var mouseX = 0, mouseY = 0;
  var camera,
  // 3d objects
  emitters = [],
  fov = 30,
  // create shader objects
  // create attributes for vertex shader
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

    // create a sphere and assign the material

    //create settings for particles
    // create the renderer and attach it to the DOM
    renderer = new THREE.WebGLRenderer();
    // renderer.shadowMapEnabled = true;
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    $('#container').append(renderer.domElement);
    // emitter = emitterFactory(1,1);
    // function beatDetection() {
        //might be used later
    // };
    for (var i = 0; i < 512; i++) {
      var x = Math.floor(i/16);
      var y = i % 16;
      emitters.push(emitterFactory(x * 20, y * 20))
    }
  };
  var emitterFactory = function(x, y) {
    var settings = {
      //where particles start
      positionStyle  : Type.SPHERE,
      positionBase   : new THREE.Vector3( x, y, 0 ),
      positionRadius : 10,

      velocityStyle  : Type.SPHERE,
      speedBase      : 90,
      speedSpread    : 10,
      accelerationBase : new THREE.Vector3( 0, 0, -80  ),
      particleTexture : THREE.ImageUtils.loadTexture( 'images/white.png' ),
      blendStyle   : THREE.AdditiveBlending,

      sizeTween    : new Tween( [5], [14] ),//size of particles
      sizeBase    : 0.9,
      sizeSpread  : 0.5,
      colorBase   : new THREE.Vector3(1, 1, 1), // H,S,L
      colorSpread : new THREE.Vector3(1, 1, 1),
      opacityBase : 1,

      particlesPerSecond : 10,
      particleDeathAge   : 10,
      emitterDeathAge    : 500
    };
    var engine = new ParticleEngine()
    engine.setValues(settings);//starting the particle engine
    engine.initialize();
    // emitters.push(engine);
    return engine;
  }

  function render() {
    //Getting data
    var TimeDomain = getTimeDomain();
    var frequencies = getFrequencies();
    var red = frequencies[5]/255;
    var green = frequencies[7]/255;
    var blue = frequencies[10]/255;
    // Create firework at each frequency bin
    for (var i = 0; i < frequencies.length; i++) {
      frequency = frequencies[i];
      if (frequency > 128) {
        console.log("true");
        emitters[i].speedBase = emitters[i].speedBase * -1;
      }
    }
    // emitters[0].speedSpread += 1;

    //updating each element
    //engine updater
    for (var i = 0; i < emitters.length; i++) {
      var emitter = emitters[i];
      emitter.update(0.01 * 1.5);
    }
    // remove dead emitters
    if (emitters.length > 512) {
      emitters.shift();
    }
    renderer.render( scene, camera );
    currentAnimationId = requestAnimationFrame( render );
    controls.update();
  };

  // Begin
  init();
  render();
};