const socket = io()
const productContainer = document.getElementById('product_container')
const query = document.querySelectorAll('.product_card')

socket.on('evento_server', (data) => {
  console.log(data)
})


let hashTableElement ={}

query.forEach(nodeElement=>{
  hashTableElement = {
    ...hashTableElement,
    [nodeElement.getAttribute('id')]: nodeElement
  }
})

socket.on('add_product', (data) => {
  const product_card_div = document.createElement('div')
  product_card_div.setAttribute('id',data.id)
  product_card_div.className = 'product_card'
  
  const card_header_div = document.createElement('div')
  card_header_div.className = 'card_header'
  const card_header_h4 = document.createElement('h4')
  card_header_h4.innerText = data.title
  card_header_div.appendChild(card_header_h4)

  const card_body_div = document.createElement('div')
  card_body_div.className = 'card_body'
  const body_p_description = document.createElement('p')
  body_p_description.innerText =`Descripcion: ${data.description}`
  const body_p_code = document.createElement('p')
  body_p_code.innerText =`Code: ${data.code}`

  const body_p_stock = document.createElement('p')
  body_p_stock.innerText =`Stock: ${data.stock}`

  const body_p_category = document.createElement('p')
  body_p_category.innerText =`Code: ${data.category}`
  card_body_div.appendChild(body_p_description)
  card_body_div.appendChild(body_p_code)
  card_body_div.appendChild(body_p_stock)
  card_body_div.appendChild(body_p_category)

  const card_footer_div = document.createElement('div')
  card_footer_div.className = 'card_footer'

  const footer_p_price = document.createElement('p')
  footer_p_price.innerText =`Precio: ${data.price}`

  card_footer_div.appendChild(footer_p_price)
  const button = document.createElement('button')
  button.onclick = function() {
    uno(data.id);
  };
  button.innerText = 'borrar'

  card_footer_div.appendChild(button)



  product_card_div.appendChild(card_header_div)
  product_card_div.appendChild(card_body_div)
  product_card_div.appendChild(card_footer_div)



  productContainer.appendChild(product_card_div)
  hashTableElement = {
    ...hashTableElement,
    [data.id]: product_card_div
  }

  const product_card_html = `
  <div class='product_card' id="${data.id}">
      <div class='card_header'>
        <h4>${data.title}</h4>
      </div>
      <div class='card_body'>
        <p>Descripcion: ${data.description}</p>
        <p>Code: ${data.code}</p>
        <p>Stock: ${data.stock}</p>
        <p>Categoria: ${data.category}</p>
      </div>
      <div class='card_footer'>
        <p>Precio: ${data.price}</p>
        <button onclick="uno(${data.id})"> borrar </button>
      </div>
    </div>
  `
})

socket.on('delete_product',(productId)=>{
  productContainer.removeChild(hashTableElement[productId])
  delete hashTableElement[productId]
})


function uno(id){
  fetch(`http://localhost:8080/api/products/${id}`,
  {
    method: 'DELETE',
}).then(response => console.log(response))}





