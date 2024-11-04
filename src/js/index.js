// T-shirt title element in HTML
const tShirtHTML = `
<div class="tshirt-text-overlay">
    <div id="shirt-title" class="shirt-title"></div>
</div>
<div id="dragged-images-container"></div>
<div id="mirrored-image-container"></div>
`;

// Required CSS styles
const styles = `
<style>
.preview-panel {
    position: relative;
}

.tshirt-text-overlay {
    position: absolute;
    top: 35%;
    left: 0;
    width: 100%;
    pointer-events: none;
}

.shirt-title {
    color: white;
    font-family: 'Arial', sans-serif;
    font-size: 20px;
    text-align: center;
    padding: 10px;
    width: 200px;
    word-wrap: break-word;
    position: relative;
    transition: transform 0.1s ease;
}

#dragged-images-container, #mirrored-image-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.dragged-image {
    position: absolute;
    max-width: 100px;
    cursor: move;
    pointer-events: auto;
}

.mirrored-image {
    position: absolute;
    max-width: 35px;
    transform: scaleX(-1);
    pointer-events: none;
    /* Positioning adjusted for t-shirt */
    top: 125px;  /* Adjust this value according to your t-shirt position */
    right: 150px; /* Adjust this value according to your t-shirt position */
}

.tshirt-preview, .tshirt-preview-white {
    display: none;
}

.tshirt-preview.active {
    display: block;
}
</style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', styles);

// Add overlay to preview panel
document.querySelector('.preview-panel').insertAdjacentHTML('beforeend', tShirtHTML);

// Function to update title and its position
function updateTshirtTitle() {
  const titleInput = document.querySelector('.title-section input[type="text"]');
  const shirtTitle = document.getElementById('shirt-title');
  const horizontalSlider = document.querySelector('.range input[type="range"]:not(.height-movement)');
  const verticalSlider = document.querySelector('.range input[type="range"].height-movement');

  titleInput.setAttribute('maxlength', '10');

  titleInput.addEventListener('input', function (e) {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.slice(0, 10);
    }
    shirtTitle.textContent = e.target.value;
  });

  horizontalSlider.addEventListener('input', function (e) {
    updatePosition(shirtTitle, horizontalSlider, verticalSlider);
  });

  verticalSlider.addEventListener('input', function (e) {
    updatePosition(shirtTitle, horizontalSlider, verticalSlider);
  });
}

// Function to update text position
function updatePosition(shirtTitle, horizontalSlider, verticalSlider) {
  const horizontalValue = parseInt(horizontalSlider.value);
  const verticalValue = parseInt(verticalSlider.value);
  const horizontalOffset = (horizontalValue + 2) * 25;
  const verticalOffset = (verticalValue - 1) * 25;
  shirtTitle.style.transform = `translate(${horizontalOffset}px, ${verticalOffset}px)`;
}

// Function to handle t-shirt color change
function setupColorChange() {
  const blackRadio = document.getElementById('black');
  const whiteRadio = document.getElementById('white');
  const blackShirt = document.querySelector('.tshirt-preview');
  const whiteShirt = document.querySelector('.tshirt-preview-white');
  const shirtTitle = document.getElementById('shirt-title');

  blackShirt.classList.add('active');

  blackRadio.addEventListener('change', function () {
    blackShirt.classList.add('active');
    whiteShirt.classList.remove('active');
    shirtTitle.style.color = 'white';
  });

  whiteRadio.addEventListener('change', function () {
    whiteShirt.classList.add('active');
    blackShirt.classList.remove('active');
    shirtTitle.style.color = 'black';
  });
}

// Variables to store images
let currentDraggedImage = null;
let currentMirroredImage = null;

// Function to create mirrored image
function createMirroredImage(imgSrc) {
  // Remove previous mirrored image if exists
  if (currentMirroredImage) {
    currentMirroredImage.remove();
  }

  const mirroredContainer = document.getElementById('mirrored-image-container');
  const mirroredImage = document.createElement('img');
  mirroredImage.src = imgSrc;
  mirroredImage.classList.add('mirrored-image');
  mirroredContainer.appendChild(mirroredImage);
  currentMirroredImage = mirroredImage;
}

// Function to set up drag and drop for images
function setupDragAndDrop() {
  const characterImages = document.querySelectorAll('.character-image');
  const previewPanel = document.querySelector('.preview-panel');
  const container = document.getElementById('dragged-images-container');

  characterImages.forEach(img => {
    img.addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', img.src);
    });
  });

  previewPanel.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  previewPanel.addEventListener('drop', function (e) {
    e.preventDefault();
    const imgSrc = e.dataTransfer.getData('text/plain');

    // Remove previous image if exists
    if (currentDraggedImage) {
      currentDraggedImage.remove();
    }

    // Create new draggable image
    const newImage = document.createElement('img');
    newImage.src = imgSrc;
    newImage.classList.add('dragged-image');

    // Position the image where it was dropped
    const rect = previewPanel.getBoundingClientRect();
    const x = e.clientX - rect.left - 50;
    const y = e.clientY - rect.top - 50;

    newImage.style.left = `${x}px`;
    newImage.style.top = `${y}px`;

    container.appendChild(newImage);

    // Update current image reference
    currentDraggedImage = newImage;

    // Create mirrored image
    createMirroredImage(imgSrc);

    // Make image draggable after dropping
    makeDraggable(newImage);
  });
}

// Function to make images draggable after dropping
function makeDraggable(element) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  element.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Function to initialize everything
function initializeTshirtCustomizer() {
  updateTshirtTitle();
  setupColorChange();
  setupDragAndDrop();
}

// Execute when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTshirtCustomizer);
