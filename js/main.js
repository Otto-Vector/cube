
window.onload = init

var scene, camera, renderer, domEvents

function init() {
  //////////Задал основные константы///////
  const cubes_maximum = Math.floor(Math.random() * 15) + 2 //произвольное количество кубов, но не меньше 2

  const cube_color = 0x000000 //цвет рёбер куба по умолчанию

  var edge = [] //двумерный массив для рёбер кубов
  var spheres = [] //двумерный массив для сфер кубов
  var cube_with_spheres_in_corner = [] //массив для сгруппированных объектов каждого куба

  const points_array = [ [-1,0,0], [0,1,0], [1,0,0], [0,-1,0], //ближний квадрат
                         [-1,0,1], [0,1,1], [1,0,1], [0,-1,1] ] //дальний квадрат
  
  const communication_array = [ [0,1], [1,2], [2,3], [3,0], //связь рёбер основания куба
                                [4,5], [5,6], [6,7], [7,4], //связь рёбер верхнего квадрата куба
                                [0,4], [1,5], [2,6], [3,7] ] // связь рёбер между верхним и нижним квадратом куба

  ///////////////////////////////////////////////////////////////////////////  
  //добавил сцену
  scene = new THREE.Scene();
  scene.background = new THREE.Color( "whitesmoke" ) //задал сцене задний фон
  
  //настроил параметры камеры
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 )
  camera.position.set( 0, 0, 150 ) //позиция камеры
  camera.lookAt( 0, 0, 0 ) //смотреть в центр координат
  
  //выбрал рендер
  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize( window.innerWidth-4, window.innerHeight-4 ) //отнял по 4 пикселя, потому что появляется прокрутка

  //добавление скрипта к документу в тег
  document.body.appendChild( renderer.domElement )
  
  window.addEventListener('resize', onWindowResize, false)


///////////////////////////////////////////////////////////////////////////////
  //конструктор линий для куба
  function lines_for_cube(numb_x = 10, numb_y = numb_x, numb_z = numb_x * 1.5) {

    let geometry_for_line = edge_in_function = []
    let x_start, y_start, z_start //задание переменных для начальных координат линии вектора
    let x_finish, y_finish, z_finish //задание переменных для финишных координат линии вектора
    
    for (let i = 0 ; i < communication_array.length ; i++ ) {

      geometry_for_line[i] = new THREE.Geometry()
      
      x_start = numb_x * points_array [ communication_array[i][0] ] [0]
      y_start = numb_y * points_array [ communication_array[i][0] ] [1]
      z_start = numb_z * points_array [ communication_array[i][0] ] [2]
      
      geometry_for_line[i].vertices.push( new THREE.Vector3( x_start, y_start, z_start ) )

      x_finish = numb_x * points_array [ communication_array[i][1] ] [0]
      y_finish = numb_y * points_array [ communication_array[i][1] ] [1]
      z_finish = numb_z * points_array [ communication_array[i][1] ] [2]
      
      geometry_for_line[i].vertices.push( new THREE.Vector3( x_finish, y_finish, z_finish ) )


      edge_in_function[i] = ( new THREE.Line(
                                geometry_for_line[i],
                                new THREE.LineBasicMaterial( { color: 0x000000 } )
                                )
                            );

    }

    return edge_in_function

  }

  ////////функция сборки сфер по углам куба////////////////
  function spheres_for_cube(numb_x = 10, numb_y = numb_x, numb_z = numb_x * 1.5) {

    let geo = new THREE.SphereGeometry( numb_x * 0.13, 32, 32 ) //меняет размер в зависимости от величины квадрата
    let sphere = []

    for (var i = 0; i < points_array.length; i++) {
    
      let x = numb_x * points_array[i][0]
      let y = numb_y * points_array[i][1]
      let z = numb_z * points_array[i][2]

      sphere[i] = new THREE.Mesh( geo )
      sphere[i].position.set( x, y, z )
      sphere[i].material.color.set( Math.random() * 0xffffff ) //задание произвольного цвета сфер

    }

    return sphere
  }
  
  //////////////////////////////////////////////////////////////////////

  //Cоздание куба из линий массива в группу///
  function complete_to_object(next) {

    //объявление переменных
    let edge_cube = new THREE.Group()
    let spheres_in_corner = new THREE.Group()

    let random_size = Math.random() * 10 + 5
    edge[next] = lines_for_cube(random_size)
    spheres[next] = spheres_for_cube(random_size)
    
    //группировка массивов объектов в подгруппы ребер и сфер
    for (let i = 0; i < edge[next].length; i++) { edge_cube.add( edge[next][i] ) }
    for (let i=0; i < spheres[next].length; i++) spheres_in_corner.add( spheres[next][i] )

    //соединение двух групп в одну группу куб со сферами в углах
    cube_with_spheres_in_corner[next] = new THREE.Group()
    cube_with_spheres_in_corner[next].add(edge_cube)
    cube_with_spheres_in_corner[next].add(spheres_in_corner)

    //задание рандомной позиции в пространстве координат
    cube_with_spheres_in_corner[next].position.set( Math.random()*100, Math.random()*100, Math.random()*25)

  }
  
  /////добавление объектов на экран//////////
    for (var next=0; next < cubes_maximum; next++) {
      complete_to_object(next);
      scene.add( cube_with_spheres_in_corner[next] )
    }
  

  ////анимация объектов////////////////////
  animate()

  function animate() {
  
    requestAnimationFrame( animate )
    render()
  
  }

  function render() {
  
    //задание значений для поворота объекта
    function rotation( name_of_object, x, y ) {
    
      name_of_object.rotation.x += x/200
      name_of_object.rotation.y += y/200
    
    }

    for (let i=0; i < cubes_maximum; i++) //нечетные крутятся в другую сторону
      rotation( cube_with_spheres_in_corner[i], (i%2)? 2 : -1, (i%2)? 1 : -2 )

    renderer.render( scene, camera )
  
  }


  ///////// применил отслеживание по клику с помощью библиотеки threex.domevents.js ////////
  var domEvents = new THREEx.DomEvents(camera, renderer.domElement)
  
  for (let n = 0; n < cubes_maximum; n++) {
    for (let sphere_num = 0; sphere_num < spheres[n].length; sphere_num++) {

      domEvents.addEventListener( spheres[n][sphere_num], 'click', (event) => {
        for (let n = 0; n < cubes_maximum; n++) {
          //проверяет на какую из сфер было нажато и передаёт значение индекса в found_at
          var found_at = [];
          for (let i = 0; i < spheres[n].length; i++ ) {
            found_at[n] = ( event.target.uuid == spheres[n][i].uuid ) ? i : found_at[n];
          }
          //перекраска рёбер, исходящих из нажатой сферы в её цвет
          for (let i = 0; i < communication_array.length; i++) { //сверяется по массиву communication_array
              if ( communication_array[i][0] == found_at[n] || communication_array[i][1] == found_at[n] )
              edge[n][i].material.color.set(spheres[n][found_at[n]].material.color)
          }
        }
      })

    }
  }


}

/////функция изменения центровки камеры при изменении размера экрана///////////////
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth-4, window.innerHeight-4);
  
}
