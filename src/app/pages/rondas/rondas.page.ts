import { Component, OnInit } from '@angular/core';
import { TranslateProvider } from '../../providers';
import { ModalController } from '@ionic/angular';
import { NavParams, NavController } from '@ionic/angular';
import { LoadingService } from '../../loading.service';
import {Http, Headers} from '@angular/http';
import { Platform, AlertController, ToastController } from '@ionic/angular';
//import { RonpuntosPage } from './../rondas/ronpuntos/ronpuntos.page';
import { VerreqPage } from './../rondas/verreq/verreq.page';
import { FacialbasPage } from './../rondas/facialbas/facialbas.page';

import { BaseptoPage } from './../rondas/basepto/basepto.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
//import { GooglerPage } from './../../modal/googler/googler.page';
import { ActionSheetController } from '@ionic/angular';
import { ReqdetallePage } from './../rondas/reqdetalle/reqdetalle.page';
import { AccionPage } from './../rondas/accion/accion.page';
import { ProveedorPage } from './../rondas/proveedor/proveedor.page';
import { NoaccesoPage } from './../rondas/noacceso/noacceso.page';
@Component({
  selector: 'app-rondas',
  templateUrl: './rondas.page.html',
  styleUrls: ['./rondas.page.scss'],
})
export class RondasPage implements OnInit {
  private stLRutaImg="../../assets/img/";
  private stLUrl: string;
  private dataAux: any;

  tagId: string;
  tagMsg: string;
  public apiUrl: string;
  dataAux1: any;
  stLNomPunto: string;
  stLColor: string;
  stLLink: string;
  dataNov: any;
  myListener: any;
  stLEmpleado: string;
  stLPuntoID: string;
  stLATM: string;
  stLFoto: string;
  lat: any;
  lng: any;
  stLAsistenciaActiva: any;

  constructor(private translate: TranslateProvider,
    private nav: NavController,
    private modalCtrl: ModalController,
    private loading: LoadingService,
    public platform: Platform,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private geolocation: Geolocation,
    private actionSheetController: ActionSheetController,

    private http: Http) {
      this.getPuntosRonda();
     }

  ngOnInit() {
    this.GetCurrentPosition();
  }

GetCurrentPosition(){
  this.geolocation.getCurrentPosition()
  .then(position => {

    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;

  });
}

async presentToast(stRMensaje) {
  const toast = await this.toastCtrl.create({
  message: stRMensaje,
  duration: 4000
  });
  toast.present();
}


  private getPuntosRonda()
{
  this.loading.present();
  this.SrBuscaPuntoRonda().then(data => {

    if(data["Table1"] != null) {
      this.dataAux=data["Table1"];
      //console.log(data);
            }
    });
    this.loading.dismiss();
}
private SrBuscaPuntoRonda() {
  this.stLUrl = this.loading.m_UrlWS + '/GetdataRutaOCCA';
  let headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  let params = 'stREmpleadoAsig=' + this.loading.m_Empleado +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
  console.log(this.stLUrl + '?' + params );
  return new Promise(resolve => {
    this.http.post(this.stLUrl,params,{headers: headers}).subscribe(data => {
    if(data.json()!=null){
      resolve(data.json());
    }
    else
      resolve(false);
    });
  });

}


async PresentOption(stROpcion) {
  console.log("opcion: " + stROpcion);
}
async presentAccesos(stRPuntoID, stRATM, stRNomPunto, stREstado) {

  if(stREstado=="0" || stREstado=="2")
  {
    //if(this.SrAsistenciaActiva()==true)
    //{
    this.presentfacialbas(stRPuntoID, stRATM, stRNomPunto, stREstado)
    //}
    //else{
    //  this.presentToast('Advertencia: Debe Abrir su Turno de Trabajo para Acceder al ATM');
    //}
  }
  /*
  if(stREstado=="1")
  {
    this.presentbasepto(stRPuntoID, stRATM, stRNomPunto)
  }
  */

}


private SrProcesaActualiza(){
  this.loading.present();
  this.SrActualizaRonda().then(data => {
    if(data["Table1"] != null) {
      this.dataNov=data["Table1"];
      //console.log(data["Table"][0].RESP);
      if(data["Table1"][0].RESP=='OK')
      {
        this.presentToast('Inicia Operación');
        this.getPuntosRonda();
        //this.closeModal();
      }
      else{
        this.presentToast('Error al Iniciar Operación');
      }
    }
  });
  this.loading.dismiss();
}

private SrActualizaRonda() {
  this.apiUrl = this.loading.m_UrlWS +'/setActualizaAccessATM';
  //console.log(this.apiUrl);
  let headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  //console.log(this.m_puesto);
  let params = 'stRPuntoID=' +this.stLPuntoID +'&stREmpleadoASIG='+ this.loading.m_Empleado +'&stRFoto='+ this.stLFoto +'&stRLat='+ this.lat +'&stRLon='+ this.lng +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;;
  //let params='';
  //console.log(params);
  return new Promise(resolve => {
    this.http.post(this.apiUrl,params,{headers: headers}).subscribe(data => {
    if(data.json()!=null){
      resolve(data.json());
    }
    else
      resolve(false);
    });
  });
}


async presentfacialbas(stRPuntoID: string, stRATM: string, stRNomPunto: string, stREstado: string) {
  this.stLPuntoID=stRPuntoID;
  this.stLATM=stRATM;
  this.stLNomPunto=stRNomPunto;
  this.stLEmpleado=this.loading.m_Empleado;

  const modal = await this.modalCtrl.create({
    component: FacialbasPage,
    componentProps: { stREmpleado: this.stLEmpleado }
  });
  modal.onDidDismiss()
  .then((data) => {
     //console.log("foto");
     this.stLFoto=data.data;
     //console.log(this.stLFoto.length);
     if(this.stLFoto.length>1)
     {

       this.presentToast('Bienvenido al ATM: ' + this.stLATM + ' - ' + this.stLNomPunto);
       this.stLLink="En Operación";
       this.stLColor="warning";
       this.SrProcesaActualiza();

     }
     else{
       this.presentToast('Error: Empleado no Valido');
     }

 });

  return await modal.present();
}


async presentbasepto(stRPto: string,stRATM: string, stRNombre: string) {
  const modal = await this.modalCtrl.create({
  component: BaseptoPage,
  componentProps: { stRPto: stRPto, stRNombre: stRNombre, stRATM: stRATM }
  });
  modal.onDidDismiss()
   .then((data) => {
     this.getPuntosRonda();
 });

  return await modal.present();
}



PresentWaze(stRLat: string, stRLon: string, stRNombre: string, stREstado: string, stRPtoID: string)
{
  //if(stREstado=='1')
  //{
    console.log('waze' + stRLat)
    let destination = stRLat + ',' + stRLon;

      if(this.platform.is('ios')){
        window.open('maps://?q=' + destination, '_system');
      } else {
        let label = encodeURI(stRNombre);
        window.open('geo:0,0?q=' + destination + '(' + label + ')', '_system');
      }
  //}
  //else{
  //  if(stREstado=='1')
  //  {
  //    this.presentbasepto(stRPtoID, stRNombre, stRTAGID);
  //  }
  //}
}
/*
  async PresentVerreq(stRPto: string, stRATM: string, stRNombre: string) {
    //console.log(stREmpleado);
    const modal = await this.modalCtrl.create({
    component: VerreqPage,
    componentProps: { stRPto: stRPto, stRATM: stRATM, stRNombre: stRNombre, stRNOAccion: "1" }
    });
    modal.onDidDismiss()
    .then((data) => {
      this.getPuntosRonda();

  });
   return await modal.present();
  }
*/

  async presentreqdetalle(stRIDMinuta: string, stRPto:string) {
    const modal = await this.modalCtrl.create({
      component: ReqdetallePage,
      componentProps: { stRPto: stRPto, stRIDMinuta: stRIDMinuta}
    });
    return await modal.present();
  }


  private SrBuscaParametrosAcciones(stRIDMinuta: string) {
    this.apiUrl = this.loading.m_UrlWS +'/GetAccionesMinuta';
    //console.log(this.apiUrl);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //console.log(this.m_puesto);
    let params = 'stRIDMinuta=' + stRIDMinuta + '&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;;
    //let params='';
    //console.log(params);
    return new Promise(resolve => {
      this.http.post(this.apiUrl,params,{headers: headers}).subscribe(data => {
      if(data.json()!=null){
        resolve(data.json());
      }
      else
        resolve(false);
      });
    });
  }

private SrGetAccionesMinutas(stRIDMinuta: string, stRPto: string,  stRATM: string, stRNomPunto: string, stREstado: string, stRAccesoID: string) {
  console.log("ID Minuta" + stRIDMinuta);
  let stLAcompanamiento='';
  let stLLLegada='';
  let stLLLegadaProv='';

  this.loading.present();
  this.SrBuscaParametrosAcciones(stRIDMinuta).then(data => {
    if(data["Table1"] != null) {
      this.dataNov=data["Table1"];
      //console.log(data["Table"][0].RESP);
      if(data["Table1"][0].Error_Code=='0')
      {
        stLAcompanamiento=data["Table1"][0].MINUTA_ACOMPANAMIENTO;
        stLLLegada=data["Table1"][0].MINUTA_LLEGADA_A_TIEMPO;
        stLLLegadaProv=data["Table1"][0].MINUTA_CHECK_LLEGADA_PROVEEDOR;
        this.presentActionSheet(stRIDMinuta,stRPto,stRATM,stRNomPunto,stREstado,stLAcompanamiento,stLLLegada,stLLLegadaProv,stRAccesoID)
        //this.closeModal();
      }
      else{
        this.presentToast('Error al Obtener los Parámetros para las Acciones');
        stLAcompanamiento='0';
        stLLLegada='0';
        stLLLegadaProv='0';

      }
    }
  });
  this.loading.dismiss();
}
  async presentActionSheet(stRIDMinuta: string, stRPto: string,  stRATM: string, stRNomPunto: string, stREstado: string, stLAcompanamiento: string,stLLLegada: string,stLLLegadaProv: string, stRAccesoID: string) {
    //console.log("ID Minuta" + stRIDMinuta);

    //
    //Valida LLegada a Punto
    if(stLLLegada=='0')
    {
      const actionSheet = await this.actionSheetController.create({
        header: 'Acciones',
        cssClass: 'my-custom-class',
        buttons: [
          {
            text: 'Ver Ticket',
            handler: () => {
              this.presentreqdetalle(stRIDMinuta, stRPto);
            }
          },
          {
          text: 'Llegada a Sitio',
          handler: () => {
            this.presentLlegadaConfirm(stRIDMinuta);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }]
      });
      await actionSheet.present();
    }
    else{
      if(stLLLegada=='1')
      {
        if(stLAcompanamiento=='0')
        {
          //Valida Estado
          if(stREstado=='0')
          {
            const actionSheet = await this.actionSheetController.create({
              header: 'Acciones',
              cssClass: 'my-custom-class',
              buttons: [
                {
                  text: 'Ver Ticket',
                  handler: () => {
                    this.presentreqdetalle(stRIDMinuta, stRPto);
                  }
                },

              {
                text: 'Notificar NO Acceso',
                handler: () => {
                  //this.presentProveedor();
                  this.presentnoacceso(stRPto, stRATM, stRNomPunto, stRIDMinuta)
                }
              },
              {
                text: 'Reportar Ingreso al Banco',
                handler: () => {
                  this.presentAccesos(stRPto, stRATM, stRNomPunto, stREstado)
                }
              },
              {
                text: 'Cancelar',
                icon: 'close',
                role: 'cancel'
              }]
            });
            await actionSheet.present();
          }
          else{
            if(stREstado=='1')
            {
              const actionSheet = await this.actionSheetController.create({
                header: 'Acciones',
                cssClass: 'my-custom-class',
                buttons: [
                  {
                    text: 'Ver Ticket',
                    handler: () => {
                      this.presentreqdetalle(stRIDMinuta, stRPto);
                    }
                  },

                {
                  text: 'Notificar NO Acceso',
                  handler: () => {
                    //this.presentProveedor();
                    this.presentnoacceso(stRPto, stRATM, stRNomPunto, stRIDMinuta)
                  }
                },
                {
                  text: 'Atender Ticket',
                  handler: () => {
                    //this.presentProveedor();
                    this.presentReqAccion(stRIDMinuta,stRPto, stRATM, stRNomPunto, stRAccesoID)
                  }
                },
                {
                  text: 'Cancelar',
                  icon: 'close',
                  role: 'cancel'
                }]
              });
              await actionSheet.present();
            }
          }
          //Fin Estado
        }
        else{
          if(stLAcompanamiento=='1')
          {
            if(stLLLegadaProv=='0')
            {
              const actionSheet = await this.actionSheetController.create({
                header: 'Acciones',
                cssClass: 'my-custom-class',
                buttons: [
                  {
                    text: 'Ver Ticket',
                    handler: () => {
                      this.presentreqdetalle(stRIDMinuta, stRPto);
                    }
                  },
                 {
                  text: 'Llegada de Proveedor',
                  handler: () => {
                    this.presentProveedor(stRIDMinuta);
                  }
                },
                {
                  text: 'Notificar NO Acceso',
                  handler: () => {
                    //this.presentProveedor();
                    this.presentnoacceso(stRPto, stRATM, stRNomPunto, stRIDMinuta)
                  }
                },

                {
                  text: 'Cancelar',
                  icon: 'close',
                  role: 'cancel'
                }]
              });
              await actionSheet.present();
            }
            //Fin No llegada del Proveedor
            else{
              if(stLLLegadaProv=='1')
              {
                //Valida Estado
                if(stREstado=='0')
                {
                  const actionSheet = await this.actionSheetController.create({
                    header: 'Acciones',
                    cssClass: 'my-custom-class',
                    buttons: [
                      {
                        text: 'Ver Ticket',
                        handler: () => {
                          this.presentreqdetalle(stRIDMinuta, stRPto);
                        }
                      },

                    {
                      text: 'Notificar NO Acceso',
                      handler: () => {
                        //this.presentProveedor();
                        this.presentnoacceso(stRPto, stRATM, stRNomPunto, stRIDMinuta)
                      }
                    },
                    {
                      text: 'Reportar Ingreso al Banco',
                      handler: () => {
                        this.presentAccesos(stRPto, stRATM, stRNomPunto, stREstado)
                      }
                    },
                    {
                      text: 'Cancelar',
                      icon: 'close',
                      role: 'cancel'
                    }]
                  });
                  await actionSheet.present();
                }
                else{
                  if(stREstado=='1')
                  {
                    const actionSheet = await this.actionSheetController.create({
                      header: 'Acciones',
                      cssClass: 'my-custom-class',
                      buttons: [
                        {
                          text: 'Ver Ticket',
                          handler: () => {
                            this.presentreqdetalle(stRIDMinuta, stRPto);
                          }
                        },

                      {
                        text: 'Notificar NO Acceso',
                        handler: () => {
                          //this.presentProveedor();
                          this.presentnoacceso(stRPto, stRATM, stRNomPunto, stRIDMinuta)
                        }
                      },
                      {
                        text: 'Atender Ticket',
                        handler: () => {
                          //this.presentProveedor();
                          this.presentReqAccion(stRIDMinuta,stRPto, stRATM, stRNomPunto, stRAccesoID)
                        }
                      },
                      {
                        text: 'Cancelar',
                        icon: 'close',
                        role: 'cancel'
                      }]
                    });
                    await actionSheet.present();
                  }
                }
                //Fin Estado
              }
            }
            //Fin SI llegada del Proveedor
          }
        }
        //Fin Acompanamiento
      }
      //Fin Llegada
    }

  /*
  if(stREstado=='0')
  {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Ver Ticket',
          handler: () => {
            this.presentreqdetalle(stRIDMinuta, stRPto);
          }
        },
        {
        text: 'Llegada a Sitio',
        handler: () => {
          this.presentLlegadaConfirm(stRIDMinuta);
        }
      }, {
        text: 'Llegada de Proveedor',
        handler: () => {
          this.presentProveedor(stRIDMinuta);
        }
      },
      {
        text: 'Notificar NO Acceso',
        handler: () => {
          //this.presentProveedor();
          this.presentnoacceso(stRPto, stRATM, stRNomPunto)
        }
      },
      {
        text: 'Solicitar Claves',
        handler: () => {
          this.presentAccesos(stRPto, stRATM, stRNomPunto, stREstado)
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  if(stREstado=='1')
  {
    const actionSheet = await this.actionSheetController.create({
      header: 'Acciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Ver Ticket',
          handler: () => {
            this.presentreqdetalle(stRIDMinuta, stRPto);
          }
        },

      {
        text: 'Atender Ticket',
        handler: () => {
          //this.presentProveedor();
          this.presentReqAccion(stRIDMinuta,stRPto, stRATM, stRNomPunto)
        }
      },
      {
        text: 'Cerrar Visita',
        handler: () => {
          //this.presentProveedor();
          this.presentReqAccion(stRPto, stRATM, stRNomPunto, stREstado)
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

*/
}

async presentReqAccion(stRIDMinuta: string, stRPto: string,  stRATM: string, stRNomPunto: string, stRAccesoID: string) {
  const modal = await this.modalCtrl.create({
    component: AccionPage,
    componentProps: { stRIDMinuta: stRIDMinuta, stRPto: stRPto,stRATM: stRATM, stRNombre: stRNomPunto, stRAccesoID: stRAccesoID  }
  });
  modal.onDidDismiss()
   .then((data) => {
     //console.log("foto");

     if(data.data=="1")
     {

      this.getPuntosRonda();
     }

     //this.getEmpleados();
     //this.getPuntosRondaAsignados('1','1');
     //const user = data['data']; // Here's your selected user!
 });
  return await modal.present();
}


///////////////////
 async presentLlegadaConfirm(stRTck: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar Llegada',
      message: '<strong>Realmente desea confirmar su llegada a sitio</strong>',
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            this.SrLlegadaPunto(stRTck);
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });
    await alert.present();
  }

  private SrLlegadaPunto(stRTck: string){
    this.loading.present();
    this.SrProcesaLlegadaPunto(stRTck).then(data => {
      if(data["Table1"] != null) {
        this.dataNov=data["Table1"];
        //console.log(data["Table"][0].RESP);
        if(data["Table1"][0].RESP=='OK')
        {
          this.presentToast('Llegada Registrada');
        }
        else{
          this.presentToast('Error al Registrar Llegada');
        }
      }
    });
    this.loading.dismiss();
  }

  private SrProcesaLlegadaPunto(stRTck: string) {
    //console.log('ENTRA WS = ' + stRTck);


    this.apiUrl = this.loading.m_UrlWS +'/PutLlegada';
    //console.log(this.apiUrl);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //console.log(this.m_puesto);
    let params = 'stRId=' +stRTck +'&stRLat='+ this.lat +'&stRLon='+ this.lng +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;;
    //let params='';
    console.log('params = ' + params);
    return new Promise(resolve => {
      this.http.post(this.apiUrl,params,{headers: headers}).subscribe(data => {
      if(data.json()!=null){
        resolve(data.json());
      }
      else
        resolve(false);
      });
    });
  }

  async presentProveedor(stRTck: string) { //stRPto: string,stRATM: string, stRNombre: string
    const modal = await this.modalCtrl.create({
      component: ProveedorPage,
      componentProps: { stRTicket: stRTck}
    });
    modal.onDidDismiss()
     .then((data) => {
       this.getPuntosRonda();
     });
    return await modal.present();
  }

  async presentnoacceso(stRPto: string,stRATM: string, stRNombre: string, stRIDMinuta: string) {
    const modal = await this.modalCtrl.create({
      component: NoaccesoPage,
      componentProps: { stRPto: stRPto, stRATM: stRATM, stRNombre: stRNombre, stRIDMinuta:stRIDMinuta}
    });
    modal.onDidDismiss()
     .then((data) => {
       this.getPuntosRonda();
     });
    return await modal.present();
  }

}
