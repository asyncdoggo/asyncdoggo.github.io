import * as React from "jsx-dom"
import { useRef } from "jsx-dom"
import { waitForElement } from "../globals"


export default function Snake() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    waitForElement('#gameCanvas', () => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!

        // Step 1: create grid
        const scale = 20
        const rows = canvas.height / scale
        const columns = canvas.width / scale
        
        // Step 2: create snake as a list of coordinates
        let snake: Array<{ x: number, y: number }>;
        let direction: { x: number, y: number }
        let food: { x: number, y: number }
        let paused = true

        reset()
        
        function reset() {
            snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }]
            direction = { x: 1, y: 0 }
            food = { x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows) }
        }

        function gameLoop() {
            // Draw everything
            ctx.fillStyle = 'black'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'green'
            snake.forEach(segment => {
                ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale)
            })
            ctx.fillStyle = 'red'
            ctx.fillRect(food.x * scale, food.y * scale, scale, scale)
            
            if (paused) {
                ctx.fillStyle = 'white'
                ctx.font = '30px Arial'
                ctx.fillText('Escape to toggle pause', (canvas.width / 2)-(22 * 7.5), canvas.height / 2)
                return
            }

            // Move snake
            const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y }
            snake.unshift(head)

            // Check for food collision
            if (head.x === food.x && head.y === food.y) {
                food = { x: Math.floor(Math.random() * columns), y: Math.floor(Math.random() * rows) }
            } else {
                snake.pop()
            }

            // Check for wall collision
            if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
                reset()
            }

            // Check for self collision
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {                    
                    reset()
                }
            }
        }

        setInterval(gameLoop, 70)

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (paused) {
                    paused = false
                }
                else {
                    paused = true
                }
            }

            switch (e.key) {
                case 'ArrowUp':
                    if (direction.y === 1) break
                    direction = { x: 0, y: -1 }
                    break
                case 'ArrowDown':
                    if (direction.y === -1) break
                    direction = { x: 0, y: 1 }
                    break
                case 'ArrowLeft':
                    if (direction.x === 1) break
                    direction = { x: -1, y: 0 }
                    break
                case 'ArrowRight':
                    if (direction.x === -1) break
                    direction = { x: 1, y: 0 }
                    break
            }
        })
    })


    return (
        <div className="w-full h-full flex flex-col justify-center items-center"
            id="Snake_inner"
        >
            <div className="w-full text-2xl font-bold text-center">
                Snake
            </div>
            <canvas
                id="gameCanvas"
                width="600"
                height="600"
                className="border-2 border-black"
                ref={canvasRef}
            ></canvas>
        </div>
    )
}