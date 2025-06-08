import Typewriter from 'typewriter-effect';

export default function TypewriterEffect({text}){
    return(
        <h1>
        <Typewriter
            options={{
                autoStart: true,
                loop: true, // Set to true if you want it to loop continuously
                delay: 85, // Adjust typing speed here
            }}
            onInit={(typewriter) => {
                typewriter
                .typeString("Welcome to <span style='color: #ff6347; font-weight: bold; font-size: 1.0em;'>WebChat</span>")
                    .pauseFor(1800)
                    .deleteAll()
                    // .callFunction(() => {
                    //     console.log('All strings were deleted');
                    // })
                    .start();
            }}
        />
    </h1>
    )
}