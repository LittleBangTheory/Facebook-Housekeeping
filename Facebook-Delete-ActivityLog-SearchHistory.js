function deleteFacebookActivityLog_SearchHistory(index = 0, currentAttempt = 0) {
  // Var to store the different values for innerText
  var innerTextValues = [
    "Move to trash",
    "Delete",
    "Remove reaction",
    "Unlike",
    "Delete Your Activity",
  ]

  // Increment attempt count
  currentAttempt++;

  // If tried more than two times, go to the next item
  if (currentAttempt > 2) {
    console.log("Tried too many times, going to next item"); 
    return deleteFacebookActivityLog_SearchHistory(index + 1, 0);
  }

  var items = document.querySelectorAll('[aria-label="Action options"] > i');
  var item = items[index]

  if (item) {
      var logIdentifier = item.parentNode.parentNode.parentNode.innerText.trim();
      console.log("ACTIVITY-LOG => ", item.parentNode.parentNode.parentNode.innerText);
          
      item.scrollIntoView();
      item.click();
      setTimeout(() => {
      var opts = document.querySelectorAll('[role="menuitem"]');
      var canDelete = false
      for (let i=0; i < opts.length; i += 1) {
          var opt = opts[i];
          // If the innerText is one of the values in the array, then we can deletefaczb
          if (innerTextValues.includes(opt.innerText)) {
              var ariaLabel = opt.innerText === "Move to trash" ? "Move to Trash" : "Delete";
              canDelete = true;
              opt.click();
              setTimeout(() => {
                  var confirm = document.querySelector(`[aria-label="${ariaLabel}"][tabindex="0"]`);
                  if (confirm) {
                  confirm.click();
                  }
                  setTimeout(() => {
                      // After deletion attempt, check if the same log line is still present at the same index
                      var newItems = document.querySelectorAll('[aria-label="Action options"] > i');
                      var newItem = newItems[index];
                      var stillSame = false;
                      if (newItem) {
                        var newIdentifier = newItem.parentNode.parentNode.parentNode.innerText.trim();
                        stillSame = (newIdentifier === logIdentifier);
                      }
                      if (stillSame) {
                        // Deletion failed, try again
                        console.log("Deletion failed, retrying...");
                        deleteFacebookActivityLog_SearchHistory(index, currentAttempt);
                      } else {
                        // Deletion succeeded, move to next
                        console.log("Activity deleted");
                        deleteFacebookActivityLog_SearchHistory(index, 0);
              }
                  }, 2000);
              }, 250);
              break;
          }
      }
      if (!canDelete) {
          setTimeout(() => {
            deleteFacebookActivityLog_SearchHistory(index + 1, 0);
          console.log("Nothing to do");
          }, 250);
      }
      }, 250);
  }
}

deleteFacebookActivityLog_SearchHistory();
