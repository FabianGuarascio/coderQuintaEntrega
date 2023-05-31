import fs from 'fs'
export class ChartManager {
  charts
  id = 1
  path
  fileCharts

  constructor(charts = []) {
    this.charts = charts

    this.path = './carrito.json'

    if (fs.existsSync(this.path)) {
      this.fileCharts = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
      if (this.fileCharts.length > 0) {
        this.id = this.fileCharts[this.fileCharts.length - 1].id + 1
      }
    } else {
      fs.writeFileSync(this.path, JSON.stringify(charts))
      this.fileCharts = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
      if (this.fileCharts.length > 0) {
        this.id = this.fileCharts[this.fileCharts.length - 1].id + 1
      }
    }
  }

  addCharts(chart) {
    const chartTemplate = { products: [], id: 0 }
    const newChart = { ...chartTemplate, ...chart, id: this.id }
    this.fileCharts.push(newChart)
    fs.writeFileSync(this.path, JSON.stringify(this.fileCharts))
    this.id++
    return newChart
  }

  getCharts() {
    return this.fileCharts
  }

  getChartById(id) {
    let chart
    this.fileCharts.forEach((char) => {
      if (char.id == id) {
        chart = char
      }
    })
    if (chart) {
      return chart
    } else {
      console.log('Not Found')
    }
  }
  existChart(id) {
    let chart
    this.fileCharts.forEach((char) => {
      if (char.id == id) {
        chart = char
      }
    })
    return !!chart
  }

  addProductToChartById(chartId, productId) {
    const chart = this.fileCharts.find((char) => char.id === chartId)
    if (chart.products.length === 0) {
      chart.products.push({ id: productId, quantity: 1 })
    } else {
      chart.products.find((prod) => {
        if (prod.id === productId) {
          prod.quantity += 1
        } else {
          chart.products.push({ id: productId, quantity: 1 })
        }
      })
    }
    fs.writeFileSync(this.path, JSON.stringify(this.fileCharts))
  }
}
