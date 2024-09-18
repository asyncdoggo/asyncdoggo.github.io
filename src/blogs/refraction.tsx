import React, { useRef } from "jsx-dom"
import { waitForElement, waitForElementFromRef } from "../globals";


export default function Refraction() {

    waitForElement("#refractionblog", () => {
        window.MathJax.typesetPromise();
    });

    return (
        <>
            <div
                id="refractionblog"
                className="w-full bg-white flex flex-col px-4 pt-16"
            >

                <div className="flex md:w-2/3 w-full self-center flex-col items-start justify-center">
                    <h1 className="w-full text-4xl font-bold font-sans">Refraction of Light</h1>
                    <p className="w-full pt-2 px-2 text-lg font-sans">By me</p>
                    <p className="w-full pt-2 px-2 text-sm font-sans">Published on 16th september 2024</p>
                    <div className="w-full border border-gray-500"></div>
                </div>

                {/* Content */}
                <div className="md:w-2/3 w-full self-center flex flex-col items-start justify-center mb-8">
                    <p className="w-full pt-8 px-2 text-lg font-sans">
                        If you have been to school, you are well aware of the term <i>"Refraction"</i>.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        We have all been taught that refraction is when light changes direction when it passes from one medium to another.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        But why does light change direction, or change its speed. What exactly happens to light when it passes from one medium to another?
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        If you know the answer to these questions, great! You can leave now. <i>(Just kidding)</i>
                    </p>

                    <p className="w-full pt-8 text-lg font-sans">
                        If you are as curious as I was, then read on.
                    </p>

                    <div className="w-full flex flex-col pt-4 text-lg font-sans">
                        There are 2 main things that happen when light passes from one medium to another.
                        <i>Light changes speed</i>
                        <i>Light changes direction</i>
                    </div>

                    <p className="w-full font-medium pt-4 text-lg font-sans">
                        Try the simulation below to see how light changes direction when it passes from air (refractive index 1) to a medium with a higher refractive index.
                    </p>

                    <StaticRefractionCanvas />

                    <p className="w-full pt-4 text-lg font-sans">
                        The <span className="text-black font-medium">black</span> line represents the incident ray. The
                        <span className="text-red-500 font-medium"> red</span> line represents the refracted ray. The
                        <span className="text-blue-500 font-medium"> blue</span> line represents the reflected ray. The
                        <span className="text-green-500 font-medium"> green</span> line is the normal line.
                        The <span className="text-purple-500 font-medium"> purple</span> line is ray after it exits the medium. When light goes from the medium to air, it is refracted again. If you notice, the incidence <span className="text-black font-medium"> black</span> line is parallel to the <span className="text-purple-500 font-medium"> purple</span> line.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Its important to note that not all light is refracted. When light passes through something, depending on the angle and transparency of the material, some light is reflected while other light is refracted.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Reflection and refraction are always seen together. If you pass light at a steep angle, it will be reflected. If you pass light at a shallow angle, it will be refracted.
                    </p>

                    <p className="w-full italic pt-4 text-lg font-sans">
                        Refractive index
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Refractive index is the ability of a medium to refract light. It is a measure of how much the material affects the light passing through it.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        The refractive index of a medium is the ratio of the speed of light in a vacuum to the speed of light in the medium.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        The refractive index of vaccum or air is 1 (technically 1.0003 for air and 1 for vacuum). The refractive index of water is 1.33 and the refractive index of glass is 1.5.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        How is it measured? The refractive index of a medium is measured by passing light through the medium and measuring the angle of refraction.
                    </p>

                    {/* Equation */}
                    <p className="w-full pt-4 text-lg font-sans">
                        The equation for refractive index is:
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        The relative refractive index of an optical medium 2 with respect to medium 1 is given by the formula:
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        {"`n_{21}`"} = {"`c_1/c_2`"}
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        where {"`c_1`"} is the speed of light in medium 1 and {"`c_2`"} is the speed of light in medium 2.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        If medium 1 is vaccuum, then the refractive index of medium 2 is simply represented as {"`n_2`"}. This is also called as the absolute refractive index of medium 2.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        The absolute refractive index of a medium is the ratio of the speed of light in vaccuum to the speed of light in the medium.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        {"`n = c/v`"}
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        where {"`n`"} is the refractive index, {"`c`"} is the speed of light in vaccuum and {"`v`"} is the speed of light in the medium.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Since the speed of light in vaccuum is a constant, the refractive index of a medium is inversely proportional to the speed of light in the medium.
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        {"`n prop 1/v`"}
                    </p>



                    <p className="w-full pt-4 text-lg font-sans">
                        That's cool and all, but lets now talk about the question we all have.
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        <i>Why does light change speed and direction?</i>
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        First lets talk about the direction.
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        Light is an electromagnetic wave. When it enters a medium, the atoms in the medium starts oscillating. These oscillations cause the electromagnetic interference which ends up changing the direction of the light.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        The change in direction depends on the refractive index of the medium. The higher the refractive index of the material,
                        the more the light is bent.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Now lets talk about the speed.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        The change in speed is an interesting phenomenon.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        If you notice, refraction occurs when light is incident at an angle. Since light is a wave, when it comes at an angle, the wavefronts are not perpendicular to the surface of the medium.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        This causes a part of the wavefront to enter the medium first and the other part to enter later. This causes the wavefront to undergo a phase change.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        The phase change causes the wavefront to slow down. This is why light slows down when it enters a medium.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        And that's it. That's refraction in a nutshell. There is a lot more about refraction. Such as the phenomenon of total internal reflection, or diffraction (the one that causes rainbows).
                    </p>

                    <div className="w-full mt-4 border border-gray-500">
                        <p className="w-full pt-4 px-2 text-lg font-sans font-bold italic">
                            This blog is heavily inspired by the videos from <a href="https://www.youtube.com/@3blue1brown" className="text-blue-500">3Blue1Brown</a>.
                            I would highly recommend checking out these videos if you want to learn more about refraction.
                            <div className="w-full flex flex-col gap-y-2 items-center justify-center p-2">
                                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/KTzGBJPuJwM?si=W7iyymtNK_4EdP2W" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/Cz4Q4QOuoo8?si=H4-winEGxoh-55S4" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </div>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

function StaticRefractionCanvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const n1 = 1
    let n2 = 1.5

    waitForElementFromRef(canvasRef, () => {
        const canvas = canvasRef.current!
        canvas.width = 700
        canvas.height = 500
        const ctx = canvas.getContext('2d')!
        let incidentLineEndY = canvas.height / 2


        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 255, 0.15)'

            const glassStartX = canvas.width / 2 - 50
            const glassStartY = 70
            const glassWidth = 100
            const glassHeight = canvas.height - 200


            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillRect(glassStartX, glassStartY, glassWidth, glassHeight)
        }

        function drawLight() {

            const startX = 50
            const startY = canvas.height / 2 + 100

            const endX = canvas.width / 2 - 50
            const endY = incidentLineEndY
            ctx.beginPath()
            ctx.moveTo(startX, startY)
            ctx.strokeStyle = "black"
            ctx.lineTo(endX, endY)
            ctx.stroke()

            if (endY < 70 || endY > 360) {
                return
            }


            const angleOfIncidence = Math.atan2(endY - startY, endX - startX)

            // Reflection line
            ctx.beginPath()
            ctx.moveTo(endX, endY)
            const reflectedX = endX - 100
            const reflectedY = endY + 100 * Math.sin(angleOfIncidence)
            ctx.lineTo(reflectedX, reflectedY)
            ctx.strokeStyle = "blue"
            ctx.stroke()

            // Draw the normal line
            ctx.beginPath()
            ctx.moveTo(endX + 50, endY)
            ctx.lineTo(endX - 50, endY)
            ctx.strokeStyle = "green"
            ctx.stroke()

            ctx.fillStyle = "black"
            ctx.font = "20px Arial"

            ctx.fillText("Angle of incidence: " + Math.abs((angleOfIncidence * 180 / Math.PI)).toFixed(2) + " degrees", 10, canvas.height - 40)
            ctx.fillText("Click to change angle of incidence", 10, 20)


            if (reflectedY < 48) {
                return
            }


            // Refraction
            ctx.beginPath()
            ctx.moveTo(endX, endY)
            const angleOfRefraction = Math.asin(n1 / n2 * Math.sin(angleOfIncidence))
            const refractedX = endX + 100
            const refractedY = endY + 100 * Math.sin(angleOfRefraction)
            ctx.lineTo(refractedX, refractedY)
            ctx.strokeStyle = "red"
            ctx.stroke()

            ctx.fillText("Angle of refraction: " + Math.abs((angleOfRefraction * 180 / Math.PI)).toFixed(2) + " degrees", 10, canvas.height - 10)



            const exitX = canvas.width
            const exitY = refractedY + (exitX - refractedX) * Math.tan(angleOfIncidence)
            ctx.beginPath()
            ctx.moveTo(refractedX, refractedY)
            ctx.lineTo(exitX, exitY)
            ctx.strokeStyle = "purple"
            ctx.stroke()
        }


        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth
            if (window.innerWidth > 700) {
                canvas.width = 700
            }

            canvas.height = 500
        })

        canvasRef.current!.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect()
            const y = event.clientY - rect.top
            incidentLineEndY = y
        })

        const animationLoop = () => {
            draw()
            drawLight()
            requestAnimationFrame(animationLoop)
        }

        animationLoop()
    });

    const labelRef = useRef<HTMLLabelElement>(null)

    const inputRef = useRef<HTMLInputElement>(null)

    waitForElementFromRef(inputRef, () => {
        inputRef.current!.addEventListener('input', (event) => {
            labelRef.current!.textContent = "Refractive Index: " + (event.target as HTMLInputElement).value
            n2 = parseFloat((event.target as HTMLInputElement).value)
        })
    })





    return (
        <div className="w-full flex flex-col items-start justify-center mt-8">
            <label
                ref={labelRef}
            >Refractive Index: 1.5
            </label>
            <input
                ref={inputRef}
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={1.5}
            />
            <canvas
                id="refractionCanvas"
                className="mt-4 border"
                ref={canvasRef}
            ></canvas>
        </div>
    )
}