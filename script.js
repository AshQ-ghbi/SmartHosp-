document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
anchor.addEventListener('click',function(e){
e.preventDefault();

document.querySelector(
this.getAttribute('href')
).scrollIntoView({
behavior:'smooth'
});
});
});

const observer = new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){
entry.target.classList.add('show');
}
});
});

document.querySelectorAll(
'.card,.service-card,.feature,.testimonial'
).forEach(el=>{
observer.observe(el);
});
