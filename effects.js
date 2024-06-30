// const handleOnMouseMove = (e) => {
//     const { currentTarget: target } = e;

//     const rect = card.getBoundingClientRect(),
//         x = e.clientX - rect.left,
//         y = e.clientY - rect.top;

//     card.style.setProperty("--mouse-x", `${x}px`);
//     card.style.setProperty("--mouse-y", `${y}px`);

//     const width = rect.right - rect.left;
//     const height = rect.bottom - rect.top;
// }

// for(const card of document.querySelectorAll(".card")) {
//     card.onmousemove = e => handleOnMouseMove(e);
// }