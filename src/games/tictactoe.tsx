import React, { useRef } from 'jsx-dom'

import '@fontsource/gloria-hallelujah';
import { waitForElement } from '../globals';


export default function Tictactoe() {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const playerTurnRef = useRef<HTMLParagraphElement>(null)
    const winnerRef = useRef<HTMLParagraphElement>(null)
    const resetRef = useRef<HTMLButtonElement>(null)
    const gameWindowRef = useRef<HTMLDivElement>(null)


    waitForElement('#tictactoecanvas', () => {
        const board = new Array(9).fill('')
        let currentPlayer = 'X'
        let gameOver = false
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        playerTurnRef.current!.textContent = `Player ${currentPlayer}'s turn`


        new ResizeObserver((e) => {
            const data = e[0]

            const width = data.contentRect.width
            const height = data.contentRect.height
            gameWindowRef.current!.style.width = width + 'px'
            gameWindowRef.current!.style.height = height  + 'px'

            if (width < 700) {
                canvas.width = width - 100
            }
            else {
                canvas.width = 600
            }
            if (height < 700){
                canvas.height = height - 200
            }
            else {
                canvas.height = 600
            }
            

            drawBoard()


        }).observe(document.querySelector('#TicTacToe')!)


        canvas.addEventListener('click', (event) => {
            if (gameOver) return
            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top

            const i = Math.floor(x / canvas.width * 3)
            const j = Math.floor(y / canvas.height * 3)

            const index = i + j * 3

            if (board[index] === '') {
                board[index] = currentPlayer
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X'
                playerTurnRef.current!.textContent = `Player ${currentPlayer}'s turn`

            }

            if (checkWinner()) {
                gameOver = true
                winnerRef.current!.textContent = `Player ${currentPlayer === 'X' ? 'O' : 'X'} wins!`
            }

            if (checkDraw()) {
                gameOver = true
                winnerRef.current!.textContent = 'Draw!'
            }

            drawBoard()
        })

        function checkWinner() {
            for (let i = 0; i < 3; i++) {
                if (board[i] && board[i] === board[i + 3] && board[i] === board[i + 6]) {
                    return true
                }
            }

            for (let i = 0; i < 9; i += 3) {
                if (board[i] && board[i] === board[i + 1] && board[i] === board[i + 2]) {
                    return true
                }
            }

            if (board[0] && board[0] === board[4] && board[0] === board[8]) {
                return true
            }

            if (board[2] && board[2] === board[4] && board[2] === board[6]) {
                return true
            }

            return false
        }

        function checkDraw() {
            return board.every((player) => player !== '')
        }

        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'black'
            ctx.font = '100px Gloria Hallelujah'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'

            board.forEach((player, i) => {
                const x = (i % 3 + 0.5) * canvas.width / 3
                const y = (Math.floor(i / 3) + 0.5) * canvas.height / 3
                ctx.fillText(player, x, y)
            })

            // draw lines using loops
            for (let i = 1; i < 3; i++) {
                ctx.beginPath()
                ctx.moveTo(canvas.width / 3 * i, 0)
                ctx.lineTo(canvas.width / 3 * i, canvas.height)
                ctx.stroke()
            }

            for (let i = 1; i < 3; i++) {
                ctx.beginPath()
                ctx.moveTo(0, canvas.height / 3 * i)
                ctx.lineTo(canvas.width, canvas.height / 3 * i)
                ctx.stroke()
            }
        }

        resetRef.current!.onclick = () => {
            board.fill('')
            currentPlayer = 'X'
            gameOver = false
            playerTurnRef.current!.textContent = `Player ${currentPlayer}'s turn`
            winnerRef.current!.textContent = ''
            drawBoard()
        }


        winnerRef.current!.textContent = ''

        drawBoard()
    })

    return (
        <div
            className="tictactoe flex justify-center items-center p-8 bg-gray-200"
            style={{ fontFamily: 'Gloria Hallelujah' }}
            ref={gameWindowRef}
        >
            <div className="flex  flex-col justify-center items-center">
                <canvas
                    id="tictactoecanvas"
                    width="600"
                    height="600"
                    className="border-4 border-black"
                    ref={canvasRef}
                ></canvas>
                {/* elements for showing turns and winner and a reset button */}
                <div className="flex flex-col items-center">
                    <p
                        className="text-4xl"
                        ref={playerTurnRef}
                    ></p>
                    <p
                        className="text-4xl"
                        ref={winnerRef}
                    ></p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 mt-4"
                        ref={resetRef}
                    >Reset</button>
                </div>
            </div>

        </div>
    )
}

