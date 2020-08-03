import Connection from '../config/connection';
import Model from './Model';

String.prototype.capitalize = function(){
  return this.charAt(0).toUpperCase()+this.slice(1);
};

export default class Guest extends Model {

  constructor(data = false){
    super('guests', data);

    this.fillable = [
      'name', 
      'email',
      'event_id'
    ];

    this.data_type = {
      name: { type: 'string', required: true, alias: "Nombre" }, 
      email: {type: 'string', required: true, alias: 'Correo'},
      event_id: {type: 'integer', required: true, alias: 'Evento'}
    }
  }

   
  push(navigation = null, meth = 'POST'){

    // SE CALCULA LA LONGITUD DEL ARREGLO DE CAMPOS DE LA TABLA Y SE 
    // RECORRE EN UN FOR PARA VALIDARLOS
    let data = this.fillable.length;
    for (var i = 0; i < data; i++) {

      //  USANDO LA POSICION DEL STRING DE CADA UNO DE LOS CAMPOS DE LA TABLA
      //  ALMACENADOS EN EL ARRAY FILLABLE Y SE USA PARA VALIDAR EL CAMPO
      //  EN EL OBJETO DATA
      if((this.data[ this.fillable[i] ] == '' && this.fillable[i] != 'priority') && this.data_type[ this.fillable[i] ].required ){
        Alert.alert('Error', '[ '+this.fillable[i]+'] Debe completar todos los campos presentes en el formulario ->'+JSON.stringify(this.data));
        return false;
      }else{
        let type = this.data_type[ this.fillable[i] ].type
        if( !this.valid( type.capitalize(), this.fillable[i] ) ){
          Alert.alert('Error', 'Error de tipo para el dato '+this.data_type[ this.fillable[i] ].alias );
          return false;
        }
      }
    }
    let resp = super.push('guest', meth, navigation);
  }

}