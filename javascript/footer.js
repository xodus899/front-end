const getDate = () => {
  document.querySelector(".copyright").innerHTML = ` Copyright ${new Date().getFullYear()}`;
}
getDate();