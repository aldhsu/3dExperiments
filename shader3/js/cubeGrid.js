var cubeGrid = function(){
  //Creating the scene and objects
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(60, $(window).width() / $(window).height(), 1, 1000);
  var renderer = new THREE.WebGLRenderer();
  var cubes = new Array(); //Array of cubes
  // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);
  //var controls;

  $('#container').append(renderer.domElement);

  var cubeFactory = function (x,y){

    var geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    var material = new THREE.MeshPhongMaterial({
      color: randomFairColor(),
      ambient: '0x808080',
      specular: 0xffffff,
      shininess: 10,
      reflectivity: 1.5
    });

    //Not sure how this part works, need to figure out.
    var cube = new THREE.Mesh(geometry, material);
    //Left position on screen??
    cube.position.x = x*2;
    cube.position.y = y*2;
    cube.position.z = 30;
    return cube;
  }

  for (i=0; i < 512; i++){
    var x = Math.floor(i/16)-16;
    var y = i % 16;
    var cube = cubeFactory(x,y);
    console.log(cube);
    cubes.push(cube);
    scene.add(cube);
  };

    //Left position on screen??
    //Adds the cubes to the scene.

  console.log(cubes.length)
  //Creates light for the scene. Nothing is visible otherwise;
  // var light = new THREE.AmbientLight(0x505050);
  // scene.add(light);

  //Need to test all that to see what it does.
  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(0,1,1);
  scene.add(directionalLight);
   var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  directionalLight.position.set(-6,1,1);
  scene.add(directionalLight);

  camera.position.z = 50;
  camera.position.x = 0;
  camera.position.y = -50;

  //Draws the cubes and makes them respond to the sound.
  var render = function(){

    var freqPoints = [];
    var freqArray = getTimeDomain();
    var freqData = getFrequencies();
    // Get data and build vertices
    for (var i = 0; i < freqArray.length; i++) {
      cubes[i].position.z = freqArray[i]/50;
    };
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  };

  render();
  renderer.setSize($(window).width(), $(window).height());

  //Creates random colors
  function randomFairColor() {
    var min = 64;
    var max = 224;
    var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
    var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
    var b = (Math.floor(Math.random() * (max - min + 1)) + min);
    return r + g + b;
  }
}//End of cube function