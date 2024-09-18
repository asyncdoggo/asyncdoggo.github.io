import React, { useRef } from "jsx-dom"
import { waitForElement } from "../globals"


export default function AirHockey() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    waitForElement('#gameCanvas', () => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        const player = {
            x: canvas.width / 2,
            y: canvas.height - 20,
            prevX: canvas.width / 2,
            prevY: canvas.height - 20,
            velocityX: 0,
            velocityY: 0,
            radius: 25,
            color: 'gold',
        }

        const computer = {
            x: canvas.width / 2,
            y: 20,
            prevX: canvas.width / 2,
            prevY: 20,
            velocityX: 0,
            velocityY: 0,
            radius: 25,
            color: 'red',
        }

        const puck = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 15,
            color: 'black',
            velocityX: 0,
            velocityY: 0
        }

        const score = {
            player: 0,
            computer: 0
        }

        let goal = false
        let paused = true

        const mousePosition = {
            x: 0,
            y: 0
        }


        const playerMovableArea = {
            top: canvas.height / 2 + player.radius,
            bottom: canvas.height - player.radius,
            left: player.radius,
            right: canvas.width - player.radius
        }

        const computerMovableArea = {
            top: 0 + computer.radius,
            bottom: canvas.height / 2 - computer.radius,
            left: computer.radius,
            right: canvas.width - computer.radius
        }


        function drawHockeyTable() {
            ctx.beginPath()
            ctx.rect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#3ac6ed'
            ctx.fill()
            ctx.closePath()

            // Draw the center circle
            ctx.beginPath()
            ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2)
            ctx.strokeStyle = 'black'
            ctx.stroke()
            ctx.closePath()

            // Draw the center line
            ctx.beginPath()
            ctx.moveTo(0, canvas.height / 2)
            ctx.lineTo(canvas.width, canvas.height / 2)
            ctx.strokeStyle = 'black'
            ctx.stroke()
            ctx.closePath()

            // Draw the goals
            ctx.beginPath()
            ctx.rect(canvas.width / 2 - 50, 0, 100, 20)
            ctx.fillStyle = 'black'
            ctx.fill()
            ctx.closePath()

            ctx.beginPath()
            ctx.rect(canvas.width / 2 - 50, canvas.height - 20, 100, 20)
            ctx.fillStyle = 'black'
            ctx.fill()
            ctx.closePath()


            // Draw the score
            if (goal) {
                ctx.font = '50px Arial'
                ctx.fillStyle = 'black'
                ctx.fillText(`${score.player} - ${score.computer}`, canvas.width / 2 - 50, canvas.height / 2 - 100)

                setTimeout(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    goal = false
                }, 2000)
            }

            // ctx.filter = 'none'

        }


        function drawCircle(x: number, y: number, color: string, radius: number) {
            ctx.beginPath()
            ctx.arc(x, y, radius, 0, Math.PI * 2)
            ctx.fillStyle = color
            ctx.fill()
            ctx.closePath()
        }

        function checkCollision(paddle: any, puck: any) {
            const distance = Math.sqrt((paddle.x - puck.x) ** 2 + (paddle.y - puck.y) ** 2)
            return distance < paddle.radius + puck.radius
        }

        function update() {
            if (paused) {
                return
            }

            updatePlayer()
            updatePuck()
            updateComputerAI()


            // Check if the puck is in the goal
            // computer goal
            if (puck.y < puck.radius && puck.x > canvas.width / 2 - 50 && puck.x < canvas.width / 2 + 50) {
                puck.x = canvas.width / 2
                puck.y = canvas.height / 2
                puck.velocityX = 0
                puck.velocityY = 0
                score.player++
                goal = true
            }

            // player goal
            if (puck.y > canvas.height - puck.radius && puck.x > canvas.width / 2 - 50 && puck.x < canvas.width / 2 + 50) {
                puck.x = canvas.width / 2
                puck.y = canvas.height / 2
                puck.velocityX = 0
                puck.velocityY = 0
                score.computer++
                goal = true
            }
        }

        function updatePuck() {
            if (puck.x + puck.radius > canvas.width) {
                puck.x = canvas.width - puck.radius
                puck.velocityX *= -1
            }

            if (puck.x - puck.radius < 0) {
                puck.x = puck.radius
                puck.velocityX *= -1
            }

            if (puck.y + puck.radius > canvas.height) {
                puck.y = canvas.height - puck.radius
                puck.velocityY *= -1
            }

            if (puck.y - puck.radius < 0) {
                puck.y = puck.radius
                puck.velocityY *= -1
            }

            // Add puck friction
            puck.velocityX *= 0.999
            puck.velocityY *= 0.999

            puck.x += puck.velocityX * 0.5
            puck.y += puck.velocityY * 0.5
        }


        function updatePlayer() {
            player.x = mousePosition.x
            player.y = mousePosition.y

            player.velocityX = player.x - player.prevX
            player.velocityY = player.y - player.prevY

            player.prevX = player.x
            player.prevY = player.y

            if (player.x < playerMovableArea.left) {
                player.x = playerMovableArea.left
            }

            if (player.x > playerMovableArea.right) {
                player.x = playerMovableArea.right
            }

            if (player.y < playerMovableArea.top) {
                player.y = playerMovableArea.top
            }

            if (player.y > playerMovableArea.bottom) {
                player.y = playerMovableArea.bottom
            }

            if (checkCollision(player, puck)) {
                const distance = Math.sqrt((player.x - puck.x) ** 2 + (player.y - puck.y) ** 2)

                // Prevent the puck from getting stuck inside the paddle
                puck.x = player.x + (player.radius + puck.radius) * (puck.x - player.x) / distance
                puck.y = player.y + (player.radius + puck.radius) * (puck.y - player.y) / distance

                puck.velocityX = player.velocityX + 0.05 * (puck.x - player.x)
                puck.velocityY = player.velocityY + 0.05 * (puck.y - player.y)
            }

        }


        function updateComputerAI() {
            if (puck.y < canvas.height / 2) {
                // Y movement
                if (puck.y - computer.y - computer.radius - 10 < 0) { // If the puck is above the computer
                    computer.velocityY = 0.05 * (puck.y - computer.y) // Move up
                }
                else {
                    computer.velocityY = Math.abs(puck.velocityY) // Move down
                }

                // X movement
                if (puck.x - computer.x + puck.radius < 0) {
                    computer.velocityX = 0.05 * (puck.x - computer.x) // Move left
                }
                else {
                    if (puck.y - computer.y + puck.radius < 0) {
                        computer.velocityX = 0.05 * (puck.x - computer.x - puck.radius) // Move right
                    }
                    else {
                        computer.velocityX = 0.05 * (puck.x - computer.x + puck.radius) // Move right
                    }
                }


                if (puck.y < puck.radius + 10) {
                    computer.velocityX = 0.1 * (canvas.width / 2 - computer.x)
                }
            }
            else {
                // Move back to the center
                computer.velocityX = 0.05 * (canvas.width / 2 - computer.x)
                computer.velocityY = 0.05 * (canvas.height / 4 - computer.y)
            }


            computer.x += computer.velocityX * 0.7
            computer.y += computer.velocityY * 0.7

            if (computer.x < computerMovableArea.left) {
                computer.x = computerMovableArea.left
            }

            if (computer.x > computerMovableArea.right) {
                computer.x = computerMovableArea.right
            }

            if (computer.y < computerMovableArea.top) {
                computer.y = computerMovableArea.top
            }

            if (computer.y > computerMovableArea.bottom) {
                computer.y = computerMovableArea.bottom
            }

            if (checkCollision(computer, puck)) {
                const distance = Math.sqrt((computer.x - puck.x) ** 2 + (computer.y - puck.y) ** 2)

                // Prevent the puck from getting stuck inside the paddle
                puck.x = computer.x + (computer.radius + puck.radius) * (puck.x - computer.x) / distance
                puck.y = computer.y + (computer.radius + puck.radius) * (puck.y - computer.y) / distance

                puck.velocityX = computer.velocityX + 0.05 * (puck.x - computer.x)
                puck.velocityY = computer.velocityY + 0.05 * (puck.y - computer.y)
            }
        }



        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawHockeyTable()

            drawCircle(player.x, player.y, player.color, player.radius)
            drawCircle(computer.x, computer.y, computer.color, computer.radius)
            drawCircle(puck.x, puck.y, puck.color, puck.radius)
            if (paused) {
                ctx.filter = 'none'
                ctx.font = '30px Arial'
                ctx.fillStyle = 'black'
                ctx.fillText('Paused', canvas.width / 2 - 50, canvas.height / 2 - 100)
                ctx.font = '20px Arial'
                ctx.fillText('(Press p or esc to resume)', canvas.width / 2 - 115, canvas.height / 2 - 70)

                ctx.fillText('Score: ' + score.player + ' - ' + score.computer, canvas.width / 2 - 50, canvas.height / 2 - 40)

                ctx.filter = 'blur(5px)'
            }
            else {
                ctx.filter = 'none'
            }
        }

        function gameLoop() {
            update()
            draw()
            requestAnimationFrame(gameLoop)
        }


        function MouseMove(e: MouseEvent) {
            const rect = canvas.getBoundingClientRect()
            mousePosition.x = e.clientX - rect.left
            mousePosition.y = e.clientY - rect.top
        }

        window.addEventListener('mousemove', MouseMove)

        function keyDown(e: KeyboardEvent) {
            if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
                paused = !paused
            }
        }

        window.addEventListener('keydown', keyDown)

        function Blur() {
            paused = true
        }

        window.addEventListener('blur', Blur)


        gameLoop();

        (document.getElementById('Air Hockey_inner')! as any).onCleanUp = () => {
            window.removeEventListener('keydown', keyDown)
            window.removeEventListener('mousemove', MouseMove)
            window.removeEventListener('blur', Blur)
        }

    })


    return (
        <div className="w-full h-full flex flex-col justify-center items-center"
            id="Air Hockey_inner"
        >
            <div className="w-full text-2xl font-bold text-center">
                Air Hockey
            </div>
            <canvas
                id="gameCanvas"
                width="400"
                height="600"
                className="border-2 border-black"
                ref={canvasRef}
            ></canvas>
        </div>
    )
}