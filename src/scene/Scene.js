import SceneEmptyChild from './SceneEmptyChild'
import Box from './Box'
import Camera from './Camera'
import Plane from './Plane'
import Room from './Room'
import Avatar from './Avatar'

export default class Scene {
  constructor() {
    this.playState = 'paused'
    this.unitValue = 1

    this.viewport = this.createElement('scene-viewport')
    this.ambient = new SceneEmptyChild('scene-ambient')
    this.camera = new Camera(this)
    // TODO: objects avatars delete
    this.objects = []
    this.parentNode = null
    this.onUpdateEventHandler = null

    this.viewport.addEventListener('mousedown', this.mouseDownHandler, false)
    document.addEventListener(
      'pointerlockchange',
      this.pointerLockChangeHandler,
      false,
    )
    document.addEventListener('keypress', this.keyPressHandler, false)

    this.paused = true
    this.camera.place(this.ambient)
    this.render()
  }

  render = () => {
    this.camera.update()
    if (this.onUpdateEventHandler) this.onUpdateEventHandler()
    requestAnimationFrame(this.render)
  }

  onUpdate = (onUpdateEventHandler) => {
    this.onUpdateEventHandler = onUpdateEventHandler
  }

  createPlane = (className, scaleX, scaleY) => {
    const plane = new Plane(className, scaleX, scaleY)
    plane.unitValue = this.unitValue
    this.objects.push(plane)
    this.ambient.assemble(plane)
    return plane
  }

  createBox = (className, scaleX, scaleY, scaleZ) => {
    const box = new Box(className, scaleX, scaleY, scaleZ)
    box.unitValue = this.unitValue
    this.objects.push(box)
    this.ambient.assemble(box)
    return box
  }

  createRoom = (className, scaleX, scaleY, scaleZ) => {
    const room = new Room(className, scaleX, scaleY, scaleZ)
    room.unitValue = this.unitValue
    this.objects.push(room)
    this.ambient.assemble(room)
    return room
  }

  createAvatar = (className, scaleX, scaleY) => {
    const avatar = new Avatar(className, scaleX, scaleY)
    avatar.unitValue = this.unitValue
    this.ambient.assemble(avatar)
    return avatar
  }

  removeAvatar = (avatar) => {
    this.ambient.unassemble(avatar)
  }

  /**
   * Appends child of the scene element
   * @param {(Element|SceneEmptyChild)} child - Child node
   * @returns {(Element|SceneEmptyChild)} Same child node
   */
  append = (child) => {
    if (child instanceof Element) this.viewport.appendChild(child)
    else if (child instanceof SceneEmptyChild)
      this.viewport.appendChild(child.element)
    return child
  }

  mount = (parentId) => {
    const parent = document.getElementById(parentId)
    if (parent) {
      this.parentNode = parent
      this.parentNode.appendChild(this.viewport)
    }
  }

  /**
   * Creates and return an empty element
   * @param {string} className - Class name of created element
   */
  createElement = (className) => {
    let container = document.createElement('div')
    container.style = `
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    `
    container.className = 'scene-viewport'
    document.body.appendChild(container)
    return container
  }

  /**
   * @param {boolean} pause
   */
  set paused(pause) {
    if (pause) {
      this.playState = 'paused'
      this.camera.unlink()
    } else {
      this.playState = 'running'
      this.camera.link()
    }
  }

  pause = () => {
    this.paused = true
    this.camera.unlink()
  }

  /**
   * Mousedown Event
   * @event viewport~mousedown
   */
  mouseDownHandler = (e) => {
    this.viewport.requestPointerLock()
    this.paused = false
  }

  /**
   * Mousedown Event
   * @event viewport~mousedown
   */
  pointerLockChangeHandler = (e) => {
    if (document.pointerLockElement !== this.viewport) this.paused = true
  }

  /**
   * Keypress Event
   * @event document~keypress
   */
  keyPressHandler = (e) => {
    this.paused && e.preventDefault()
    if (e.key.toLowerCase() === 'Escape') {
      this.paused = true
    }
  }

  /**
   * Element.classList of the Scene element
   * @readonly
   */
  get classList() {
    return this.viewport.classList
  }

  /**
   * Element.style of the Scene element
   * @readonly
   */
  get style() {
    return this.viewport.style
  }

  /**
   * Width of the Scene element
   * @readonly
   */
  get width() {
    return this.viewport.offsetWidth
  }

  /**
   * Height of the Scene element
   * @readonly
   */
  get height() {
    return this.viewport.offsetHeight
  }
}
