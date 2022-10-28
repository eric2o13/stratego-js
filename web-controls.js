
/**
  Controls
 */
const controls = document.getElementById('controls')
const context  = controls.getContext('2d')


const drawControls = () => {

    const text  = CONTROLS.paused ? 'Unpause' : 'Pause' 

    context.fillStyle = '#444'
    context.fillRect(0, 0, 100, 40)
    
    context.fillStyle = 'white'
    context.font = "12px Arial";
    context.fillText(text, 20 , 20)

    return context

}

controls.addEventListener('click', (e) => {
    CONTROLS.paused = !CONTROLS.paused
    drawControls()
});
drawControls()
