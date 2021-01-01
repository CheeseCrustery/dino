let main = document.getElementById("main")
let password = document.getElementsByTagName("input")[0];
let button = document.getElementsByTagName("button")[0];
button.onclick = () => {
	if (password.value == "167") {
		window.location.replace("./game/index.html");
	} else {
		main.classList.add("shake");
		setTimeout(()=>{main.classList.remove("shake")}, 400)
	}
}