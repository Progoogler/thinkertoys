'use strict';

app.controller('thinkertoyController', ['$scope', '$resource', ($scope, $resource) => {
  const Thinkertoy = $resource('/api/thinkertoys',
      {'$save': {method: 'POST', isArray: false} },
      {'$query': {method: 'GET', isArray: false} },
      {'$update': {method: 'PUT'} }
  );

  $scope.checkOption = () => {
    let bool;
    let option = $('#text-menu').val();
    (option === "Load previous session") ? bool = false : bool = true;
    return bool;
  };

  $scope.data = {};

  const titleFix = (name) => {
    let trimmed = '';
    for (let i = 0, len = name.length; i < len; i++) {
      if (name[i] === '<') {
        i += 3;
        continue;
      } else {
        trimmed += name[i];
      }
    }
    return trimmed.replace(/^\s\s*/, '').replace(/\s\s*$/, '');      
  };


  $scope.saveThinkertoy = () => {
    let thinkertoy = new Thinkertoy();
    let fileName;

    swal({   
      title: "Save current session",   
      text: "Give your toy a name:",   
      type: "input",   
      showCancelButton: true,   
      closeOnConfirm: false,   
      allowOutsideClick: true,
      animation: "slide-from-top",   
      inputPlaceholder: "My Thinking Toy" 
    }, 
    function(inputValue){   
      if (inputValue === false) return false;      
      if (inputValue === "") {     
        swal.showInputError("Your toy needs a name!");     
        return false   
      }      
      swal("Your toy's name is:    "  + inputValue, "saved!"); 
      fileName = inputValue;
      save(fileName);
    });

    function save(fileName) {
      thinkertoy.name = $( '#toy-title' ).html();
      if (thinkertoy.name === "<p> Welcome to the ThinkerToy Playground! </p>") {
        thinkertoy.name = titleFix(thinkertoy.name);
      }
      thinkertoy.fileName = fileName;
      thinkertoy.text = CKEDITOR.instances['editor'].getData();        

      Thinkertoy.save(thinkertoy, (result) => {
      });
    }
  };


  let removeData = () => {
    CKEDITOR.instances['editor'].setData('');
  };

  $scope.loadThinkertoy = () => {
    let toy = $('#toy-title').html(); 
    if (toy === "<p> Welcome to the ThinkerToy Playground! </p>") {
      toy = titleFix(toy);
    }
    let found = false;
    let fileName = false;

    swal({  
      title: "Load previous session",   
      text: "What was the name of your toy?",   
      type: "input",   
      showCancelButton: true,   
      closeOnConfirm: true,   
      allowOutsideClick: true,
      animation: "slide-from-top",   
      inputPlaceholder: "My Thinking Toy" 
    }, 
    function(inputValue){   
      if (inputValue === false) return false;      
      if (inputValue === "") {     
        swal.showInputError("Your toy had a name!");     
        return false   
      }
      fileName = inputValue;
      query(fileName);     
    });    

    function query(file) {
      let data =
      Thinkertoy.
        $query(() => { 
          for (let prop in data) {
            if (Array.isArray(data[prop])) {
              for (let i = 0, len = data[prop].length; i < len; i++) {
                if (data[prop][i]['fileName'] === fileName) {
                  CKEDITOR.instances['editor'].setData(data[prop][i]['text']);
                  found = true;
                  break;
                }          
              }
            }
          }
          if (found === false) {
            CKEDITOR.instances['editor'].setData("<br /> <br /> <br /><h2 style='color:blue; text-align:center'>Sorry, the previous session was not found.. :(<br />Did you leave your toy somewhere else perhaps?</h2>");
            setTimeout(removeData,
            6500);
          }
        });
      }
  };

}]);
