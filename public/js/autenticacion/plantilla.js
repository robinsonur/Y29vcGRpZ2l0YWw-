const { name, version } = (new UAParser()).getOS();

window.version.textContent = name + ' ' + version
