import React, { useRef } from "jsx-dom";

declare var MathJax: any;

function waitForElement(selector: string, callback: any) {
    if (document.querySelector(selector)) {
        callback();
    } else {
        setTimeout(() => {
            waitForElement(selector, callback);
        }, 100);
    }
}

export default function Blog1() {

    // const { id } = useParams();
    const car1Ref = useRef<HTMLCanvasElement>(null);
    const car2ref = useRef<HTMLCanvasElement>(null);

    const drawCar = (canvas: HTMLCanvasElement, color: string) => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }

    const drawCar1 = () => {
        if (car1Ref.current) {
            drawCar(car1Ref.current, 'red');
        }
    }

    const drawCar2 = () => {
        if (car2ref.current) {
            drawCar(car2ref.current, 'blue');
        }
    }    


    waitForElement("#blog1main", () =>{
        drawCar1();
        drawCar2();
        MathJax.typesetPromise();
    });

    
    return (
        <div 
        id="blog1main"
        className="w-full bg-white flex flex-col px-4 pt-16"
        >
            
            <div className="flex md:w-2/3 w-full self-center flex-col items-start justify-center">
                <h1 className="w-full text-4xl font-bold font-sans">Understanding Limits: How Extreme Cases Reveal Surprising Truths</h1>
                <p className="w-full pt-2 px-2 text-lg font-sans">By me</p>
                <div className="w-full border border-gray-500"></div>
            </div>

            {/* Content */}
            <div className="md:w-2/3 w-full self-center flex flex-col items-start justify-center">
                <p className="w-full pt-8 px-2 text-lg font-sans">
                    When you hear the word <i>limit</i>, you might think of something that stops or restricts. For example, roller coasters have height limits for safety. Similarly  in mathematics, A limit is the value a function approaches as its input gets closer to some value.
                    Or in simple words, a limit is a value beyond which a function cannot go.
                </p>
                <p className="w-full pt-8 px-2 text-lg font-sans">
                    Don't worry if this sounds confusing. Let's look at an example to understand the concept of limits.
                </p>

                <h3 className="w-full pt-8 px-2 text-2xl font-bold font-sans">Example: A windy road</h3>

                <p className="w-full pt-8 px-2 text-lg font-sans">
                    Imagine two cars:
                </p>

                <div className="cars-row flex flex-row items-center justify-evenly w-full">
                    <div className="pt-4 flex flex-col items-center justify-center">
                        <canvas 
                        className="w-24 h-16 border" 
                        id="car1" 
                        ref={car1Ref}
                        ></canvas>
                        <p className="pt-2 px-2 text-lg font-sans">
                            Car 1
                        </p>
                    </div>

                    <div className="pt-4 flex flex-col items-center justify-center">
                        <canvas className="w-24 h-16 border" id="car2" ref={car2ref}></canvas>
                        <p className="pt-2 px-2 text-lg font-sans">
                            Car 2
                        </p>
                    </div>
                </div>

                <div className="w-full pt-8 px-2 text-lg font-sans">
                    Now here's how the cars will work:
                    <ul>
                        <li>Car 1 travels from point <b>A</b> to point <b>B</b> at a constant speed and then back from B to A at the same constant speed.</li>
                        <li>Car 2 travels the same route with a constant wind blowing in the direction from <b>A</b> to <b>B</b>. </li>
                        <li>This wind speeds Car 2 up on the way to <b>B</b> and slows it down on the way back to <b>B</b>.</li>
                    </ul>    
                </div>

                <div className="w-full pt-8 px-2 text-lg font-sans">
                    Understand? 
                    Great, now here's the question: 
                    <p><i>Will Car 2 complete its journey faster or slower than Car 1?</i></p>
                </div>

                <p className="w-full pt-8 px-2 text-lg font-sans">
                    That's easy, right? Our intuition might suggest that Car 2 would take the same amount of time as Car 1. After all, Car 2 is faster going from <b>A</b> to <b>B</b> and slower going back from <b>B</b> to <b>A</b>, so the times might balance out.
                </p>


                <p className="w-full pt-8 px-2 text-lg font-sans">
                    Unfortunately, this intuition is incorrect. 
                </p>

                <p className="w-full px-2 text-lg font-sans font-bold">
                    Car 2 will always take longer than Car 1 at any given wind speed.
                </p>

                <p className="w-full pt-8 px-2 text-lg font-sans">
                    But How? Lets understand by applying the concept of limits.
                </p>

                <div className="w-full">
                    <p className="w-full pt-8 px-2 text-lg font-sans">
                        Consider the following, the red car is moving at a constant speed with no wind.
                    </p>
                    <MovingCar wind={0} color="red" />                  

                </div>

                <div className="w-full">
                    <p className="w-full pt-8 px-2 text-lg font-sans">
                        Now lets see the blue car moving with a certain wind speed.
                        Try changing the wind speed to see how it affects the car's speed.
                    </p>
                    <MovingCar wind={0.5} color="blue" />                  
                </div>

                <p className="w-full pt-8 px-2 text-lg font-sans">
                    You can see that when the wind speed increases the car's speed is affected. The higher the wind speed, the slower the car moves.
                </p>
                <p className="w-full px-2 text-lg font-sans">
                    And did you notice what happens when the wind speed is exactly the same as the car's speed? (try setting the wind speed to 1) 
                    The car will never be able to return from <b>B</b> to <b>A</b> because the wind cancels out the car's speed completely.
                </p>

                <p className="w-full pt-8 px-2 text-lg font-sans">
                    As you can see, the concept of limits can be very useful to answer such confusing questions.
                </p>

                <p className="w-full pt-8 px-2 text-lg font-sans">
                    But to be complete and transparent lets see the proof using physics.
                </p>

                <p className="w-full pt-8 px-2 text-lg font-sans">
                    <b>A Simple Math Proof</b>
                </p>

                <p className="w-full pt-4 px-2 text-lg font-sans">
                    Let's use a bit of algebra to see why this happens:
                </p>

                <div className="w-full pt-4 px-2 text-lg font-sans">
                    Distance between <b>A</b> and <b>B</b>:  `d` <br />
                    Car's speed in still air: {"`v`"} <br />
                    Wind speed: {"`w`"} <br />
                </div>

                <div className="w-full p-4 px-2 text-lg font-sans">
                    Time for Car 2 to travel from <b>A</b> to <b>B</b>:  <br />
                    {"`Time_{AB} = d / (v + w)`"}
                </div>

                <div className="w-full pt-4 px-2 text-lg font-sans">
                    Time for Car 2 to travel from <b>B</b> to <b>A</b>:  <br />
                    {"`Time_{BA} = d / (v - w)`"}
                </div>

                <div className="w-full pt-4 px-2 text-lg font-sans">
                    <p className="pb-1">Total Round-Trip Time for Car 2:  </p>
                    <p className="pb-1"> {"`Total Time = Time_{AB} + Time_{BA}`"} </p>
                    {"`Total Time = d / (v + w) + d / (v - w)`"}
                </div>

                <div className="w-full pt-4 px-2 text-lg font-sans">
                    <p>To combine these times, we use a common denominator: </p>
                    <p className="pb-2"> {"`Total Time = (d(v - w) + d(v + w)) / ((v + w)(v - w))`"}</p>
                    <p className="pb-2">{"`Total Time = (d(v - w + v + w)) / (v^2 - w^2)`"}</p>
                    <p className="pb-2">{"`Total Time = 2dv / (v^2 - w^2)`"}</p>

                </div>

                <p className="w-full pt-4 px-2 text-lg font-sans">
                    
                        The key point is the denominator, {"`v^2 - w^2`"}. As the wind speed {"`w`"} increases, the denominator gets smaller. When the wind speed equals the car's speed {"`(v = w)`"}, the denominator becomes zero, making the total time infinite. This matches our observation that Car 2 can't move when the wind speed is too high.
                    
                </p>

                <p className="w-full pt-8 px-2 text-lg font-sans">
                    So, as we turn up the wind, Car 2 will always take more time than Car 1, illustrating a surprising truth revealed by limits.
                </p>

            </div>
        </div>

    );
}


const MovingCar = ({wind, color}:any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const car = {
        x: 30,
        y: 60,
        speed: 1
    } as { x: number, y: number, speed: number };
    let ctx = canvasRef.current?.getContext('2d');
    let time = 0;
    let paused = true;
    const buttonRef = useRef<HTMLButtonElement>(null);
    let windState = car.speed * wind;
    const windSpeedLabelRef = useRef<HTMLLabelElement>(null);
    const setWindState = (value: number) => {
        windState = car.speed * value;
        windSpeedLabelRef.current!.innerHTML = `Wind Speed: ${value}`;
    }

    let carDirection = 1

    const drawRoad = (canvas: HTMLCanvasElement) => {
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(0, 100);
            ctx.lineTo(canvas.width, 100);
            ctx.stroke();
        }
    }


    const drawCar = (color: string) => {
        if (ctx) {
            ctx.fillStyle = color;
            ctx.fillRect(car.x, car.y, 60, 40);
        }
    }
    
    const drawText = (text: string, x: number, y: number, size: number=40) => {
        if (ctx) {
            ctx.fillStyle = 'black';
            ctx.font = `${size}px serif`;
            ctx.fillText(text, x, y);
        }
    }

    const moveCar = (canvas: HTMLCanvasElement) => {
        if(paused) {
            return;
        }
        buttonRef.current!.innerHTML = 'Pause';
        time += 1;
    
        if(car.x >= canvas.width - 120) {
            carDirection = -1
        }
        if(car.x <= 0) {
            carDirection = 1;
        }
        car.x += car.speed * carDirection + windState;

        if(car.x < 30) {
            paused = true;
            car.x = 30;
            carDirection = 1;
            buttonRef.current!.innerHTML = 'Start';
        }

    }


    const draw = () => {
            if(!ctx){
                return;
            }

            if(!canvasRef.current){
                return;
            }

            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            drawCar(color);
            drawRoad(canvasRef.current);  
            drawText('A', 0, 100);
            drawText('B', canvasRef.current.width-30, 100);  
            moveCar(canvasRef.current);
            drawText(`Time: ${time}`, 10, 150, 30);
            requestAnimationFrame(draw);
    }


    
    waitForElement(`#moving-car-${color}`, () => {
        ctx = canvasRef.current!.getContext('2d');
        canvasRef.current!.width = window.innerWidth - 100 
        canvasRef.current!.height = 200;
        if(windSpeedLabelRef.current){
            windSpeedLabelRef.current!.innerHTML = `Wind Speed: ${windState}`;
        }
        // set car speed to the aspect ratio of the canvas
        car.speed = canvasRef.current!.width / canvasRef.current!.height;
        draw();
        window.addEventListener('resize', () => {
            canvasRef.current!.width = window.innerWidth - 100;
            canvasRef.current!.height = 200;
        });
    });


    return (

        <div 
        className="w-full flex flex-col items-start"
        id={`moving-car-${color}`}
        >
            <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-8"
            onClick={() => {
                paused = !paused;
                if(car.x <= 30) {
                    time = 0;
                }                
            }}
            ref={buttonRef}
            >
                Start
            </button>
            {
                wind === 0 ? <></> :
                <>
                <input type="range" min="0.1" max="1" step="0.1" value={windState} onChange={(e) => {setWindState(parseFloat(e.currentTarget.value))} } />
                <label ref={windSpeedLabelRef}></label>
                </>

            }
            <canvas className="w-full h-32 border mt-2" ref={canvasRef}>
             </canvas>
        </div>
    );
}