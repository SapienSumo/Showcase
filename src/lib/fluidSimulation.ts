type FluidColor = readonly [number, number, number]

type FluidSimulation = {
  pointerMove: (x: number, y: number) => FluidColor | null
  resetPointer: () => void
  setViewportActive: (active: boolean) => void
  destroy: () => void
}

type Surface = {
  texture: WebGLTexture
  framebuffer: WebGLFramebuffer
  width: number
  height: number
  attach: (unit: number) => number
  dispose: () => void
}

type DoubleSurface = {
  read: Surface
  write: Surface
  swap: () => void
  dispose: () => void
}

type ShaderProgram = {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation | null>
}

type Splat = {
  x: number
  y: number
  dx: number
  dy: number
  color: FluidColor
}

const VERTEX_SHADER = `#version 300 es
  precision highp float;
  layout(location = 0) in vec2 aPosition;
  uniform vec2 texelSize;
  out vec2 vUv;
  out vec2 vL;
  out vec2 vR;
  out vec2 vT;
  out vec2 vB;

  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const CLEAR_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  out vec4 outColor;
  void main () { outColor = texture(uTexture, vUv) * value; }
`

const SPLAT_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  out vec4 outColor;

  void main () {
    vec2 offset = vUv - point;
    offset.x *= aspectRatio;
    vec3 splat = exp(-dot(offset, offset) / radius) * color;
    vec3 base = texture(uTarget, vUv).xyz;
    outColor = vec4(base + splat, 1.0);
  }
`

const ADVECTION_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  out vec4 outColor;

  void main () {
    vec2 coordinate = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
    vec4 result = texture(uSource, coordinate);
    outColor = result / (1.0 + dissipation * dt);
  }
`

const DIVERGENCE_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vUv;
  in vec2 vL;
  in vec2 vR;
  in vec2 vT;
  in vec2 vB;
  uniform sampler2D uVelocity;
  out vec4 outColor;

  void main () {
    float left = texture(uVelocity, vL).x;
    float right = texture(uVelocity, vR).x;
    float top = texture(uVelocity, vT).y;
    float bottom = texture(uVelocity, vB).y;
    vec2 center = texture(uVelocity, vUv).xy;
    if (vL.x < 0.0) left = -center.x;
    if (vR.x > 1.0) right = -center.x;
    if (vT.y > 1.0) top = -center.y;
    if (vB.y < 0.0) bottom = -center.y;
    outColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
  }
`

const CURL_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vL;
  in vec2 vR;
  in vec2 vT;
  in vec2 vB;
  uniform sampler2D uVelocity;
  out vec4 outColor;

  void main () {
    float left = texture(uVelocity, vL).y;
    float right = texture(uVelocity, vR).y;
    float top = texture(uVelocity, vT).x;
    float bottom = texture(uVelocity, vB).x;
    outColor = vec4(0.5 * (right - left - top + bottom), 0.0, 0.0, 1.0);
  }
`

const VORTICITY_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vUv;
  in vec2 vL;
  in vec2 vR;
  in vec2 vT;
  in vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  out vec4 outColor;

  void main () {
    float left = texture(uCurl, vL).x;
    float right = texture(uCurl, vR).x;
    float top = texture(uCurl, vT).x;
    float bottom = texture(uCurl, vB).x;
    float center = texture(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(top) - abs(bottom), abs(right) - abs(left));
    force /= length(force) + 0.0001;
    force *= curl * center;
    force.y *= -1.0;
    vec2 velocity = texture(uVelocity, vUv).xy;
    outColor = vec4(velocity + force * dt, 0.0, 1.0);
  }
`

const PRESSURE_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vL;
  in vec2 vR;
  in vec2 vT;
  in vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  in vec2 vUv;
  out vec4 outColor;

  void main () {
    float left = texture(uPressure, vL).x;
    float right = texture(uPressure, vR).x;
    float top = texture(uPressure, vT).x;
    float bottom = texture(uPressure, vB).x;
    float divergence = texture(uDivergence, vUv).x;
    outColor = vec4((left + right + bottom + top - divergence) * 0.25, 0.0, 0.0, 1.0);
  }
`

const GRADIENT_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vUv;
  in vec2 vL;
  in vec2 vR;
  in vec2 vT;
  in vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  out vec4 outColor;

  void main () {
    float left = texture(uPressure, vL).x;
    float right = texture(uPressure, vR).x;
    float top = texture(uPressure, vT).x;
    float bottom = texture(uPressure, vB).x;
    vec2 velocity = texture(uVelocity, vUv).xy;
    velocity -= vec2(right - left, top - bottom);
    outColor = vec4(velocity, 0.0, 1.0);
  }
`

const DISPLAY_SHADER = `#version 300 es
  precision highp float;
  precision highp sampler2D;
  in vec2 vUv;
  in vec2 vL;
  in vec2 vR;
  in vec2 vT;
  in vec2 vB;
  uniform sampler2D uTexture;
  out vec4 outColor;

  void main () {
    vec3 color = texture(uTexture, vUv).rgb;
    float left = length(texture(uTexture, vL).rgb);
    float right = length(texture(uTexture, vR).rgb);
    float top = length(texture(uTexture, vT).rgb);
    float bottom = length(texture(uTexture, vB).rgb);
    vec3 normal = normalize(vec3(right - left, top - bottom, 0.24));
    float light = clamp(dot(normal, vec3(0.0, 0.0, 1.0)) + 0.18, 0.72, 1.0);
    color *= light;
    float strength = max(color.r, max(color.g, color.b));
    float alpha = smoothstep(0.008, 0.34, strength) * 0.72;
    outColor = vec4(color * alpha, alpha);
  }
`

const PALETTE = [
  [0.09, 0.55, 0.38],
  [0.95, 0.34, 0.25],
  [0.42, 0.32, 0.72],
  [0.16, 0.16, 0.23],
] as const

const mustExist = <T,>(value: T | null, label: string): T => {
  if (!value) throw new Error(`Unable to create ${label}`)
  return value
}

export function createFluidSimulation(canvas: HTMLCanvasElement): FluidSimulation | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    stencil: false,
  })

  if (!gl || !gl.getExtension('EXT_color_buffer_float') || !gl.getExtension('OES_texture_float_linear')) {
    return null
  }

  const programs: ShaderProgram[] = []

  const compileShader = (type: number, source: string) => {
    const shader = mustExist(gl.createShader(type), 'shader')
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) ?? 'Unknown shader compilation error'
      gl.deleteShader(shader)
      throw new Error(message)
    }
    return shader
  }

  const createProgram = (fragmentSource: string): ShaderProgram => {
    const vertex = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragment = compileShader(gl.FRAGMENT_SHADER, fragmentSource)
    const program = mustExist(gl.createProgram(), 'program')
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) ?? 'Unknown shader link error'
      gl.deleteProgram(program)
      throw new Error(message)
    }

    const uniforms: Record<string, WebGLUniformLocation | null> = {}
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
    for (let index = 0; index < uniformCount; index += 1) {
      const info = gl.getActiveUniform(program, index)
      if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name)
    }

    const compiled = { program, uniforms }
    programs.push(compiled)
    return compiled
  }

  const clearProgram = createProgram(CLEAR_SHADER)
  const splatProgram = createProgram(SPLAT_SHADER)
  const advectionProgram = createProgram(ADVECTION_SHADER)
  const divergenceProgram = createProgram(DIVERGENCE_SHADER)
  const curlProgram = createProgram(CURL_SHADER)
  const vorticityProgram = createProgram(VORTICITY_SHADER)
  const pressureProgram = createProgram(PRESSURE_SHADER)
  const gradientProgram = createProgram(GRADIENT_SHADER)
  const displayProgram = createProgram(DISPLAY_SHADER)

  const vertexArray = mustExist(gl.createVertexArray(), 'vertex array')
  const vertexBuffer = mustExist(gl.createBuffer(), 'vertex buffer')
  gl.bindVertexArray(vertexArray)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const bindProgram = (shader: ShaderProgram) => gl.useProgram(shader.program)
  const set1f = (shader: ShaderProgram, name: string, value: number) => gl.uniform1f(shader.uniforms[name], value)
  const set1i = (shader: ShaderProgram, name: string, value: number) => gl.uniform1i(shader.uniforms[name], value)
  const set2f = (shader: ShaderProgram, name: string, x: number, y: number) => gl.uniform2f(shader.uniforms[name], x, y)
  const set3f = (shader: ShaderProgram, name: string, x: number, y: number, z: number) => gl.uniform3f(shader.uniforms[name], x, y, z)

  const createSurface = (width: number, height: number): Surface => {
    const texture = mustExist(gl.createTexture(), 'texture')
    const framebuffer = mustExist(gl.createFramebuffer(), 'framebuffer')
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error('Unable to create fluid framebuffer')
    }

    return {
      texture,
      framebuffer,
      width,
      height,
      attach: (unit) => {
        gl.activeTexture(gl.TEXTURE0 + unit)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        return unit
      },
      dispose: () => {
        gl.deleteFramebuffer(framebuffer)
        gl.deleteTexture(texture)
      },
    }
  }

  const createDoubleSurface = (width: number, height: number): DoubleSurface => {
    const surface = {
      read: createSurface(width, height),
      write: createSurface(width, height),
      swap: () => {
        const next = surface.read
        surface.read = surface.write
        surface.write = next
      },
      dispose: () => {
        surface.read.dispose()
        surface.write.dispose()
      },
    }
    return surface
  }

  const blit = (target: Surface | null) => {
    gl.bindVertexArray(vertexArray)
    gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer ?? null)
    gl.viewport(0, 0, target?.width ?? canvas.width, target?.height ?? canvas.height)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  const resolution = (base: number) => {
    const aspect = Math.max(canvas.width / Math.max(canvas.height, 1), 1)
    return canvas.width >= canvas.height
      ? { width: Math.round(base * aspect), height: base }
      : { width: base, height: Math.round(base * aspect) }
  }

  let velocity = createDoubleSurface(2, 2)
  let dye = createDoubleSurface(2, 2)
  let pressure = createDoubleSurface(2, 2)
  let divergence = createSurface(2, 2)
  let curl = createSurface(2, 2)
  let knownWidth = 0
  let knownHeight = 0

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
    const width = Math.max(2, Math.floor(canvas.clientWidth * pixelRatio))
    const height = Math.max(2, Math.floor(canvas.clientHeight * pixelRatio))
    if (width === knownWidth && height === knownHeight) return false

    knownWidth = width
    knownHeight = height
    canvas.width = width
    canvas.height = height
    velocity.dispose()
    dye.dispose()
    pressure.dispose()
    divergence.dispose()
    curl.dispose()

    const simulationSize = resolution(112)
    const dyeSize = resolution(width < 900 ? 384 : 640)
    velocity = createDoubleSurface(simulationSize.width, simulationSize.height)
    dye = createDoubleSurface(dyeSize.width, dyeSize.height)
    pressure = createDoubleSurface(simulationSize.width, simulationSize.height)
    divergence = createSurface(simulationSize.width, simulationSize.height)
    curl = createSurface(simulationSize.width, simulationSize.height)
    return true
  }

  const addSplat = ({ x, y, dx, dy, color }: Splat) => {
    const aspectRatio = canvas.width / canvas.height
    const radius = 0.0025 * (aspectRatio > 1 ? aspectRatio : 1)

    bindProgram(splatProgram)
    set1f(splatProgram, 'aspectRatio', aspectRatio)
    set2f(splatProgram, 'point', x, y)
    set1f(splatProgram, 'radius', radius)
    set1i(splatProgram, 'uTarget', velocity.read.attach(0))
    set3f(splatProgram, 'color', dx, dy, 0)
    blit(velocity.write)
    velocity.swap()

    set1i(splatProgram, 'uTarget', dye.read.attach(0))
    set3f(splatProgram, 'color', color[0], color[1], color[2])
    blit(dye.write)
    dye.swap()
  }

  const step = (dt: number) => {
    const texelX = velocity.read.width > 0 ? 1 / velocity.read.width : 0
    const texelY = velocity.read.height > 0 ? 1 / velocity.read.height : 0
    gl.disable(gl.BLEND)

    bindProgram(curlProgram)
    set2f(curlProgram, 'texelSize', texelX, texelY)
    set1i(curlProgram, 'uVelocity', velocity.read.attach(0))
    blit(curl)

    bindProgram(vorticityProgram)
    set2f(vorticityProgram, 'texelSize', texelX, texelY)
    set1i(vorticityProgram, 'uVelocity', velocity.read.attach(0))
    set1i(vorticityProgram, 'uCurl', curl.attach(1))
    set1f(vorticityProgram, 'curl', 24)
    set1f(vorticityProgram, 'dt', dt)
    blit(velocity.write)
    velocity.swap()

    bindProgram(divergenceProgram)
    set2f(divergenceProgram, 'texelSize', texelX, texelY)
    set1i(divergenceProgram, 'uVelocity', velocity.read.attach(0))
    blit(divergence)

    bindProgram(clearProgram)
    set1i(clearProgram, 'uTexture', pressure.read.attach(0))
    set1f(clearProgram, 'value', 0.82)
    blit(pressure.write)
    pressure.swap()

    bindProgram(pressureProgram)
    set2f(pressureProgram, 'texelSize', texelX, texelY)
    set1i(pressureProgram, 'uDivergence', divergence.attach(0))
    for (let iteration = 0; iteration < 16; iteration += 1) {
      set1i(pressureProgram, 'uPressure', pressure.read.attach(1))
      blit(pressure.write)
      pressure.swap()
    }

    bindProgram(gradientProgram)
    set2f(gradientProgram, 'texelSize', texelX, texelY)
    set1i(gradientProgram, 'uPressure', pressure.read.attach(0))
    set1i(gradientProgram, 'uVelocity', velocity.read.attach(1))
    blit(velocity.write)
    velocity.swap()

    bindProgram(advectionProgram)
    set2f(advectionProgram, 'texelSize', texelX, texelY)
    set1i(advectionProgram, 'uVelocity', velocity.read.attach(0))
    set1i(advectionProgram, 'uSource', velocity.read.attach(0))
    set1f(advectionProgram, 'dt', dt)
    set1f(advectionProgram, 'dissipation', 0.22)
    blit(velocity.write)
    velocity.swap()

    set1i(advectionProgram, 'uVelocity', velocity.read.attach(0))
    set1i(advectionProgram, 'uSource', dye.read.attach(1))
    set1f(advectionProgram, 'dissipation', 2.15)
    blit(dye.write)
    dye.swap()
  }

  const render = () => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    bindProgram(displayProgram)
    set2f(displayProgram, 'texelSize', 1 / dye.read.width, 1 / dye.read.height)
    set1i(displayProgram, 'uTexture', dye.read.attach(0))
    blit(null)
  }

  let active = true
  let destroyed = false
  let frame = 0
  let lastFrameTime = performance.now()
  let lastInputTime = lastFrameTime
  let lastPointer: { x: number; y: number } | null = null
  let pendingSplat: Splat | null = null
  let palettePosition = 0
  let paletteDirection = 1

  const nextPaletteColor = (distance: number): Splat['color'] => {
    const paletteLimit = PALETTE.length - 1
    palettePosition += paletteDirection * Math.min(distance * 3.2, 0.16)

    if (palettePosition >= paletteLimit) {
      palettePosition = paletteLimit - (palettePosition - paletteLimit)
      paletteDirection = -1
    } else if (palettePosition <= 0) {
      palettePosition = -palettePosition
      paletteDirection = 1
    }

    const fromIndex = Math.floor(palettePosition)
    const toIndex = Math.min(fromIndex + 1, paletteLimit)
    const mix = palettePosition - fromIndex
    const from = PALETTE[fromIndex]
    const to = PALETTE[toIndex]

    return [
      from[0] + (to[0] - from[0]) * mix,
      from[1] + (to[1] - from[1]) * mix,
      from[2] + (to[2] - from[2]) * mix,
    ]
  }

  const update = (time: number) => {
    frame = 0
    if (!active || destroyed) return
    resize()
    const dt = Math.min((time - lastFrameTime) / 1000, 1 / 60)
    lastFrameTime = time
    if (pendingSplat) {
      addSplat(pendingSplat)
      pendingSplat = null
    }
    step(dt)
    render()
    if (time - lastInputTime < 4200) frame = window.requestAnimationFrame(update)
  }

  const requestFrame = () => {
    if (!frame && active && !destroyed) {
      lastFrameTime = performance.now()
      frame = window.requestAnimationFrame(update)
    }
  }

  resize()
  render()

  return {
    pointerMove: (x, y) => {
      if (!active || destroyed) return null
      if (!lastPointer) {
        lastPointer = { x, y }
        return null
      }

      const aspectRatio = canvas.width / canvas.height
      const deltaX = x - lastPointer.x
      const deltaY = y - lastPointer.y
      lastPointer = { x, y }
      const distance = Math.hypot(deltaX, deltaY)
      if (distance < 0.0005) return null

      const trailScale = Math.min(0.68, 0.02 / distance)
      const trailForce = 2100
      const color = nextPaletteColor(distance)
      pendingSplat = {
        x: Math.min(Math.max(x - deltaX * trailScale, 0), 1),
        y: Math.min(Math.max(y - deltaY * trailScale, 0), 1),
        dx: deltaX * trailForce,
        dy: deltaY * -trailForce / Math.max(aspectRatio, 1),
        color,
      }
      lastInputTime = performance.now()
      requestFrame()
      return color
    },
    resetPointer: () => {
      lastPointer = null
    },
    setViewportActive: (nextActive) => {
      active = nextActive
      if (!active && frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
      if (active) requestFrame()
    },
    destroy: () => {
      destroyed = true
      if (frame) window.cancelAnimationFrame(frame)
      velocity.dispose()
      dye.dispose()
      pressure.dispose()
      divergence.dispose()
      curl.dispose()
      programs.forEach(({ program }) => gl.deleteProgram(program))
      gl.deleteBuffer(vertexBuffer)
      gl.deleteVertexArray(vertexArray)
    },
  }
}

// Fluid method adapted from Pavel Dobryakov's MIT-licensed WebGL Fluid Simulation.
// https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
