
function install(Vue) {
}
export default install;

if (!Vue && typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export { 
	install
};
