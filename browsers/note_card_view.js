var NoteCardView = function(elem){
    this.elem = elem;
    this.init();
}
NoteCardView.prototype.setNote = function(note){
    this.note = note;
    if(note.title.indexOf("untitled")==0)
        this.cardTitleText.innerHTML = ""
    else
        this.cardTitleText.innerHTML = note.title;
    var date = new Date(note.metadata.last_modification_date).toLocaleDateString();
    this.cardText.innerHTML = note.text+"<br /> <br />"+date;
}

NoteCardView.prototype.init = function(){
    this.elem.classList.add("mdl-card");
    this.elem.classList.add("note-card-view");

    this.menuButton =  document.createElement('button');
    
    this.menuButton.classList.add("mdl-button");
    
    this.menuButton.classList.add("mdl-js-button");
    this.menuButton.classList.add("mdl-button--icon");
    this.menuButton.classList.add("card-more-button");
    
    var menuButtonIcon =  document.createElement('li');
    menuButtonIcon.classList.add("material-icons");
    menuButtonIcon.innerHTML = "more_vert";
    this.menuButton.appendChild(menuButtonIcon);
    this.elem.classList.add("mdl-shadow--2dp");
    this.cardContent = document.createElement('div');
    this.cardContent.classList.add("mdl-card__supporting-text");
    this.cardContent.appendChild(this.menuButton)
    this.cardText = document.createElement('div');
    this.cardText.classList.add("card-text");
    
    this.cardTitleText = document.createElement('h2');
    this.cardTitleText.classList.add("card-title");
    this.cardContent.appendChild(this.cardTitleText)
    this.cardContent.appendChild(this.cardText)
    this.elem.appendChild(this.cardContent);
    
}

var Masonry = require('masonry-layout');
var NoteCardViewGrid = function (elem, discret){

    this.elem = elem;
    this.discret = discret;
    this.init();
}




NoteCardViewGrid.prototype.init = function(){
    this.msnry = new Masonry( this.elem, {
      // options
      itemSelector: '.demo-card-wide.mdl-card',
      fitWidth: true,
      transitionDuration: this.discret?0:"0.6s",
      animationOptions: {
        
        queue: false,
        isAnimated:false
      },      
    });

}

NoteCardViewGrid.prototype.onFolderClick = function(callback){
    this.onFolderClick = callback;
}

NoteCardViewGrid.prototype.onNoteClick = function(callback){
    this.onNoteClick = callback;
}

NoteCardViewGrid.prototype.updateNote = function(note){
    for(var i = 0; i < this.noteCards.length; i++){
        var noteCard = this.noteCards[i];
        if(noteCard.note.path == note.path){
            noteCard.setNote(note);
        }
    }
}

NoteCardViewGrid.prototype.setNotesAndFolders = function (notes){
    this.notes = notes;
    this.noteCards = [];
    for(i = 0; i < notes.length; i++){
        var note = notes[i]
        if(note instanceof Note){
        var noteElem = document.createElement("div");
        noteElem.classList.add("demo-card-wide")
        noteElem.classList.add("isotope-item")
        var noteCard = new NoteCardView(noteElem);
        noteCard.setNote(note);
        this.noteCards.push(noteCard);
        this.elem.appendChild(noteElem)
        this.msnry.appended(noteElem)

        $(noteElem).bind('click', { note: note, callback: this.onNoteClick }, function(event) {
            var data = event.data;
            data.callback(data.note)
        });
        }
        else{
            var folderElem = document.createElement("div");
            folderElem.classList.add("demo-card-wide")
            folderElem.classList.add("isotope-item")

            $(folderElem).bind('click', { folder: note, callback: this.onFolderClick }, function(event) {
                var data = event.data;
                data.callback(data.folder)
            });
            
           
            var folderCard = new FolderView(folderElem);
            folderCard.setFolder(note);
            this.elem.appendChild(folderElem)
           this.msnry.appended(folderElem)
        }
    }
    this.msnry.layout();
    this.msnry.options.transitionDuration = "0.6s" //restore even when discret
  //  this.iso.layout();
}



var FolderView = function(elem){
    this.elem = elem;
    this.init();
}
FolderView.prototype.setFolder = function(folder){
    this.folder = folder;
    this.cardTitle.innerHTML = folder.getName();
}

FolderView.prototype.init = function(){
    this.elem.classList.add("mdl-card");
    this.elem.classList.add("folder-card-view");
    this.elem.classList.add("mdl-shadow--2dp");
    this.cardContent = document.createElement('div');
    this.cardContent.classList.add("mdl-card__supporting-text");
    this.img = document.createElement('img');
    this.img.classList.add("folder-icon")
    this.img.src = "img/directory.png";
    this.cardContent.appendChild(this.img);
    
    this.cardTitle = document.createElement('h2');
    this.cardTitle.classList.add("card-title");
    this.cardTitle.style="display:inline;margin-left:5px;"
    this.cardContent.appendChild(this.cardTitle);
    this.elem.appendChild(this.cardContent);
    
}