var defaultLevel = {
  label: 'default',
  data: "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,",
  time1: null,
  time2: null,
  time3: null
};

function setDefaultLevel() {
  console.log(localStorage.getItem("default"));
  if (localStorage.getItem("default") == null)
    localStorage.setItem(
      "default", JSON.stringify(defaultLevel));
}