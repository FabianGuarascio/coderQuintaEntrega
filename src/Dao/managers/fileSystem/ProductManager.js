import fs from 'fs'

export class ProductManager {
  products
  id = 1
  path
  filePrducts

  constructor(products = []) {
    this.products = products

    this.path = './products.json'

    if (fs.existsSync(this.path)) {
      this.filePrducts = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
      if (this.filePrducts.length > 0) {
        this.id = this.filePrducts[this.filePrducts.length - 1].id + 1
      }
    } else {
      fs.writeFileSync(this.path, JSON.stringify(products))
      this.filePrducts = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
      if (this.filePrducts.length > 0) {
        this.id = this.filePrducts[this.filePrducts.length - 1].id + 1
      }
    }
  }

  addProduct(product) {
    const productKeys = ['title', 'description', 'price', 'code', 'stock', 'category']
    productKeys.forEach((key) => {
      if (!product[key]) {
        throw new Error(`El valor "${key}" es obligatorio, no se pudo agregar el producto`)
      }
    })
    let alreadyExist = false
    this.filePrducts.forEach((prod) => {
      if (prod.code === product.code) {
        alreadyExist = true
        throw new Error(`No puede agregar el producto con el mismo codigo`)
      }
    })
    if (alreadyExist) return

    const newProduct = { status: true, ...product, id: this.id }
    this.filePrducts.push(newProduct)
    fs.writeFileSync(this.path, JSON.stringify(this.filePrducts))
    this.id++
    return newProduct
  }
  getProducts() {
    return this.filePrducts
  }
  getProductById(id) {
    let product
    this.filePrducts.forEach((prod) => {
      if (prod.id == id) {
        product = prod
      }
    })
    if (product) {
      return product
    } else {
      throw new Error(`El producto con el id ${id} no existe`)
    }
  }
  existProduct(id) {
    let product
    this.filePrducts.forEach((prod) => {
      if (prod.id == id) {
        product = prod
      }
    })
    return !!product
  }

  updateProduct(id, modifyObject) {
    const index = this.filePrducts.findIndex((prod) => prod.id == id)
    if (index === -1) {
      throw new Error(`El producto con el id ${id} no existe`)
    }
    if (modifyObject.id) {
      delete modifyObject.id
    }
    let product = this.getProductById(id)

    this.filePrducts[index] = { ...product, ...modifyObject }
    fs.writeFileSync(this.path, JSON.stringify(this.filePrducts))
    return this.filePrducts[index]
  }

  deleteProduct(id) {
    const index = this.filePrducts.findIndex((prod) => prod.id === id)
    if (index === -1) {
      throw new Error(`El producto con el id ${id} no existe`)
    }
    this.filePrducts = this.filePrducts.filter((prod) => prod !== this.filePrducts[index])
    fs.writeFileSync(this.path, JSON.stringify(this.filePrducts))
  }
}
