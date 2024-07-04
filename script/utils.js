// export async function getActiveTab() {
//   let queryOptions = { active: true, currentWindow: true };
//   let [tab] = chrome.tabs.query(queryOptions);
//   console.log(tab);
//   return tab;
// }

export function assignKeyValueInObject(element) {
  const obj = {};
  const arrayObject = [];
  arrayObject.push(element);

  if (!Object.keys(obj).length) {
    for (let i = 0; i < element.length(); i++) {
      Object.assign(obj, { name: "xxx", age: "0" });
    }
    return obj;
  }
}
