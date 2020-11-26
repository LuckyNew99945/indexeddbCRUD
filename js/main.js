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
      let get = updated ? `Data Updated`: `Could not Update Data`;
      console.log(get);
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

