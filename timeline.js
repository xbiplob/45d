// Cosmic Timeline Module

// DOM Elements
const timelineViewer = document.getElementById('timeline-viewer');
const timelineSlider = document.getElementById('timeline-slider');
const timelinePlayBtn = document.getElementById('timeline-play');
const timelinePauseBtn = document.getElementById('timeline-pause');

// Timeline data
const timelineData = [
    { 
        time: -13800000000, 
        label: "Big Bang", 
        description: "The beginning of space and time",
        color: "#ff9900",
        size: 20
    },
    { 
        time: -13000000000, 
        label: "First Stars", 
        description: "Formation of the first stellar objects",
        color: "#ffff00",
        size: 12
    },
    { 
        time: -12000000000, 
        label: "First Galaxies", 
        description: "Formation of early galaxies",
        color: "#00bfff",
        size: 15
    },
    { 
        time: -10000000000, 
        label: "Reionization", 
        description: "The universe becomes transparent to light",
        color: "#ff5555",
        size: 10
    },
    { 
        time: -5000000000, 
        label: "Solar System", 
        description: "Formation of our solar system",
        color: "#1f77b4",
        size: 14
    },
    { 
        time: -3500000000, 
        label: "Life on Earth", 
        description: "First emergence of life",
        color: "#00cc66",
        size: 12
    },
    { 
        time: -500000000, 
        label: "Cambrian", 
        description: "Explosion of complex life forms",
        color: "#00cc66",
        size: 10
    },
    { 
        time: -65000000, 
        label: "Dinosaurs", 
        description: "Extinction of non-avian dinosaurs",
        color: "#cc6600",
        size: 10
    },
    { 
        time: -200000, 
        label: "Humans", 
        description: "Anatomically modern humans appear",
        color: "#ff33cc",
        size: 8
    },
    { 
        time: -10000, 
        label: "Agriculture", 
        description: "Development of agriculture",
        color: "#996633",
        size: 6
    },
    { 
        time: -200, 
        label: "Industrial", 
        description: "Industrial revolution begins",
        color: "#666666",
        size: 6
    },
    { 
        time: 0, 
        label: "Present", 
        description: "Current time",
        color: "#ffffff",
        size: 10
    },
    { 
        time: 1000000000, 
        label: "Sun Red Giant", 
        description: "The Sun becomes a red giant",
        color: "#ff5555",
        size: 14
    },
    { 
        time: 5000000000, 
        label: "Sun Dies", 
        description: "The Sun exhausts its fuel",
        color: "#880000",
        size: 12
    },
    { 
        time: 100000000000, 
        label: "Stelliferous", 
        description: "End of star formation era",
        color: "#333333",
        size: 10
    },
    { 
        time: 1000000000000, 
        label: "Degenerate", 
        description: "Galaxies dominated by white dwarfs and neutron stars",
        color: "#222222",
        size: 8
    },
    { 
        time: 10000000000000, 
        label: "Black Hole", 
        description: "Universe dominated by black holes",
        color: "#000000",
        size: 8
    },
    { 
        time: 100000000000000, 
        label: "Heat Death", 
        description: "Maximum entropy, no usable energy",
        color: "#111111",
        size: 6
    }
];

// Timeline variables
let timelineCtx;
let isPlaying = false;
let animationId;
let currentTime = 0;

// Initialize timeline
function initTimeline() {
    if (!timelineViewer) return;
    
    // Set up canvas
    setupTimelineCanvas();
    
    // Set up controls
    setupTimelineControls();
    
    // Draw initial timeline
    drawTimeline();
}

// Set up timeline canvas
function setupTimelineCanvas() {
    // Set canvas dimensions
    timelineViewer.width = timelineViewer.clientWidth;
    timelineViewer.height = timelineViewer.clientHeight;
    
    // Get 2D context
    timelineCtx = timelineViewer.getContext('2d');
    
    // Set up context
    timelineCtx.fillStyle = '#0a0a2a';
    timelineCtx.fillRect(0, 0, timelineViewer.width, timelineViewer.height);
}

// Set up timeline controls
function setupTimelineControls() {
    // Slider control
    timelineSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        currentTime = mapValueToTime(value);
        drawTimeline();
    });
    
    // Play button
    timelinePlayBtn.addEventListener('click', () => {
        isPlaying = true;
        playTimeline();
    });
    
    // Pause button
    timelinePauseBtn.addEventListener('click', () => {
        isPlaying = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        timelineViewer.width = timelineViewer.clientWidth;
        timelineViewer.height = timelineViewer.clientHeight;
        drawTimeline();
    });
}

// Play timeline animation
function playTimeline() {
    if (!isPlaying) return;
    
    // Update current time
    currentTime += 100000000; // Move forward 100 million years per frame
    
    // Check if we've reached the end
    if (currentTime > timelineData[timelineData.length - 1].time) {
        currentTime = timelineData[0].time;
    }
    
    // Update slider
    const sliderValue = mapTimeToValue(currentTime);
    timelineSlider.value = sliderValue;
    
    // Draw timeline
    drawTimeline();
    
    // Continue animation
    animationId = requestAnimationFrame(playTimeline);
}

// Draw timeline
function drawTimeline() {
    if (!timelineCtx) return;
    
    const width = timelineViewer.width;
    const height = timelineViewer.height;
    
    // Clear canvas
    timelineCtx.fillStyle = '#0a0a2a';
    timelineCtx.fillRect(0, 0, width, height);
    
    // Draw timeline axis
    const axisY = height / 2;
    timelineCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    timelineCtx.lineWidth = 2;
    timelineCtx.beginPath();
    timelineCtx.moveTo(50, axisY);
    timelineCtx.lineTo(width - 50, axisY);
    timelineCtx.stroke();
    
    // Draw time markers
    drawTimeMarkers(width, height, axisY);
    
    // Draw timeline events
    drawTimelineEvents(width, height, axisY);
    
    // Draw current time indicator
    drawCurrentTimeIndicator(width, height, axisY);
}

// Draw time markers
function drawTimeMarkers(width, height, axisY) {
    timelineCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    timelineCtx.font = '12px Arial';
    timelineCtx.textAlign = 'center';
    
    // Draw major time markers
    const timePoints = [
        { time: -13800000000, label: "13.8 BYA" },
        { time: -10000000000, label: "10 BYA" },
        { time: -5000000000, label: "5 BYA" },
        { time: 0, label: "Now" },
        { time: 5000000000, label: "5 BY" },
        { time: 10000000000, label: "10 BY" },
        { time: 100000000000, label: "100 BY" }
    ];
    
    timePoints.forEach(point => {
        const x = mapTimeToX(point.time, width);
        if (x >= 50 && x <= width - 50) {
            // Draw tick mark
            timelineCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            timelineCtx.lineWidth = 1;
            timelineCtx.beginPath();
            timelineCtx.moveTo(x, axisY - 10);
            timelineCtx.lineTo(x, axisY + 10);
            timelineCtx.stroke();
            
            // Draw label
            timelineCtx.fillText(point.label, x, axisY + 30);
        }
    });
}

// Draw timeline events
function drawTimelineEvents(width, height, axisY) {
    timelineData.forEach(event => {
        const x = mapTimeToX(event.time, width);
        const y = axisY;
        
        // Only draw if within visible range
        if (x >= 0 && x <= width) {
            // Draw event marker
            timelineCtx.fillStyle = event.color;
            timelineCtx.beginPath();
            timelineCtx.arc(x, y, event.size, 0, Math.PI * 2);
            timelineCtx.fill();
            
            // Draw glow effect
            const gradient = timelineCtx.createRadialGradient(
                x, y, event.size,
                x, y, event.size * 2
            );
            gradient.addColorStop(0, event.color);
            gradient.addColorStop(1, 'transparent');
            
            timelineCtx.fillStyle = gradient;
            timelineCtx.beginPath();
            timelineCtx.arc(x, y, event.size * 2, 0, Math.PI * 2);
            timelineCtx.fill();
            
            // Draw event label if it's a major event
            if (event.size >= 10) {
                timelineCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                timelineCtx.font = '14px Arial';
                timelineCtx.textAlign = 'center';
                timelineCtx.fillText(event.label, x, y - event.size - 10);
            }
        }
    });
}

// Draw current time indicator
function drawCurrentTimeIndicator(width, height, axisY) {
    const x = mapTimeToX(currentTime, width);
    
    // Draw indicator line
    timelineCtx.strokeStyle = '#00bfff';
    timelineCtx.lineWidth = 3;
    timelineCtx.setLineDash([5, 5]);
    timelineCtx.beginPath();
    timelineCtx.moveTo(x, 0);
    timelineCtx.lineTo(x, height);
    timelineCtx.stroke();
    timelineCtx.setLineDash([]);
    
    // Draw indicator label
    timelineCtx.fillStyle = '#00bfff';
    timelineCtx.font = '16px Arial';
    timelineCtx.textAlign = 'center';
    
    // Format current time for display
    const timeLabel = formatTimeForDisplay(currentTime);
    timelineCtx.fillText(timeLabel, x, 30);
    
    // Draw description of current era
    const currentEvent = getCurrentEvent();
    if (currentEvent) {
        timelineCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        timelineCtx.font = '14px Arial';
        timelineCtx.fillText(currentEvent.description, x, height - 30);
    }
}

// Map time to X coordinate
function mapTimeToX(time, width) {
    // Logarithmic scale for better visualization
    const minTime = timelineData[0].time;
    const maxTime = timelineData[timelineData.length - 1].time;
    
    // Handle negative and positive times separately for log scale
    if (time < 0) {
        const logMin = Math.log(-minTime);
        const logTime = Math.log(-Math.min(time, -1)); // Avoid log(0)
        const ratio = (logMin - logTime) / (logMin - Math.log(1));
        return 50 + ratio * (width - 100) / 2;
    } else if (time > 0) {
        const logMax = Math.log(maxTime);
        const logTime = Math.log(Math.max(time, 1)); // Avoid log(0)
        const ratio = logTime / logMax;
        return 50 + (width - 100) / 2 + ratio * (width - 100) / 2;
    } else {
        return width / 2;
    }
}

// Map X coordinate to time
function mapXToTime(x, width) {
    // This is a simplified linear mapping for the slider
    const minTime = timelineData[0].time;
    const maxTime = timelineData[timelineData.length - 1].time;
    return minTime + (x / 100) * (maxTime - minTime);
}

// Map slider value to time
function mapValueToTime(value) {
    const minTime = timelineData[0].time;
    const maxTime = timelineData[timelineData.length - 1].time;
    return minTime + (value / 100) * (maxTime - minTime);
}

// Map time to slider value
function mapTimeToValue(time) {
    const minTime = timelineData[0].time;
    const maxTime = timelineData[timelineData.length - 1].time;
    return ((time - minTime) / (maxTime - minTime)) * 100;
}

// Format time for display
function formatTimeForDisplay(time) {
    if (time < -1000000000) {
        return `${(time / 1000000000).toFixed(1)} BYA`;
    } else if (time < -1000000) {
        return `${(time / 1000000).toFixed(1)} MYA`;
    } else if (time < -1000) {
        return `${(time / 1000).toFixed(1)} KYA`;
    } else if (time < 0) {
        return `${Math.abs(time)} years ago`;
    } else if (time > 1000000000000) {
        return `${(time / 1000000000000).toFixed(1)} TY`;
    } else if (time > 1000000000) {
        return `${(time / 1000000000).toFixed(1)} BY`;
    } else if (time > 1000000) {
        return `${(time / 1000000).toFixed(1)} MY`;
    } else if (time > 1000) {
        return `${(time / 1000).toFixed(1)} KY`;
    } else {
        return `${time} years`;
    }
}

// Get current event based on time
function getCurrentEvent() {
    // Find the event closest to current time
    let closestEvent = timelineData[0];
    let minDistance = Math.abs(currentTime - closestEvent.time);
    
    for (let i = 1; i < timelineData.length; i++) {
        const distance = Math.abs(currentTime - timelineData[i].time);
        if (distance < minDistance) {
            minDistance = distance;
            closestEvent = timelineData[i];
        }
    }
    
    return closestEvent;
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for the timeline section to be visible
    const timelineSection = document.getElementById('timeline');
    if (timelineSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initTimeline();
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(timelineSection);
    }
});

// Export for use in other modules
window.CosmicTimeline = {
    init: initTimeline
};
