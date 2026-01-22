/**
 * Simple Chart implementation for Quick App Canvas
 */

export default class Chart {
  constructor(ctx) {
    this.ctx = ctx
  }

  // Draw Line Chart
  drawLineChart(data, options) {
    const { width, height, color } = options
    const padding = 20
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    if (data.length === 0) return

    // Find min and max
    let min = 0
    let max = Math.max(...data.map(d => d.value))
    if (max === 0) max = 100

    const stepX = chartWidth / (data.length - 1)
    const scaleY = chartHeight / max

    this.ctx.clearRect(0, 0, width, height)

    // Draw Area
    this.ctx.beginPath()
    this.ctx.moveTo(padding, height - padding) // Bottom-left

    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = height - padding - point.value * scaleY
      this.ctx.lineTo(x, y)
    })

    this.ctx.lineTo(padding + (data.length - 1) * stepX, height - padding) // Bottom-right
    this.ctx.closePath()

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color || 'rgba(255, 112, 100, 0.5)') // Top color (semi-transparent)
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)') // Bottom color (transparent)
    this.ctx.fillStyle = gradient
    this.ctx.fill()

    // Draw Line
    this.ctx.beginPath()
    this.ctx.lineWidth = 3
    this.ctx.strokeStyle = color || '#FF7064'

    // Smooth curve (simple bezier)
    // For simplicity, using straight lines first. Bezier requires more math.
    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = height - padding - point.value * scaleY
      if (index === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    })
    this.ctx.stroke()

    // Draw Points
    data.forEach((point, index) => {
      const x = padding + index * stepX
      const y = height - padding - point.value * scaleY

      this.ctx.beginPath()
      this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
      this.ctx.fillStyle = '#FFFFFF'
      this.ctx.fill()
      this.ctx.lineWidth = 2
      this.ctx.strokeStyle = color || '#FF7064'
      this.ctx.stroke()
    })
  }

  // Draw Donut Chart
  drawDonutChart(data, options) {
    const { width, height, colors } = options
    const centerX = width / 2
    const centerY = height / 2
    const radius = (Math.min(width, height) / 2) * 0.8
    const innerRadius = radius * 0.6 // Donut hole

    let total = data.reduce((sum, item) => sum + item.value, 0)
    if (total === 0) total = 1

    let startAngle = -0.5 * Math.PI // Start from top

    this.ctx.clearRect(0, 0, width, height)

    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI
      const endAngle = startAngle + sliceAngle

      this.ctx.beginPath()
      this.ctx.moveTo(centerX, centerY)
      this.ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      this.ctx.fillStyle = colors[index % colors.length]
      this.ctx.fill()

      startAngle = endAngle
    })

    // Cut out the center
    this.ctx.beginPath()
    this.ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
    this.ctx.fillStyle = '#FFFFFF'
    this.ctx.fill()

    // Write Total in center
    this.ctx.fillStyle = '#333333'
    this.ctx.textAlign = 'center'
    this.ctx.font = '30px sans-serif'
    // this.ctx.fillText('100', centerX, centerY + 10);
  }
}
