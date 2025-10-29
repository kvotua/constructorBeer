let imageUpload=document.getElementById(`image_upload`);
let imagePreview=document.getElementById(`image_preview`);
// let backgroundUpload=document.getElementById(`background_upload`);
// let backgroundPreview=document.getElementById(`background_preview`);
let logoUpload=document.getElementById(`logo_upload`);
let logoPreview=document.getElementById(`logo_preview`);

function setupImageUpload(uploadInput,previewImg){
  uploadInput.addEventListener(`change`,function(event){
    let selectedFile=event.target.files[0];
    let imageUrl = URL.createObjectURL(selectedFile);
            previewImg.src = imageUrl;
previewImg.style.opacity = '100%';
  });
}

    setupImageUpload(imageUpload, imagePreview);
    // setupImageUpload(backgroundUpload, backgroundPreview);
    setupImageUpload(logoUpload, logoPreview);

