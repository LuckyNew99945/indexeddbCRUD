import productDb, {bulkCreate, getData, sortObj, createEle} from './Module.js';

let db = productDb('ProductDb', {
  products : `++id,name,seller,price`
});

//input tags

const userId = document.getElementById('userId');
const proName = document.getElementById('proName');
const seller = document.getElementById('seller');
const price = document.getElementById('price');

//buttons

const btnCreate = document.getElementById('btnCreate');
const btnRead = document.getElementById('btnRead');
const btnUpdate = document.getElementById('btnUpdate');
const btnDelete = document.getElementById('btnDelete');

//notfound
const notfound = document.getElementById('notfound');

//Event Listener

btnCreate.onclick = (e) => {
  let flag = bulkCreate(db.products, {
    name : proName.value,
    seller: seller.value,
    price : price.value
  })

  console.log(flag);

  proName.value = seller.value = price.value = '';
  getData(db.products,(data) => {
    userId.value = data.id + 1 || 1;
  });

  table();

  let insertmsg = document.querySelector('.insertmsg');

  console.log(insertmsg);

  getMsg(flag, insertmsg);



  
}

btnRead.onclick = table;

btnUpdate.onclick = () => {
  const id = parseInt(userId.value || 0);
  if(id) {

    db.products.update(id,{
      name : proName.value,
      seller : seller.value,
      price: price.value
    }).then(updated => {
      // let get = updated ? `Data Updated`: `Could not Update Data`;
      let get = updated ? true : false;

      let updatemsg = document.querySelector('.updatemsg');

      getMsg(get, updatemsg);

      proName.value = '';
      seller.value = '';
      price.value = '';
    })

  }

 


}

btnDelete.onclick = () => {
  db.delete();
  db = productDb('Productdb', {
    products: `++id,name,seller,price`
  });
  db.open();
  table();

  textID(userId);

  let deletemsg = document.querySelector('.deletemsg');

  getMsg(true,deletemsg);
}


//window onload

window.onload = () => {
  textID(userId);
}

function textID(textboxid) {
  getData(db.products, data => {
    textboxid.value = data.id + 1 || 1 ;
  })
}

function table() {
  const tbody = document.getElementById('tBody');

  while(tbody.hasChildNodes()) {
    tbody.removeChild(tbody.firstChild);
  }
  getData(db.products, (data) => {
    if(data) {
      createEle('tr', tbody, (tr) => {
        for (const value in data) {
          if (data.hasOwnProperty(value)) {
            
            createEle('td',tr, td => {
              td.textContent = data.price === data[value] ? `$${data[value]}` : data[value];
            })

           
            
          }
        }

        createEle('td',tr, td => {
          createEle('i', td, i => {
            i.className += 'fas fa-edit btn-edit';
            i.setAttribute('data-id', data.id);
            i.onclick = editbtn;
          })
        })
        createEle('td',tr, td => {
          createEle('i', td, i => {
            i.className += 'fas fa-trash-alt btn-delete'
            i.setAttribute('data-id', data.id);
            i.onclick = deletebtn;
          })
        })
      }

      
      
      )
    } else {
      notfound.textContent = `No record found in Database`;
    }
  })
}

function editbtn(e) {

  let id = parseInt(e.target.dataset.id);

  db.products.get(id, data => {
   
    userId.value = data.id || 0;
    proName.value = data.name || '';
    seller.value = data.seller || '';
    price.value = data.price || '';
  })
}

function deletebtn(e) {
  let id = parseInt(e.target.dataset.id);
  db.products.delete(id);
  table();
}

function getMsg(flag,element) {
  if(flag) {
    element.classList.add('movedown');
    
    setTimeout(() => {
      element.classList.forEach(classname => {
        classname == 'movedown' ? undefined : element.classList.remove('movedown');
      });
    },4000)
  }
}

