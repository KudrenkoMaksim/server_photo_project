// СЕРВЕР
const http=require('http')
const fs=require('fs')
const { json } = require('stream/consumers')
const { error } = require('console')


// объявление переменных
const avatarNumberMax=6
const avatarNumberMin=1
const arrDescriptionPhoto=['globe man','girl','ghost man','incubator','Darth Vader','soldier man','spaceship','cyborg','Darth Maul',  'spaceship crash','touch','black woman','supercar','spaceship','Ilay','soldier woman','Ukrainian robots','traine','robot mashine', 'military base','future','samurai woman','laboratory','Moon base','Jedi'
]
const likesNumberMax=200
const likesNumberMin=15

const arrCommentsMassages =[
   'Все відмінно!',
   'Загалом все непогано. Але не всі.',
   'Коли ви робите фотографію, добре б прибирати палець із кадру. Зрештою, це просто непрофесійно.',
   'Моя бабуся випадково чхнула з фотоапаратом у руках і у неї вийшла фотографія краща.',
   'Я послизнувся на банановій шкірці і впустив фотоапарат на кота і у мене вийшла фотографія краще.',
   'Обличчя людей на фотці перекошені, ніби їх побивають. Як можна було зловити такий невдалий момент?',
]
const arrCommentatorsName=['Катерина','Дарина','Ярослав','Світлана','Микита','Іштван','Юрій','Максим','Володимир','Оксана','Олеся','Ірина','Богдан']
const idCommentNumberMax=999
const idCommentNumberMin=1


// функции
//случайное число 
function createRandomNumber (min, max) {
   return Math.floor(Math.random()*(max-min)+min)
}
// случайное не повторяющееся число
let arrCheckId=[] 
function createIdComment (min, max) {
   let number=Math.floor(Math.random()*(max-min)+min)
   if (arrCheckId.includes(number) && arrCheckId.length<(max-min)) {
      createIdComment(min, max)
   } else if   (arrCheckId.length>=(max-min)) {
     console.log ('не вистачае діапазону генерації випадкових чисел')
     arrCheckId.push('null')
     arrCheckId.reverse()
   }else {
      arrCheckId.push(number)
      arrCheckId.reverse()
   }
 return arrCheckId[0]
}


// создание объекта комментариев
function createObjComment () {
   const obj=
      {
      id: createIdComment(idCommentNumberMin, idCommentNumberMax),
      avatar: `img/avatar-${createRandomNumber(avatarNumberMin, avatarNumberMax)}.svg`,
      massage: arrCommentsMassages[createRandomNumber(0,arrCommentsMassages.length-1 )],
      name: arrCommentatorsName[createRandomNumber(0,arrCommentatorsName.length-1 )]
      }
   return obj
}


// создание массива объектов комментарие 
const usersComments= new Array(100).fill(null).map((_,i)=>createObjComment())
// console.log(usersComments)

// создание объекта с фотками
function createObjPhoto (i) {
 const obj=
   {
      id: parseFloat(i),
      url: `photos/${i+1}.jpg`,
      description: arrDescriptionPhoto[i],
      likes:createRandomNumber(likesNumberMin, likesNumberMax),
      comments:usersComments.slice(createRandomNumber(1,usersComments.length))
   }
   return obj
}
// создание массива объектов с фотками
const objPhotos= new Array(25).fill(null).map((_,i)=>createObjPhoto(i))
console.log(objPhotos)

// CERVER
// записываем данные в массивы в соответствующие тектовые файлики
fs.writeFileSync('photos.txt', JSON.stringify(objPhotos))
fs.writeFileSync('comments.txt', JSON.stringify(usersComments))
// создаем сервер
http.createServer(function(req, res){
   res.setHeader('Access-Control-Allow-Origin','*') //устранение корс ошибки, '*' - значит все порты
   res.writeHead(200, {'Content-Type': 'application/json'})

   if (req.method==='GET'&& req.url==='/photos') {
      
      const arrObjPhotos=fs.readFileSync('photos.txt', 'utf-8')
      res.write(arrObjPhotos)
      res.end()
   }
   else if (req.method==='GET' && req.url==='/comments') {
      const arrObjComments=fs.readFileSync('comments.txt', 'utf-8')
      res.write(arrObjComments)
      res.end()
   }
   else if (req.method==='POST' && req.url==='/dataForm') {
   
         let body=''
         req.on('data',chunk=>{
         body=body+chunk.toString()// чтение посылаемых данных кусочками

      })
   
      req.on('end', ()=>{
         
            fs.writeFileSync('dataForm.txt', JSON.stringify(body))
            res.write('данные успешно записаны в текстовый файл на сервере')
            res.end()
      })
   } 
   else {
      
      res.write(JSON.stringify('error: not_found_url'))
      res.end()
   }
   
}).listen(4002,function() {console.log('server start at port 4002')})
