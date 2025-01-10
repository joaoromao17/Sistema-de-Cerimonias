bottomMenu = document.getElementById("menu_bar");
menu = document.getElementById("nav_bar")
subs = document.querySelectorAll(".sub-item");
function openMenu() {
    bottomMenu.classList.toggle('active');
    if (menu.className == 'show') {
        menu.classList.add('hide')
        menu.classList.remove('show')
        for(let k = 0, j = subs.length; k < j; k++){
            subs[k].style.display = 'none';
        }
    } else {
        menu.classList.remove('hide')
        menu.classList.add('show')
    }
function openSubItem(sub) {
    for(let k = 0, j = subs.length; k < j; k++){
        if(subs[k].style.display == 'flex'){
            subs[k].style.display  = 'none';
        }
        sub.style.display = 'flex'; 
        }
}
function hideSubItem(sub) {
    sub.style.display = 'none';
}
var mouseClick = document.querySelector('.nav_items');
mouseClick.addEventListener('click', function (e) {
    sub = e.target.id;
    var subMenu = String(sub).replace("nav", "sub");
    subMenuResult = document.getElementById(subMenu)
    if (subMenuResult.style.display == 'none') {
        console.log(subMenuResult)
        openSubItem(subMenuResult);
    } else {
    hideSubItem(subMenuResult);
    }
})};
function load(page){
	document.querySelector("#content").load(page);
}

