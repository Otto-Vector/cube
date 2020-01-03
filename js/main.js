window.onload = init;

var scene, camera, renderer;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( "whitesmoke" );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
  camera.position.set( 0, 0, 100 ); //позиция камеры
  camera.lookAt( 0, 0, 0 );
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  //добавление скрипта к документу в тег
  document.querySelector("#scene").appendChild( renderer.domElement );
  
  //функция для создания куба из линий vector3
  function one_cube( numb_x = 10, numb_y = numb_x, numb_z = numb_x * 1.5 ) {
    var geometry_n = new THREE.Geometry();
    var cube_array = [ [-1,0,0], [0,1,0], [1,0,0], [0,-1,0], [-1,0,0], [-1,0,1],
      [0,1,1], [1,0,1], [0,-1,1], [-1,0,1], [-1,0,0], [0,1,0], [0,1,1], [1,0,1],
      [1,0,0], [0,-1,0], [0,-1,1] ];
    for (var i = 0; i < cube_array.length; i++)
      geometry_n.vertices.push( new THREE.Vector3( numb_x*cube_array[i][0], numb_y*cube_array[i][1], numb_z*cube_array[i][2]) );

    return geometry_n;
  }
  function sphere_xyz(numb_x = 10, numb_y = numb_x, numb_z = numb_x * 1.5) {
    var sphere_array = [ [-1,0,0], [0,1,0], [1,0,0], [0,-1,0], [-1,0,1],
    [0,1,1], [1,0,1], [0,-1,1] ];
    var geo = new THREE.SphereGeometry( 1, 32, 32 );
    var mat = new THREE.MeshBasicMaterial( {color: Math.random() * 0xff0000} );
    var sphere = [];
    for (var i = 0; i < sphere_array.length; i++) {
      sphere[i] = new THREE.Mesh( geo, mat );
      sphere[i].position.set( numb_x*sphere_array[i][0], numb_y*sphere_array[i][1], numb_z*sphere_array[i][2]);
      mat = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff} );
    }
    return sphere;
  }

//////////////////////////BASIC FOR LINEWIDTH CHANGES//////////////
  // var geo_line = new THREE.Geometry();
  // geo_line.vertices.push(new THREE.Vector3( 0,20,0));
  // geo_line.vertices.push(new THREE.Vector3( 20,20,0));
  // var one_line = new MeshLine();
  // one_line.setGeometry( geo_line, function( p ) { return 0.5; } ); //RETURN IS LINEWIDTH
  // var one_line_material = new MeshLineMaterial({color: "blue"});
  // var mesh = new THREE.Mesh( one_line.geometry, one_line_material ); // this syntax could definitely be improved!
  // scene.add( mesh );
  // renderer.render( scene, camera );

////////////////////////////////////////////////////
  // var geo = new THREE.SphereGeometry( 1, 32, 32 );
  // var mat = new THREE.MeshBasicMaterial( {color: 0xffff00} );
  // var sphere = new THREE.Mesh( geo, mat );
  // sphere.position.set( 25, 25, 0 );
  // scene.add( sphere );

////////////////////////////////////////////////////
  var line_set = new MeshLine();
  var line2_set = new MeshLine();
  line_set.setGeometry( one_cube(), function( p ) { return 0.5 } ); //return и есть ширина линии
  line2_set.setGeometry( one_cube( 8 ), function( p ) { return 0.8 } );
  var material = new MeshLineMaterial( { color: "blue" } );

  var line = new THREE.Mesh( line_set.geometry, material );
  var line2 = new THREE.Mesh( line2_set.geometry );
  line2.position.set( 25, 25, 0 );
  line2.material = new MeshLineMaterial( { color: "red" } );

  // scene.add( line );
  scene.add( line2 );

  //////////////////////////////////////////////
  var spheres = sphere_xyz();
  // for (let i=0; i < spheres.length; i++) scene.add(spheres[i]);

  var group = new THREE.Group();
  group.add( line );
  for (let i=0; i < spheres.length; i++) group.add(spheres[i]);
  scene.add( group);

  animate();

    function animate() {
    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    render();
    }

    function render() {
    //задание значений для поворота объекта
    function rotation(name_of_object, x,y) {
    name_of_object.rotation.x += x; name_of_object.rotation.y += y;
    }
    rotation(line2,0.01,0.02);
    rotation(group,0.02,0.01);

    renderer.render( scene, camera );
    }

  document.querySelector( "#scene" ).onclick = function () {
    // line.material = new THREE.LineBasicMaterial( { color: 0x00ff00} )
    scene.background = new THREE.Color( Math.random() * 0x00ff00 );
 }
}