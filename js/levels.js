var defaultLevel = {
  label: 'default',
  data: "1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,"
};

function setDefaultLevel() {
  localStorage.setItem(
    "default", JSON.stringify(defaultLevel));
}