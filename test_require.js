try {
    require('./src/objetos/MovimientoDeDinero/MovimientoDeDinero.js');
    console.log('MovimientoDeDinero Success');
    require('./src/objetos/MovimientoDeMaterial/MovimientoDeMaterial.js');
    console.log('MovimientoDeMaterial Success');
    require('./src/objetos/VentaOcasional/VentaOcasional.js');
    console.log('VentaOcasional Success');
} catch (e) {
    console.error(e);
}
