let imageData = [];


function renderImages() {
  const imageList = document.getElementById('imageList');
  imageList.innerHTML = '';

  imageData.forEach((item, index) => {
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';

    imageItem.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.image_name}">
            <div class="image-info">
                <div class="original-text">Original Text: ${item.text}</div>
                <input type="text" 
                       class="correction-input" 
                       placeholder="Input correction and press Enter" 
                       data-index="${index}">
                <div class="corrections-history">
                    <h4 style="color: black; display: inline-block;">Correction History</h4>
                    ${item.corrections.length > 0 ? `
                        <span class="delete-icon" data-index="${index}" title="Delete History" style="cursor: pointer; margin-left: 8px;">🗑️</span>
                    ` : ''}
                    <div class="corrections-list">
                        ${renderCorrectionHistory(item.corrections)}
                    </div>
                </div>
            </div>
        `;

    imageList.appendChild(imageItem);
  });


  document.querySelectorAll('.correction-input').forEach(input => {
    input.addEventListener('keypress', handleCorrection);
  });
}


function handleDeleteHistory(event) {
  const index = parseInt(event.target.dataset.index);
  if (index >= 0 && index < imageData.length) {

    imageData[index].corrections = [];
    renderImages();
  }
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-icon')) {
    handleDeleteHistory(event);
  }
});


function renderCorrectionHistory(corrections) {
  if (!corrections.length) return '<div class="correction-entry">No corrections yet</div>';

  return corrections.slice().reverse().map((correction, index) => `
    <div class="correction-entry">
        ${index + 1}. ${correction.text} 
        <small>(${new Date(correction.timestamp).toLocaleString()})</small>
    </div>
`).join('');
}


function handleCorrection(event) {
  if (event.key !== 'Enter') return;

  const input = event.target;
  const index = parseInt(input.dataset.index);
  const correctionText = input.value.trim();

  if (!correctionText) return;


  imageData[index].text = correctionText;

  imageData[index].corrections.push({
    text: correctionText,
    timestamp: new Date().toISOString()
  });


  input.value = '';
  renderImages();
}


function exportJSON() {
  if (imageData.length === 0) {
    alert("No data to export");
    return;
  }


  const dataStr = JSON.stringify(imageData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'updated_image_data.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


function loadImages(data) {
  const transformedData = data.map(item => ({
    imageUrl: `/images/${item.image_name}`,
    image_name: item.image_name,
    text: item.text,
    corrections: item.corrections || []
  }));

  imageData = transformedData;
  renderImages();


  document.getElementById('exportButton').style.display = 'block';
}


document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('exportButton').style.display = 'none';


  document.getElementById('importButton').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });

  document.getElementById('importFile').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          loadImages(jsonData);
        } catch (error) {
          console.error('Invalid JSON file:', error);
        }
      };
      reader.readAsText(file);
    }
  });


  document.getElementById('exportButton').addEventListener('click', exportJSON);
});
