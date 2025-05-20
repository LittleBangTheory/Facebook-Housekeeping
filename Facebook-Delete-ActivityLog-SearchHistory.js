const attemptCounts = {}; // Track attempts per index

function deleteFacebookActivityLog_SearchHistory(index = 0) {
  // Var to store the different values for innerText
  var innerTextValues = [
    "Move to trash",
    "Delete",
    "Remove reaction",
    "Unlike",
  ]

  // Increment attempt count for this index
  attemptCounts[index] = (attemptCounts[index] || 0) + 1;

  // If tried more than twice, skip to next
  if (attemptCounts[index] > 2) {
    console.log(`Skipping index ${index} after 2 failed attempts.`);
    deleteFacebookActivityLog_SearchHistory(index + 1);
    return;
  }

  var items = document.querySelectorAll('[aria-label="Action options"] > i');
  var item = items[index]

  if (item) {
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
                    deleteFacebookActivityLog_SearchHistory(index);
                  console.log("Activity deleted");
                  }, 2000);
              }, 250);
              break;
          }
      }
      if (!canDelete) {
          setTimeout(() => {
            deleteFacebookActivityLog_SearchHistory(index + 1);
          console.log("Nothing to do");
          }, 250);
      }
      }, 250);
  }
}

deleteFacebookActivityLog_SearchHistory();
