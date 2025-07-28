// SETI Signal Decoder Game Module

// DOM Elements
const signalCanvas = document.getElementById('signal-canvas');
const frequencySlider = document.getElementById('frequency-slider');
const scanSignalBtn = document.getElementById('scan-signal');
const decoderOutput = document.getElementById('decoder-output');

// Game variables
let signalCtx;
let signalData = [];
let isScanning = false;
let scanProgress = 0;
let animationId;

// Signal types
const signalTypes = [
    { name: "Pulsar", pattern: "pulse", color: "#ff5555" },
    { name: "Binary", pattern: "binary", color: "#5555ff" },
    { name: "Continuous Wave", pattern: "wave", color: "#55ff55" },
    { name: "Fast Radio Burst", pattern: "burst", color: "#ff55ff" },
    { name: "Hydrogen Line", pattern: "hydrogen", color: "#ffff55" }
];

// Initialize SETI game
function initSETIGame() {
    if (!signalCanvas) return;
    
    // Set up canvas
    setupSignalCanvas();
    
    // Generate initial signal
    generateRandomSignal();
    
    // Draw initial signal
    drawSignal();
    
    // Set up controls
    setupSETIControls();
}

// Set up signal canvas
function setupSignalCanvas() {
    // Set canvas dimensions
    signalCanvas.width = signalCanvas.clientWidth;
    signalCanvas.height = signalCanvas.clientHeight;
    
    // Get 2D context
    signalCtx = signalCanvas.getContext('2d');
    
    // Set up context
    signalCtx.fillStyle = '#0a0a2a';
    signalCtx.fillRect(0, 0, signalCanvas.width, signalCanvas.height);
}

// Generate random signal
function generateRandomSignal() {
    // Clear existing signal data
    signalData = [];
    
    // Choose a random signal type
    const signalType = signalTypes[Math.floor(Math.random() * signalTypes.length)];
    
    // Generate signal based on type
    switch (signalType.pattern) {
        case "pulse":
            generatePulsarSignal();
            break;
        case "binary":
            generateBinarySignal();
            break;
        case "wave":
            generateWaveSignal();
            break;
        case "burst":
            generateBurstSignal();
            break;
        case "hydrogen":
            generateHydrogenSignal();
            break;
    }
    
    // Store signal type for decoding
    signalData.type = signalType;
}

// Generate pulsar signal
function generatePulsarSignal() {
    const width = signalCanvas.width;
    const height = signalCanvas.height;
    
    // Create pulsar-like signal with regular pulses
    const pulsePeriod = 50 + Math.random() * 30; // pixels between pulses
    const pulseWidth = 5 + Math.random() * 10;
    const pulseHeight = 0.3 + Math.random() * 0.4; // 30-70% of height
    
    for (let x = 0; x < width; x++) {
        // Create pulse pattern
        const pulsePosition = x % pulsePeriod;
        let amplitude = 0;
        
        if (pulsePosition < pulseWidth) {
            // Create pulse shape (triangular)
            const pulseCenter = pulseWidth / 2;
            const distanceFromCenter = Math.abs(pulsePosition - pulseCenter);
            amplitude = (1 - distanceFromCenter / pulseCenter) * pulseHeight;
        }
        
        // Add some noise
        amplitude += (Math.random() - 0.5) * 0.1;
        
        // Ensure amplitude is within bounds
        amplitude = Math.max(0, Math.min(1, amplitude));
        
        signalData.push({
            x: x,
            y: amplitude,
            frequency: x / width // 0-1 frequency range
        });
    }
}

// Generate binary signal
function generateBinarySignal() {
    const width = signalCanvas.width;
    const height = signalCanvas.height;
    
    // Create binary signal representing data
    const bitWidth = 10 + Math.floor(Math.random() * 10); // pixels per bit
    let currentBit = Math.random() > 0.5 ? 1 : 0;
    
    for (let x = 0; x < width; x++) {
        // Change bit periodically
        if (x % bitWidth === 0) {
            currentBit = Math.random() > 0.5 ? 1 : 0;
        }
        
        // Create square wave
        const amplitude = currentBit;
        
        signalData.push({
            x: x,
            y: amplitude,
            frequency: x / width
        });
    }
}

// Generate continuous wave signal
function generateWaveSignal() {
    const width = signalCanvas.width;
    const height = signalCanvas.height;
    
    // Create continuous wave with modulation
    const baseFrequency = 0.02 + Math.random() * 0.03;
    const modulationFrequency = 0.005 + Math.random() * 0.01;
    const modulationDepth = 0.3 + Math.random() * 0.4;
    
    for (let x = 0; x < width; x++) {
        // Create carrier wave
        const carrier = Math.sin(x * baseFrequency * Math.PI * 2);
        
        // Create modulation
        const modulation = Math.sin(x * modulationFrequency * Math.PI * 2);
        
        // Apply modulation
        const amplitude = (1 + modulation * modulationDepth) * (carrier + 1) / 2;
        
        // Ensure amplitude is within bounds
        const normalizedAmplitude = Math.max(0, Math.min(1, amplitude));
        
        signalData.push({
            x: x,
            y: normalizedAmplitude,
            frequency: x / width
        });
    }
}

// Generate fast radio burst signal
function generateBurstSignal() {
    const width = signalCanvas.width;
    const height = signalCanvas.height;
    
    // Create burst signal with random bursts
    const burstCount = 3 + Math.floor(Math.random() * 5);
    const bursts = [];
    
    // Generate burst positions
    for (let i = 0; i < burstCount; i++) {
        bursts.push({
            position: Math.random() * width,
            width: 20 + Math.random() * 50,
            height: 0.5 + Math.random() * 0.5
        });
    }
    
    for (let x = 0; x < width; x++) {
        let amplitude = 0;
        
        // Check if this position is within any burst
        for (const burst of bursts) {
            if (x >= burst.position && x <= burst.position + burst.width) {
                // Create burst shape
                const distanceFromStart = x - burst.position;
                const distanceFromEnd = burst.position + burst.width - x;
                const burstProgress = distanceFromStart / burst.width;
                
                // Create Gaussian-like burst shape
                const burstAmplitude = burst.height * 
                    Math.exp(-Math.pow(burstProgress - 0.5, 2) / 0.05);
                
                amplitude = Math.max(amplitude, burstAmplitude);
            }
        }
        
        // Add some background noise
        amplitude += (Math.random() - 0.5) * 0.1;
        
        // Ensure amplitude is within bounds
        amplitude = Math.max(0, Math.min(1, amplitude));
        
        signalData.push({
            x: x,
            y: amplitude,
            frequency: x / width
        });
    }
}

// Generate hydrogen line signal
function generateHydrogenSignal() {
    const width = signalCanvas.width;
    const height = signalCanvas.height;
    
    // Create hydrogen line signal (21 cm wavelength)
    const linePosition = 0.4 + Math.random() * 0.2; // 40-60% across frequency range
    const lineWidth = 0.02 + Math.random() * 0.03; // Width of the line
    const lineHeight = 0.7 + Math.random() * 0.3; // Height of the line
    
    for (let x = 0; x < width; x++) {
        const frequency = x / width;
        
        // Create Gaussian line shape
        const distanceFromLine = Math.abs(frequency - linePosition);
        let amplitude = 0;
        
        if (distanceFromLine < lineWidth * 3) { // Only calculate within 3 standard deviations
            amplitude = lineHeight * Math.exp(-Math.pow(distanceFromLine, 2) / 
                                             (2 * Math.pow(lineWidth, 2)));
        }
        
        // Add some background noise
        amplitude += (Math.random() - 0.5) * 0.1;
        
        // Ensure amplitude is within bounds
        amplitude = Math.max(0, Math.min(1, amplitude));
        
        signalData.push({
            x: x,
            y: amplitude,
            frequency: frequency
        });
    }
}

// Draw signal on canvas
function drawSignal() {
    if (!signalCtx || signalData.length === 0) return;
    
    const width = signalCanvas.width;
    const height = signalCanvas.height;
    
    // Clear canvas
    signalCtx.fillStyle = '#0a0a2a';
    signalCtx.fillRect(0, 0, width, height);
    
    // Draw grid
    drawSignalGrid(width, height);
    
    // Draw signal
    drawSignalData(width, height);
    
    // Draw frequency indicator
    drawFrequencyIndicator(width, height);
}

// Draw signal grid
function drawSignalGrid(width, height) {
    signalCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    signalCtx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += width / 10) {
        signalCtx.beginPath();
        signalCtx.moveTo(x, 0);
        signalCtx.lineTo(x, height);
        signalCtx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= height; y += height / 5) {
        signalCtx.beginPath();
        signalCtx.moveTo(0, y);
        signalCtx.lineTo(width, y);
        signalCtx.stroke();
    }
    
    // Axis labels
    signalCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    signalCtx.font = '12px Arial';
    signalCtx.textAlign = 'center';
    
    // Frequency labels
    for (let i = 0; i <= 10; i++) {
        const x = i * width / 10;
        signalCtx.fillText(`${i * 100} MHz`, x, height - 5);
    }
    
    // Amplitude labels
    signalCtx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const y = height - i * height / 5;
        signalCtx.fillText(`${i * 20}%`, width - 5, y - 5);
    }
}

// Draw signal data
function drawSignalData(width, height) {
    if (signalData.length === 0) return;
    
    // Set line style
    signalCtx.strokeStyle = signalData.type ? signalData.type.color : '#00bfff';
    signalCtx.lineWidth = 2;
    signalCtx.beginPath();
    
    // Draw signal line
    for (let i = 0; i < signalData.length; i++) {
        const point = signalData[i];
        const x = point.x;
        const y = height - (point.y * height);
        
        if (i === 0) {
            signalCtx.moveTo(x, y);
        } else {
            signalCtx.lineTo(x, y);
        }
    }
    
    signalCtx.stroke();
    
    // Draw points for discrete signals
    if (signalData.type && signalData.type.pattern === "binary") {
        signalCtx.fillStyle = signalData.type.color;
        for (let i = 0; i < signalData.length; i += 5) {
            const point = signalData[i];
            const x = point.x;
            const y = height - (point.y * height);
            
            if (point.y > 0.5) {
                signalCtx.fillRect(x - 1, y - 1, 2, 2);
            }
        }
    }
}

// Draw frequency indicator
function drawFrequencyIndicator(width, height) {
    const frequency = frequencySlider.value / 100;
    const x = frequency * width;
    
    // Draw indicator line
    signalCtx.strokeStyle = '#00bfff';
    signalCtx.lineWidth = 2;
    signalCtx.setLineDash([5, 5]);
    signalCtx.beginPath();
    signalCtx.moveTo(x, 0);
    signalCtx.lineTo(x, height);
    signalCtx.stroke();
    signalCtx.setLineDash([]);
    
    // Draw frequency label
    signalCtx.fillStyle = '#00bfff';
    signalCtx.font = '14px Arial';
    signalCtx.textAlign = 'center';
    signalCtx.fillText(`${Math.round(frequency * 1000)} MHz`, x, 20);
}

// Set up SETI controls
function setupSETIControls() {
    // Frequency slider
    frequencySlider.addEventListener('input', () => {
        drawSignal();
    });
    
    // Scan signal button
    scanSignalBtn.addEventListener('click', () => {
        if (!isScanning) {
            startSignalScan();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        signalCanvas.width = signalCanvas.clientWidth;
        signalCanvas.height = signalCanvas.clientHeight;
        drawSignal();
    });
}

// Start signal scan
function startSignalScan() {
    if (isScanning) return;
    
    isScanning = true;
    scanProgress = 0;
    decoderOutput.value = "Scanning signal...\n";
    
    // Disable button during scan
    scanSignalBtn.disabled = true;
    scanSignalBtn.textContent = "Scanning...";
    
    // Start scanning animation
    animateScan();
}

// Animate signal scan
function animateScan() {
    if (!isScanning) return;
    
    // Update scan progress
    scanProgress += 2;
    
    // Update decoder output
    if (scanProgress % 20 === 0) {
        const progressText = `Scanning... ${scanProgress}%\n`;
        decoderOutput.value += progressText;
        decoderOutput.scrollTop = decoderOutput.scrollHeight;
    }
    
    // Draw scan effect
    drawScanEffect();
    
    // Continue animation or finish scan
    if (scanProgress < 100) {
        animationId = requestAnimationFrame(animateScan);
    } else {
        finishSignalScan();
    }
}

// Draw scan effect
function drawScanEffect() {
    if (!signalCtx) return;
    
    const width = signalCanvas.width;
    const height = signalCanvas.height;
    
    // Draw scan line
    const scanX = (scanProgress / 100) * width;
    
    signalCtx.strokeStyle = '#00ff00';
    signalCtx.lineWidth = 3;
    signalCtx.beginPath();
    signalCtx.moveTo(scanX, 0);
    signalCtx.lineTo(scanX, height);
    signalCtx.stroke();
}

// Finish signal scan
function finishSignalScan() {
    isScanning = false;
    
    // Cancel animation
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    // Re-enable button
    scanSignalBtn.disabled = false;
    scanSignalBtn.textContent = "Scan Signal";
    
    // Decode signal
    decodeSignal();
}

// Decode signal
function decodeSignal() {
    if (!signalData.type) return;
    
    // Add completion message
    decoderOutput.value += "Scan complete!\n";
    
    // Determine signal type and provide information
    const signalType = signalData.type;
    decoderOutput.value += `Detected signal type: ${signalType.name}\n`;
    
    // Provide information based on signal type
    switch (signalType.pattern) {
        case "pulse":
            decoderOutput.value += "This appears to be a pulsar signal.\n";
            decoderOutput.value += "Pulsars are rapidly rotating neutron stars that emit beams of electromagnetic radiation.\n";
            decoderOutput.value += "The regular pulses can be used as precise cosmic clocks.\n";
            break;
        case "binary":
            decoderOutput.value += "This appears to be a binary data transmission.\n";
            decoderOutput.value += "The signal contains a pattern of 1s and 0s.\n";
            decoderOutput.value += "This could represent encoded information from an extraterrestrial source.\n";
            break;
        case "wave":
            decoderOutput.value += "This appears to be a continuous wave signal.\n";
            decoderOutput.value += "Continuous waves are long-duration signals that could originate from rotating neutron stars.\n";
            decoderOutput.value += "They require long observation times to detect.\n";
            break;
        case "burst":
            decoderOutput.value += "This appears to be a fast radio burst (FRB).\n";
            decoderOutput.value += "FRBs are intense pulses of radio waves lasting milliseconds.\n";
            decoderOutput.value += "Their origin is still a mystery in astrophysics.\n";
            break;
        case "hydrogen":
            decoderOutput.value += "This appears to be a hydrogen line signal.\n";
            decoderOutput.value += "The 21-cm hydrogen line is considered a universal frequency for communication.\n";
            decoderOutput.value += "It's often proposed as a frequency for SETI searches.\n";
            break;
    }
    
    // Add scientific context
    decoderOutput.value += "\nScientific Context:\n";
    decoderOutput.value += "This simulation demonstrates how SETI scientists analyze radio signals.\n";
    decoderOutput.value += "Real signals are often buried in noise and require sophisticated algorithms to detect.\n";
    decoderOutput.value += "The search for extraterrestrial intelligence continues with projects like the Allen Telescope Array.\n";
    
    // Generate new signal for next scan
    setTimeout(() => {
        decoderOutput.value += "\nGenerating new signal for analysis...\n";
        generateRandomSignal();
        drawSignal();
    }, 2000);
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the SETI section to be visible
    const setiSection = document.getElementById('seti');
    if (setiSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initSETIGame();
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(setiSection);
    }
});

// Export for use in other modules
window.SETIGame = {
    init: initSETIGame
};
