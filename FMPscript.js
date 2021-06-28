const wrapper = document.querySelector(".wrapper");
const fileName = document.querySelector(".file-name");
const defaultBtn = document.querySelector("#default-btn");
const customBtn = document.querySelector("#custom-btn");
const cancelBtn = document.querySelector("#cancel-btn i");
const img = document.querySelector("img");
let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;
var fileInfo = "default";

//클릭 업로드
function defaultBtnActive(){
    defaultBtn.click();
}
defaultBtn.addEventListener("change", function(){

  const file = this.files[0];
      if(file){
          const reader = new FileReader();
          reader.onload = function(){
            const result = reader.result;
            
            wrapper.classList.add("active");
          }
          cancelBtn.addEventListener("click", function(){
            wrapper.classList.remove("active");
          })
          reader.readAsDataURL(file);
          
          fileInfo = file;
      }
      if(this.value){
          let valueStore = this.value.match(regExp);
          fileName.textContent = valueStore;
      }
});

$('.wrapper')
  .on("dragover", dragOver)
  .on("dragleave", dragOver)
  .on("drop", uploadFiles);

function dragOver(e){
  e.stopPropagation();
  e.preventDefault();
  if (e.type == "dragover") {
    $(e.target).css({
      "background-color": "#ebfef4",
      "outline-offset": "-20px"
    });
  } else {
      $(e.target).css({
      "background-color": "white",
      "outline-offset": "-10px"
    });
    }
}
//드래그 업로드
function uploadFiles(e) {
    e.stopPropagation();
    e.preventDefault();
    dragOver(e);
    e.dataTransfer = e.originalEvent.dataTransfer;
    var files = e.target.files || e.dataTransfer.files;

    if (files.length > 1) {
        alert("하나의 동영상을 올려주십시오");
        return;
    }
    if (files[0].type.match(/video.*./)) {
      $(e.target).css({
          "background-image": "url(" + window.URL.createObjectURL(files[0]) + ")",
          "outline": "none",
          "background-size": "100% 100%"
      });
      //-----------------------
      //fileInfo = e.dataTransfer.files[0]["name"];
      fileInfo = files[0];
    }else{
      alert("동영상 파일이 아닙니다.");
      return;
    }
}

function loadingActive(){
  
  if(fileInfo == "default"){
    window.alert("파일을 업로드하세요!");
  }
  else{
    //window.alert(fileInfo);
    fileInfo = "newClass.mp4";
    sessionStorage.setItem("fileinfo", fileInfo);
    var link = 'FileAnalPage.html';
    window.location.href = link;
    window.open(link);
  }
}