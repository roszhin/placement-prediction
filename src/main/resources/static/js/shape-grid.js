/**
 * ShapeGrid Component (React Bits Vanilla JS Port)
 * High-performance animated canvas grid with interactive hover & trail effects.
 */
class ShapeGrid {
  constructor(canvasElementOrSelector, options = {}) {
    const canvas = typeof canvasElementOrSelector === 'string'
      ? document.querySelector(canvasElementOrSelector)
      : canvasElementOrSelector;

    if (!canvas) {
      console.warn('ShapeGrid: Canvas element not found', canvasElementOrSelector);
      return;
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Props matching React Bits ShapeGrid
    this.direction = options.direction || 'right';
    this.speed = options.speed !== undefined ? options.speed : 1;
    this.borderColor = options.borderColor || '#999';
    this.squareSize = options.squareSize || 40;
    this.hoverFillColor = options.hoverFillColor || '#222';
    this.shape = options.shape || 'square';
    this.hoverTrailAmount = options.hoverTrailAmount !== undefined ? options.hoverTrailAmount : 0;
    this.vignetteColor = options.vignetteColor || null;
    
    // Mouse listener element (can be the canvas or its parent container/viewport)
    this.mouseTarget = options.mouseTarget 
      ? (typeof options.mouseTarget === 'string' ? document.querySelector(options.mouseTarget) : options.mouseTarget)
      : this.canvas;

    this.requestRef = null;
    this.gridOffset = { x: 0, y: 0 };
    this.hoveredSquare = null;
    this.trailCells = [];
    this.cellOpacities = new Map();

    this.isHex = this.shape === 'hexagon';
    this.isTri = this.shape === 'triangle';
    this.hexHoriz = this.squareSize * 1.5;
    this.hexVert = this.squareSize * Math.sqrt(3);

    this.isVisible = false;
    this.isPageVisible = !document.hidden;

    this.init();
  }

  init() {
    this.resizeCanvas = () => {
      this.canvas.width = this.canvas.offsetWidth || this.canvas.parentElement?.offsetWidth || window.innerWidth;
      this.canvas.height = this.canvas.offsetHeight || this.canvas.parentElement?.offsetHeight || window.innerHeight;
      this.numSquaresX = Math.ceil(this.canvas.width / this.squareSize) + 1;
      this.numSquaresY = Math.ceil(this.canvas.height / this.squareSize) + 1;
    };

    window.addEventListener('resize', this.resizeCanvas);
    this.resizeCanvas();

    // Mouse handlers
    this.handleMouseMove = (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      if (mouseX < 0 || mouseX > rect.width || mouseY < 0 || mouseY > rect.height) {
        this.handleMouseLeave();
        return;
      }

      if (this.isHex) {
        const colShift = Math.floor(this.gridOffset.x / this.hexHoriz);
        const offsetX = ((this.gridOffset.x % this.hexHoriz) + this.hexHoriz) % this.hexHoriz;
        const offsetY = ((this.gridOffset.y % this.hexVert) + this.hexVert) % this.hexVert;
        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / this.hexHoriz);
        const rowOffset = (col + colShift) % 2 !== 0 ? this.hexVert / 2 : 0;
        const row = Math.round((adjustedY - rowOffset) / this.hexVert);

        if (
          !this.hoveredSquare ||
          this.hoveredSquare.x !== col ||
          this.hoveredSquare.y !== row
        ) {
          if (this.hoveredSquare && this.hoverTrailAmount > 0) {
            this.trailCells.unshift({ ...this.hoveredSquare });
            if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
          }
          this.hoveredSquare = { x: col, y: row };
        }
      } else if (this.isTri) {
        const halfW = this.squareSize / 2;
        const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / halfW);
        const row = Math.floor(adjustedY / this.squareSize);

        if (
          !this.hoveredSquare ||
          this.hoveredSquare.x !== col ||
          this.hoveredSquare.y !== row
        ) {
          if (this.hoveredSquare && this.hoverTrailAmount > 0) {
            this.trailCells.unshift({ ...this.hoveredSquare });
            if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
          }
          this.hoveredSquare = { x: col, y: row };
        }
      } else if (this.shape === 'circle') {
        const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.round(adjustedX / this.squareSize);
        const row = Math.round(adjustedY / this.squareSize);

        if (
          !this.hoveredSquare ||
          this.hoveredSquare.x !== col ||
          this.hoveredSquare.y !== row
        ) {
          if (this.hoveredSquare && this.hoverTrailAmount > 0) {
            this.trailCells.unshift({ ...this.hoveredSquare });
            if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
          }
          this.hoveredSquare = { x: col, y: row };
        }
      } else {
        const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
        const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

        const adjustedX = mouseX - offsetX;
        const adjustedY = mouseY - offsetY;

        const col = Math.floor(adjustedX / this.squareSize);
        const row = Math.floor(adjustedY / this.squareSize);

        if (
          !this.hoveredSquare ||
          this.hoveredSquare.x !== col ||
          this.hoveredSquare.y !== row
        ) {
          if (this.hoveredSquare && this.hoverTrailAmount > 0) {
            this.trailCells.unshift({ ...this.hoveredSquare });
            if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
          }
          this.hoveredSquare = { x: col, y: row };
        }
      }
    };

    this.handleMouseLeave = () => {
      if (this.hoveredSquare && this.hoverTrailAmount > 0) {
        this.trailCells.unshift({ ...this.hoveredSquare });
        if (this.trailCells.length > this.hoverTrailAmount) this.trailCells.length = this.hoverTrailAmount;
      }
      this.hoveredSquare = null;
    };

    if (this.mouseTarget) {
      this.mouseTarget.addEventListener('mousemove', this.handleMouseMove);
      this.mouseTarget.addEventListener('mouseleave', this.handleMouseLeave);
    }

    // Visibility Observer to save performance
    this.tryStart = () => {
      if (this.isVisible && this.isPageVisible && !this.requestRef) {
        this.requestRef = requestAnimationFrame(this.updateAnimation.bind(this));
      }
    };

    this.tryStop = () => {
      if (this.requestRef) {
        cancelAnimationFrame(this.requestRef);
        this.requestRef = null;
      }
    };

    this.io = new IntersectionObserver(
      ([entry]) => {
        this.isVisible = entry.isIntersecting;
        this.isVisible ? this.tryStart() : this.tryStop();
      },
      { threshold: 0 }
    );
    this.io.observe(this.canvas);

    this.onVisibility = () => {
      this.isPageVisible = !document.hidden;
      this.isPageVisible ? this.tryStart() : this.tryStop();
    };
    document.addEventListener('visibilitychange', this.onVisibility);

    this.tryStart();
  }

  drawHex(cx, cy, size) {
    const ctx = this.ctx;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const vx = cx + size * Math.cos(angle);
      const vy = cy + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
  }

  drawCircle(cx, cy, size) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.closePath();
  }

  drawTriangle(cx, cy, size, flip) {
    const ctx = this.ctx;
    ctx.beginPath();
    if (flip) {
      ctx.moveTo(cx, cy + size / 2);
      ctx.lineTo(cx + size / 2, cy - size / 2);
      ctx.lineTo(cx - size / 2, cy - size / 2);
    } else {
      ctx.moveTo(cx, cy - size / 2);
      ctx.lineTo(cx + size / 2, cy + size / 2);
      ctx.lineTo(cx - size / 2, cy + size / 2);
    }
    ctx.closePath();
  }

  drawGrid() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.isHex) {
      const colShift = Math.floor(this.gridOffset.x / this.hexHoriz);
      const offsetX = ((this.gridOffset.x % this.hexHoriz) + this.hexHoriz) % this.hexHoriz;
      const offsetY = ((this.gridOffset.y % this.hexVert) + this.hexVert) % this.hexVert;

      const cols = Math.ceil(canvas.width / this.hexHoriz) + 3;
      const rows = Math.ceil(canvas.height / this.hexVert) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * this.hexHoriz + offsetX;
          const cy = row * this.hexVert + ((col + colShift) % 2 !== 0 ? this.hexVert / 2 : 0) + offsetY;

          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawHex(cx, cy, this.squareSize);
            ctx.fillStyle = this.hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          this.drawHex(cx, cy, this.squareSize);
          ctx.strokeStyle = this.borderColor;
          ctx.stroke();
        }
      }
    } else if (this.isTri) {
      const halfW = this.squareSize / 2;
      const colShift = Math.floor(this.gridOffset.x / halfW);
      const rowShift = Math.floor(this.gridOffset.y / this.squareSize);
      const offsetX = ((this.gridOffset.x % halfW) + halfW) % halfW;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

      const cols = Math.ceil(canvas.width / halfW) + 4;
      const rows = Math.ceil(canvas.height / this.squareSize) + 4;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * halfW + offsetX;
          const cy = row * this.squareSize + this.squareSize / 2 + offsetY;
          const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0;

          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawTriangle(cx, cy, this.squareSize, flip);
            ctx.fillStyle = this.hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          this.drawTriangle(cx, cy, this.squareSize, flip);
          ctx.strokeStyle = this.borderColor;
          ctx.stroke();
        }
      }
    } else if (this.shape === 'circle') {
      const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

      const cols = Math.ceil(canvas.width / this.squareSize) + 3;
      const rows = Math.ceil(canvas.height / this.squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const cx = col * this.squareSize + this.squareSize / 2 + offsetX;
          const cy = row * this.squareSize + this.squareSize / 2 + offsetY;

          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            this.drawCircle(cx, cy, this.squareSize);
            ctx.fillStyle = this.hoverFillColor;
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          this.drawCircle(cx, cy, this.squareSize);
          ctx.strokeStyle = this.borderColor;
          ctx.stroke();
        }
      }
    } else {
      const offsetX = ((this.gridOffset.x % this.squareSize) + this.squareSize) % this.squareSize;
      const offsetY = ((this.gridOffset.y % this.squareSize) + this.squareSize) % this.squareSize;

      const cols = Math.ceil(canvas.width / this.squareSize) + 3;
      const rows = Math.ceil(canvas.height / this.squareSize) + 3;

      for (let col = -2; col < cols; col++) {
        for (let row = -2; row < rows; row++) {
          const sx = col * this.squareSize + offsetX;
          const sy = row * this.squareSize + offsetY;

          const cellKey = `${col},${row}`;
          const alpha = this.cellOpacities.get(cellKey);
          if (alpha) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.hoverFillColor;
            ctx.fillRect(sx, sy, this.squareSize, this.squareSize);
            ctx.globalAlpha = 1;
          }

          ctx.strokeStyle = this.borderColor;
          ctx.strokeRect(sx, sy, this.squareSize, this.squareSize);
        }
      }
    }

    // Radial gradient / Vignette overlay
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    if (this.vignetteColor) {
      gradient.addColorStop(1, this.vignetteColor);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  updateAnimation() {
    const effectiveSpeed = Math.max(this.speed, 0.1);
    const wrapX = this.isHex ? this.hexHoriz * 2 : this.squareSize;
    const wrapY = this.isHex ? this.hexVert : this.isTri ? this.squareSize * 2 : this.squareSize;

    switch (this.direction) {
      case 'right':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
        break;
      case 'left':
        this.gridOffset.x = (this.gridOffset.x + effectiveSpeed + wrapX) % wrapX;
        break;
      case 'up':
        this.gridOffset.y = (this.gridOffset.y + effectiveSpeed + wrapY) % wrapY;
        break;
      case 'down':
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
        break;
      case 'diagonal':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
        break;
      default:
        break;
    }

    this.updateCellOpacities();
    this.drawGrid();
    this.requestRef = requestAnimationFrame(this.updateAnimation.bind(this));
  }

  updateCellOpacities() {
    const targets = new Map();

    if (this.hoveredSquare) {
      targets.set(`${this.hoveredSquare.x},${this.hoveredSquare.y}`, 1);
    }

    if (this.hoverTrailAmount > 0) {
      for (let i = 0; i < this.trailCells.length; i++) {
        const t = this.trailCells[i];
        const key = `${t.x},${t.y}`;
        if (!targets.has(key)) {
          targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
        }
      }
    }

    for (const [key] of targets) {
      if (!this.cellOpacities.has(key)) {
        this.cellOpacities.set(key, 0);
      }
    }

    for (const [key, opacity] of this.cellOpacities) {
      const target = targets.get(key) || 0;
      const next = opacity + (target - opacity) * 0.15;
      if (next < 0.005) {
        this.cellOpacities.delete(key);
      } else {
        this.cellOpacities.set(key, next);
      }
    }
  }

  destroy() {
    window.removeEventListener('resize', this.resizeCanvas);
    this.tryStop();
    if (this.io) this.io.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    if (this.mouseTarget) {
      this.mouseTarget.removeEventListener('mousemove', this.handleMouseMove);
      this.mouseTarget.removeEventListener('mouseleave', this.handleMouseLeave);
    }
  }
}

// Attach to window
if (typeof window !== 'undefined') {
  window.ShapeGrid = ShapeGrid;
}
