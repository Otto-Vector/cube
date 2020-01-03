window.onload = init;

function init() {
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.querySelector("#scene").appendChild( renderer.domElement );

  var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
  camera.position.set( 0, 0, 100 );
  camera.lookAt( 0, 0, 0 );

  var scene = new THREE.Scene();
  scene.background = new THREE.Color( "whitesmoke" );

  var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );


  function one_cube(numb_x=10, numb_y=10, numb_z=15) {
    var geo_n = new THREE.Geometry();
    var cube = [[-1,0,0],[0,1,0],[1,0,0],[0,-1,0],[-1,0,0],[-1,0,1],
      [0,1,1],[1,0,1],[0,-1,1],[-1,0,1],[-1,0,0],[0,1,0],[0,1,1],[1,0,1],
      [1,0,0],[0,-1,0],[0,-1,1]];
    for (var i = 0; i < cube.length; i++)
      geo_n.vertices.push(new THREE.Vector3( numb_x*cube[i][0], numb_y*cube[i][1], numb_z*cube[i][2]) );

    return geo_n;
  }

  var geo = new THREE.SphereGeometry( 1, 32, 32 );
  var mat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  var sphere = new THREE.Mesh( geo, mat );
  sphere.position.x = 25;
  scene.add( sphere );

  var geometry = one_cube();
  var geometry2 = one_cube( 9,9,14 );

  var line = new THREE.Line( geometry, material );
  var line2 = new THREE.Line( geometry2, material );
  line2.position.x = 25;
  line2.position.y = 25;
  line2.material = new THREE.LineBasicMaterial( { color: "red"} )
  scene.add( line );
  scene.add( line2 );

  animate();

  function animate() {
          // note: three.js includes requestAnimationFrame shim
          requestAnimationFrame( animate );
          render();
      }

  function render() {
      line.rotation.x += 0.01;
      line.rotation.y += 0.02;
      line2.rotation.y += 0.01;
      line2.rotation.x += 0.02;
      renderer.render( scene, camera );
    }

  document.querySelector("#scene").onclick = function () {
    line.material = new THREE.LineBasicMaterial( { color: 0x00ff00} )
    scene.background = new THREE.Color( Math.random()*0x00ff00 );
 }
}