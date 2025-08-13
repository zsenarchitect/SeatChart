//applyFilter.js
//filters are in the form of 
// [{
//   key: "office",
//   type: "includes",
//   val: ["1WTC"],
// },{
// key: "wfhStatus",
// type: "includes",
// val: ["No Response",...],
// },{
//   key: "eaId",
//   type: "excludes",
//   val: [],
//   }]
// applyFilter returns new array with items that match criteria
export default function applyFilters(records, filters){
  if(typeof records === 'undefined' || records.length < 1) {console.log("incorrect records array"); return []};
  if(typeof filters === 'undefined' || filters.length < 1) {console.log("incorrect filter array"); return records};
  
  return records.filter((a, i, arr) => {
    let test = false;
    for(let f of filters){
      if (typeof a[f.key] === 'undefined') continue;
      if (!f.enabled) continue;
      switch(f.type){
        case "includes":
          test = f.val.includes(a[f.key]);
          break;
        case "subString":
            test = a[f.key].toUpperCase().includes(f.val);
            break;
        case "excludes":
          test = a[f.key] === f.val;
          break;
        default:
          break;
      }
    }
    return test;
  });
}