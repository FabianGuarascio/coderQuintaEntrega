function addToCart(pid){
  fetch(`http://localhost:8080/api/carts/646abafb96a1ceffcd971494/product/${pid}`,{method:'POST'}).then(data=>alert("Añadido al carrito"))
}