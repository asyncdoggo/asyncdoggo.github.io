import React, { useRef } from 'jsx-dom'
import { waitForElement } from '../globals'


export default function Pong() {

    const pongRef = useRef<HTMLCanvasElement>(null)

    waitForElement('#pongCanvas', () => {

        const canvas = pongRef.current!
        const ctx = canvas.getContext('2d')!
        let paused_for_menu = true


        const ball = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 10,
            velocityX: 5,
            velocityY: 5,
            speed: 7,
            color: 'WHITE'
        }

        const player = {
            x: 10,
            y: (canvas.height - 100) / 2,
            width: 10,
            height: 100,
            score: 0,
            color: 'WHITE'
        }

        const opponent = {
            x: canvas.width - 20,
            y: (canvas.height - 100) / 2,
            width: 10,
            height: 100,
            score: 0,
            color: 'WHITE'
        }

        const net = {
            x: (canvas.width - 2) / 2,
            y: 0,
            height: 10,
            width: 2,
            color: 'WHITE'
        }

        function drawRect(x: number, y: number, w: number, h: number, color: string) {
            ctx.fillStyle = color
            ctx.fillRect(x, y, w, h)
        }

        function drawCircle(x: number, y: number, r: number, color: string) {
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2, false)
            ctx.closePath()
            ctx.fill()
        }

        function drawText(text: string, x: number, y: number, color: string, size: number = 45) {
            ctx.fillStyle = color
            ctx.font = `${size}px fantasy`
            ctx.fillText(text, x, y)
        }

        function drawNet() {
            for (let i = 0; i <= canvas.height; i += 15) {
                drawRect(net.x, net.y + i, net.width, net.height, net.color)
            }
        }

        function gameLoop() {
            render()
            if (paused_for_menu) return
            update()
        }

        function update() {
            ball.x += ball.velocityX
            ball.y += ball.velocityY

            if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
                ball.velocityY = -ball.velocityY
            }

            let playerOrOpponent = (ball.x < canvas.width / 2) ? player : opponent

            if (collision()) {
                let collidePoint = ball.y - (playerOrOpponent.y + playerOrOpponent.height
                    / 2)
                collidePoint = collidePoint / (playerOrOpponent.height / 2)

                let angleRad = (Math.PI / 4) * collidePoint

                let direction = (ball.x < canvas.width / 2) ? 1 : -1

                const collidePointX = ball.x - (playerOrOpponent.x + playerOrOpponent.width / 2)

                ball.x = collidePointX > 0 ? playerOrOpponent.x + playerOrOpponent.width + ball.radius : playerOrOpponent.x - ball.radius

                ball.velocityX = direction * ball.speed * Math.cos(angleRad)

                ball.speed += 0.2
            }
            else if (ball.x - ball.radius < 0) {
                opponent.score++
                resetBall()
            } else if (ball.x + ball.radius > canvas.width) {
                player.score++
                resetBall()
            }
            if (ball.x > canvas.width / 2 && ball.velocityX > 0) {
                opponent.y += ((ball.y - (opponent.y + opponent.height / 2))) * 0.1
            }
        }

        function resetBall() {
            ball.x = canvas.width / 2
            ball.y = canvas.height / 2
            ball.speed = 7
            ball.velocityX = 5
            ball.velocityY = 5
        }

        function collision() {

            if (ball.x - ball.radius < player.x + player.width && ball.y > player.y - 5 && ball.y < player.y + player.height + 5) {
                return true
            }
            if (ball.x + ball.radius > opponent.x && ball.y > opponent.y - 5 && ball.y < opponent.y + opponent.height + 5) {
                return true
            }
            return false


        }

        function render() {
            if (paused_for_menu) {
                drawRect(0, 0, canvas.width, canvas.height, 'BLACK')
                drawText('Click to start', canvas.width / 2 - 115, canvas.height / 2, 'WHITE')
                drawText('Press p or esc to pause', canvas.width / 2 - 115, canvas.height / 2 + 50, 'WHITE', 24)

                ctx.filter = 'blur(2px)'
                drawText(player.score.toString(), canvas.width / 4, canvas.height / 5, 'WHITE')
                drawText(opponent.score.toString(), 3 * canvas.width / 4, canvas.height / 5, 'WHITE')
                drawNet()
                drawRect(player.x, player.y, player.width, player.height, player.color)
                drawRect(opponent.x, opponent.y, opponent.width, opponent.height, opponent.color)
                drawCircle(ball.x, ball.y, ball.radius, ball.color)
                ctx.filter = 'none'
                return
            }

            drawRect(0, 0, canvas.width, canvas.height, 'BLACK')
            drawText(player.score.toString(), canvas.width / 4, canvas.height / 5, 'WHITE')
            drawText(opponent.score.toString(), 3 * canvas.width / 4, canvas.height / 5, 'WHITE')
            drawNet()
            drawRect(player.x, player.y, player.width, player.height, player.color)
            drawRect(opponent.x, opponent.y, opponent.width, opponent.height, opponent.color)
            drawCircle(ball.x, ball.y, ball.radius, ball.color)
        }

        canvas.addEventListener('mousemove', movePaddle)
        function movePaddle(evt: MouseEvent) {
            if (paused_for_menu) return
            let rect = canvas.getBoundingClientRect()

            player.y = evt.clientY - rect.top - player.height / 2
        }

        canvas.addEventListener('click', () => {
            if (paused_for_menu) {
                paused_for_menu = false
            }
        })

        function keyDown(evt: KeyboardEvent) {
            if (evt.key === 'p' || evt.key === 'P' || evt.key === 'Escape') {
                paused_for_menu = !paused_for_menu
            }
        }



        window.addEventListener("keydown", keyDown)

        window.addEventListener('blur', onBlur)

        function onBlur() {
            paused_for_menu = true
        }

        setInterval(gameLoop, 1000 / 50);

        (document.getElementById('Pong_inner')! as any).onCleanUp = () => {
            window.removeEventListener('keydown', keyDown)
            canvas.removeEventListener('mousemove', movePaddle)
            window.removeEventListener('blur', onBlur)
        }


    })

    return (
        <div className="pong flex flex-col items-center justify-center"
            id='Pong_inner'
        >
            <h1 className="text-4xl font-bold">Pong</h1>
            <div
                className="pong-canvas" id="pongCanvas"
            >
                <canvas width="800" height="400"
                    ref={pongRef}
                ></canvas>
            </div>
        </div>
    )
}