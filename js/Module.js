const productDb = (dbName, table) => {
  //create DB

  const db = new Dexie(dbName)
  db.version(1).stores(table);

  db.open();

// const db = new Dexie('myDb');
// db.version(1).stores({
//   friends: `name, age`
// })

  return db;
}

//Insert Function

const bulkCreate = (dbtable, data) => {
  let flag = empty(data);
  if (flag) {
    dbtable.bulkAdd([data]);
    console.log('data inserted success');
  } else {
    console.log('please provide data..');
  }

  return flag;


}

//check textbox validation

const empty = object => {
  let flag = false;

  for(const value in object) {
    if(object[value] != '' && object.hasOwnProperty(value)) {
      flag = true;
    } else {
      flag = false;
    }
  }

  return flag;
}


//get data from db

const getData = (dbtable, fn) => {
  let index = 0;
  let obj = {};

  dbtable.count((count) => {
    if(count) {
      dbtable.each(table => {
        

        obj = sortObj(table);

        fn(obj, index++);
        
      })
    } else {
      fn(0);
    }
  })
}

//sort object 

const sortObj = sortobj => {
  let obj = {};
  obj = {
    id : sortobj.id,
    name: sortobj.name,
    seller: sortobj.seller,
    price: sortobj.price,
  }

  return obj;
}

//Create Dynamic Element

const createEle = (tagname,appendTo, fn) => {
  const element = document.createElement(tagname);
  if(appendTo) appendTo.appendChild(element);
  if(fn) fn(element);
}

export default productDb;
export {
  bulkCreate,getData,sortObj,createEle
} 