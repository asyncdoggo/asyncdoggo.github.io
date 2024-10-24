import * as React from "jsx-dom"
import { useRef } from "jsx-dom"
import { waitForElement } from "../globals"


export default function ConnectFour() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    waitForElement("#connect4", () => {
        console.log("Canvas found");

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const board = Array.from({ length: 6 }, () => Array(7).fill(0))
        let currentPlayer = 1
        // let winner = 0
        let gameOver = false

        const drawBoard = () => {
            ctx.fillStyle = "blue"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 7; col++) {
                    ctx.beginPath()
                    ctx.arc(col * 80 + 40, row * 80 + 40, 30, 0, 2 * Math.PI)
                    ctx.fillStyle = board[row][col] === 0 ? "white" : board[row][col] === 1 ? "red" : "yellow"
                    ctx.fill()
                    ctx.closePath()
                }
            }
        }

        const checkWinner = (row: number, col: number) => {
            const directions = [
                [1, 0], [0, 1], [1, 1], [1, -1]
            ]

            for (const [dx, dy] of directions) {
                let count = 1
                for (let i = 1; i < 4; i++) {
                    const newRow = row + i * dy
                    const newCol = col + i * dx
                    if (newRow < 0 || newRow >= 6 || newCol < 0 || newCol >= 7 || board[newRow][newCol] !== currentPlayer) break
                    count++
                }
                for (let i = 1; i < 4; i++) {
                    const newRow = row - i * dy
                    const newCol = col - i * dx
                    if (newRow < 0 || newRow >= 6 || newCol < 0 || newCol >= 7 || board[newRow][newCol] !== currentPlayer) break
                    count++
                }
                if (count >= 4) return true
            }

            return false
        }

        const handleClick = (event: MouseEvent) => {
            if (gameOver) return

            const rect = canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const col = Math.floor(x / 80)

            for (let row = 5; row >= 0; row--) {
                if (board[row][col] === 0) {
                    board[row][col] = currentPlayer
                    if (checkWinner(row, col)) {
                        // winner = currentPlayer
                        gameOver = true
                    } else {
                        currentPlayer = currentPlayer === 1 ? 2 : 1
                    }
                    break
                }
            }

            drawBoard()
        }

        canvas.addEventListener("click", handleClick)
        drawBoard()

        return () => {
            canvas.removeEventListener("click", handleClick)
        }
    })

    return (
        <div class="connect4 container flex flex-col justify-center items-center">
            <h1>Connect Four</h1>
            <canvas
                id="connect4" width="560" height="560"
                ref={canvasRef}
            ></canvas>
        </div>
    )
}