import React, { useRef } from 'jsx-dom'

import '@fontsource/gloria-hallelujah';
import { waitForElement } from '../globals';



export default function TicTacToe() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const playerTurnRef = useRef<HTMLParagraphElement>(null)
    const winnerRef = useRef<HTMLParagraphElement>(null)
    const resetRef = useRef<HTMLButtonElement>(null)
    const gameWindowRef = useRef<HTMLDivElement>(null)
    const youAreRef = useRef<HTMLParagraphElement>(null)


    waitForElement('#tictactoecanvas', () => {
        const board = new Array(9).fill('')
        let player = Math.random() < 0.5 ? 'X' : 'O'
        let AiPlayer = player === 'X' ? 'O' : 'X'
        let currentPlayer = 'X'
        let gameOver = false
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!
        playerTurnRef.current!.textContent = `Player ${currentPlayer}'s turn`
        youAreRef.current!.textContent = `You are ${player}`


        // Game Loop
        const gameLoop = () => {            
            if (currentPlayer === AiPlayer) {
                AiMove()
            }
        }

        // player move
        canvas.addEventListener('click', (event) => {
            if (gameOver) return
            if(currentPlayer === AiPlayer) return
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


        const minimax = (board: string[], player: string) => {
              if (checkWinner()) {
                return { score: player === AiPlayer ? -10 : 10, index: -1 }
            }
            if (checkDraw()) {
                return { score: 0 , index: -1 }
            }

            let bestMove = -1
            let bestScore = player === AiPlayer ? -Infinity : Infinity
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = player
                    const score = minimax(board, player === 'X' ? 'O' : 'X').score
                    board[i] = ''
                    if (player === AiPlayer) {
                        if (score > bestScore) {
                            bestScore = score
                            bestMove = i
                        }
                    } else {
                        if (score < bestScore) {
                            bestScore = score
                            bestMove = i
                        }
                    }
                }
            }
            return { score: bestScore, index: bestMove }
        }

        
        const AiMove = () => {
            if (gameOver) return
            const bestMove = minimax(board, AiPlayer).index
            
            
            board[bestMove] = AiPlayer
            currentPlayer = player
            playerTurnRef.current!.textContent = `Player ${currentPlayer}'s turn`

            if (checkWinner()) {
                gameOver = true
                winnerRef.current!.textContent = `Player ${currentPlayer === 'X' ? 'O' : 'X'} wins!`
            }

            if (checkDraw()) {
                gameOver = true
                winnerRef.current!.textContent = 'Draw!'
            }

            drawBoard()
        }

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
            player = Math.random() < 0.5 ? 'X' : 'O'
            AiPlayer = player === 'X' ? 'O' : 'X'
            gameOver = false
            youAreRef.current!.textContent = `You are ${player}`
            playerTurnRef.current!.textContent = `Player ${currentPlayer}'s turn`
            winnerRef.current!.textContent = ''
            drawBoard()
        }


        winnerRef.current!.textContent = ''

        drawBoard()

        
        setInterval(gameLoop, 1000)
    });



    return (
        <div
            className="tictactoe flex justify-center items-center p-8 bg-gray-200"
            style={{ fontFamily: 'Gloria Hallelujah' }}
            ref={gameWindowRef}
        >
            <div className="flex  flex-col justify-center items-center">
                <p
                    ref={youAreRef}
                    className="text-4xl"
                ></p>
         
                <canvas
                    id="tictactoecanvas"
                    width="400"
                    height="400"
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

