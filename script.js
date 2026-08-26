const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

const frameCount = 299; // Total number of frames extracted
const currentFrame = index => (
  `frames/frame_${(index + 1).toString().padStart(6, '0')}.jpg`
);

const images = [];
const preloadImages = () => {
  for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }
};

// Start preloading images
preloadImages();

// Initialize the first frame and canvas size
const img = new Image();
img.src = currentFrame(0);
img.onload = function() {
  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0);
}

const updateImage = index => {
  if (images[index] && images[index].complete) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[index], 0, 0);
  } else {
    // Fallback if image isn't fully loaded yet
    const tempImg = new Image();
    tempImg.src = currentFrame(index);
    tempImg.onload = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(tempImg, 0, 0);
    }
  }
}

window.addEventListener('scroll', () => {  
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.ceil(scrollFraction * frameCount)
  );
  
  requestAnimationFrame(() => updateImage(frameIndex));
});
