import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 

const ParticlesBackground = () => {
    const [init, setInit] = useState(false);

    
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        
    };

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            className="absolute inset-0"
            particlesLoaded={particlesLoaded}
            options={{
                fullScreen: { enable: false },
                background: { color: "transparent" },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" },
                        resize: true,
                    },
                },
                particles: {
                    color: { value: "#ffffff" },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.4,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        direction: "none",
                        outModes: "bounce",
                    },
                    number: {
                        density: { enable: true, area: 800 },
                        value: 80,
                    },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 3 } },
                },
                detectRetina: true,
            }}
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                zIndex: 0,
            }}
        />
    );
};

export default ParticlesBackground;