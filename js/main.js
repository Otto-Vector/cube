
window.onload = init

var scene, camera, renderer, domEvents

function init() { 
  
  //добавил сцену
  scene = new THREE.Scene();
  scene.background = new THREE.Color( "whitesmoke" )
  
  //настроил параметры камеры
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 )
  camera.position.set( 0, 0, 75 ) //позиция камеры
  camera.lookAt( 0, 0, 0 )
  
  //выбрал рендер
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize( window.innerWidth-4, window.innerHeight-4 )

  //добавление скрипта к документу в тег
  document.querySelector("body").appendChild( renderer.domElement )
  
  window.addEventListener('resize', onWindowResize, false)

  const points_array = [ [-1,0,0], [0,1,0], [1,0,0], [0,-1,0], //ближний квадрат
                         [-1,0,1], [0,1,1], [1,0,1], [0,-1,1] ] //дальний квадрат
  
  const communication_array = [ [0,1], [1,2], [2,3], [3,0], //связь рёбер основания куба
                                [4,5], [5,6], [6,7], [7,4], //связь рёбер верхнего квадрата куба
                                [0,4], [1,5], [2,6], [3,7] ] // связь рёбер между верхним и нижним квадратом куба

  const cube_color = 0x000000 //цвет рёбер куба по умолчанию

  //Линии для куба
  function lines_for_cube(numb_x = 10, numb_y = numb_x, numb_z = numb_x * 1.5) {

    var geometry_for_line = []
    
    for (let i = 0 ; i < communication_array.length ; i++ ) {

      geometry_for_line[i] = new THREE.Geometry()
      
      let x_start = numb_x*points_array[communication_array[i][0]][0]
      let y_start = numb_y*points_array[communication_array[i][0]][1]
      let z_start = numb_z*points_array[communication_array[i][0]][2]
      
      geometry_for_line[i].vertices.push( new THREE.Vector3( x_start, y_start, z_start ) )

      let x_finish = numb_x*points_array[communication_array[i][1]][0]
      let y_finish = numb_y*points_array[communication_array[i][1]][1]
      let z_finish = numb_z*points_array[communication_array[i][1]][2]
      
      geometry_for_line[i].vertices.push( new THREE.Vector3( x_finish, y_finish, z_finish ) )

    }

    return geometry_for_line

  }

  ////////функция сборки сфер по углам куба////////////////
  function sphere_xyz(numb_x = 10, numb_y = numb_x, numb_z = numb_x * 1.5) {

    var geo = new THREE.SphereGeometry( 1, 32, 32 )
    var sphere = []

    for (var i = 0; i < points_array.length; i++) {
    
      let x = numb_x*points_array[i][0]
      let y = numb_y*points_array[i][1]
      let z = numb_z*points_array[i][2]

      sphere[i] = new THREE.Mesh( geo )
      sphere[i].position.set( x, y, z)
      sphere[i].material.color.set( Math.random() * 0xffffff ) //задание произвольного цвета сфер

    }

    return sphere
  }
  
  //Cоздание куба из линий массива в группу
  var geometry_for_line = lines_for_cube(10)
  var edge_cube = new THREE.Group()
  var line_set = edge = []

  for (let i = 0; i < communication_array.length; i++) {
    //поменял размер линий с помощью библиотеки THREE.MeshLine.js
    line_set[i] = new MeshLine()
    line_set[i].setGeometry( geometry_for_line[i], function( p ) { return 0.5 } ) //return и есть ширина линии

    edge[i] = new THREE.Mesh( line_set[i].geometry, new MeshLineMaterial() )
    edge[i].material.color.set( cube_color )

    edge_cube.add( edge[i] )

  }

  ///Cоздание сфер в куб на 10 и назначение их в массив////////////////////////
  var spheres = sphere_xyz(10)
  
  ////группировка объектов в куб со сферами/////////////////////
  var spheres_in_corner = new THREE.Group()

  for (let i=0; i < spheres.length; i++) spheres_in_corner.add( spheres[i] )

  var cube_with_spheres_in_corner = new THREE.Group()
  cube_with_spheres_in_corner.add(edge_cube)
  cube_with_spheres_in_corner.add(spheres_in_corner)

  /////добавление объектов на экран//////////
  scene.add( cube_with_spheres_in_corner )

  ////анимация объектов////////////////////
  animate()

  function animate() {
  
    requestAnimationFrame( animate )
    render()
  
  }

  function render() {
  
    //задание значений для поворота объекта
    function rotation( name_of_object, x, y ) {
    
      name_of_object.rotation.x += x/100
      name_of_object.rotation.y += y/100
    
    }
    
    rotation( cube_with_spheres_in_corner, 2, 1 )

    renderer.render( scene, camera )
  
  }


  ///////// применил отслеживание по клику с помощью библиотеки threex.domevents.js ////////
  var domEvents = new THREEx.DomEvents(camera, renderer.domElement)
  
  for (sphere_num = 0; sphere_num < spheres.length; sphere_num++) {
    domEvents.addEventListener( spheres[sphere_num], 'click', (event) => {
      
      var num = 0;
      //проверяет на какую из сфер было нажато и передаёт значение индекса в num
      for (let i = 0; i < spheres.length; i++ ) {
        num = (event.target.uuid == spheres[i].uuid) ? i : num;
      }

      //перекраска рёбер, исходящих из нажатой сферы в её цвет
      for (let i = 0; i < communication_array.length; i++) {
          if (communication_array[i][0] == num || communication_array[i][1] == num )
          edge[i].material.color.set(spheres[num].material.color)
      }

    })
  }


}

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth-4, window.innerHeight-4);
    
  }
