const alert=document.querySelector('.alert');
const form=document.querySelector('.grocery-form');
const grocery=document.getElementById('grocery');
const submitBtn=document.querySelector('.submit-btn')
const container=document.querySelector('.grocery-container')
const list=document.querySelector('.grocery-list')
const clearBtn=document.querySelector('.clear-btn')
const deleteBtn=document.querySelector('.delete-btn');

let editElement;
let editFlag=false;
let editID="";

window.addEventListener("DOMContentLoaded",setupItems);

form.addEventListener('submit',addItem)

clearBtn.addEventListener('click',clearItems)

function addItem(e){
    e.preventDefault();
    const value=grocery.value;
    const id=new Date().getTime().toString();

if(value && !editFlag){
        createListItem(id,value);
        displayAlert("Item added to list ","success");
        container.classList.add("show-container");
        addToLocalStorage(id,value);
        setBackToDefault();
}
else if(value && editFlag){
   editElement.innerHTML=value;
   displayAlert('value changed','success');
   editLocalStorage(editID,value);
   setBackToDefault();
}
else{
  displayAlert("Please enter Item ","danger")
}
}

function displayAlert(text,action){
    alert.textContent=text;
    alert.classList.add(`alert-${action}`);
    setTimeout(function() {
        alert.textContent="";
        alert.classList.remove(`alert-${action}`);
    },1000);
}

function clearItems(){
    const items=document.querySelectorAll('.grocery-item');
    if(items.length>0)
    {
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list","danger");
    setBackToDefault();
    localStorage.removeItem('list');
}

function deleteItem(e){
   const element=e.currentTarget.parentElement.parentElement;
   const id=element.dataset.id;
   list.removeChild(element);
   if(list.children.length===0){
    container.classList.remove("show-container");
   }
   displayAlert('Item removed','danger');
   setBackToDefault();

   removeFromLocalStorage(id);
}
function editItem(e){
     const element=e.currentTarget.parentElement.parentElement;
     editElement=e.currentTarget.parentElement.previousElementSibling;
     grocery.value=editElement.innerHTML;
     editFlag=true;
     editID=element.dataset.id;
     submitBtn.textContent="edit";
}

function setBackToDefault()
{
   grocery.value="";
   editFlag=false;
   editID="";
   submitBtn.textContent="submit";
} 

function getLocalStorage()
{
    return localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];
}   

function addToLocalStorage(id,value){
    const grocery={id:id,value:value};//grocery={id,value};This is shorthand
    let items=getLocalStorage();
    console.log(items);
    items.push(grocery);
    localStorage.setItem("list",JSON.stringify(items));
}
function removeFromLocalStorage(id){
    let items=getLocalStorage();
    items=items.filter(function(item){
        if(item.id!==id){
            return item;
        }
    });
    localStorage.setItem("list",JSON.stringify(items));
}

function editLocalStorage(id,value){
    let items=getLocalStorage();
    items=items.map(function(item){
        if(item.id===id)
        {
            item.value=value;
        }
         return item;
    });
   localStorage.setItem("list",JSON.stringify(items));
}

// localStorage.setItem("orange",JSON.stringify(['item','item2']));
// const oranges=JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);
// localStorage.removeItem("orange");

function setupItems(){
    let items=getLocalStorage();
    if(items.length>0){
        items.forEach(function(item){
             createListItem(item.id,item.value)
        });
        container.classList.add('show-container');
    }
}

function createListItem(id,value){
     const element=document.createElement('article');
     element.classList.add('grocery-item');
     const attr=document.createAttribute('data-id');
     attr.value=id;
     element.setAttributeNode(attr);
     element.innerHTML=`<p class="title">${value}</p>
        <div class="btn-container">
            <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;

        const deleteBtn=element.querySelector('.delete-btn');
        const editBtn=element.querySelector('.edit-btn');
        deleteBtn.addEventListener('click',deleteItem);
        editBtn.addEventListener('click',editItem);

        list.appendChild(element);
}