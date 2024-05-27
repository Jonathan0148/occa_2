import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {  NavController, PopoverController, Platform, ToastController, AlertController } from '@ionic/angular';

import { LoadingService } from './../../loading.service';
import {Http, Headers} from '@angular/http';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';



@Component({
  selector: 'app-recibir',
  templateUrl: './recibir.page.html',
  styleUrls: ['./recibir.page.scss'],
})
export class RecibirPage implements OnInit {
  private apiUrl: string;
  private  dataAux: any;
  private  dataAux1: any;
  private searchKey: any;
  private stLEmpleado: any;
  private stLNombre: any;
  private stLEstado: string;
  private  stLNFC: string;
  private stLInfo: string;
  private stLRutaImgNFC="../../assets/img/Tag_Red.png";
  private stLRutaImgQR="../../assets/img/QR_RED.png";
  private lat: any;
  private lng: any;
  private scannedData: {};
  private stLNomPunto: any;
  private stLIdPrecinto: any;

   private tagId: string;
   private tagIdBkp  : string;

   private tagMsg: string;
   myListener: any;
   private MinutaID: string;
   constructor(private nav: NavController,
     private modalCtrl: ModalController,
     public loading: LoadingService,
     public http: Http,
     public popoverCtrl: PopoverController,
     private nfc: NFC,
     private ndef: Ndef,
     private platform: Platform,
     private alertController: AlertController,
     private barcodeScanner: BarcodeScanner,
    private geolocation: Geolocation,
     private toastCtrl: ToastController) {
       this.stLEmpleado = this.loading.m_Empleado;
       this.stLNombre = this.loading.m_Apellidos + ' ' +this.loading.m_Nombres;
       this.platform.ready().then(() => {
         //console.log("Entra " + this.loading.m_TipoTAG);
         this.stLNFC=this.loading.m_TipoTAG;
         this.getCurrentPosition();
         /*
         if(this.loading.m_TipoTAG=="NFC")
         {
           this.addListenNFC();
         }
         */

       });
      }

     ngOnInit() {
       this.getPuntosRonda();
       //this.getPuntosRondaAsignados(this.loading.m_UbicacionID,'1');
     }

     private getCurrentPosition(){

     //let options = {timeout: 5000, enableHighAccuracy: true};
     this.geolocation.getCurrentPosition()
     .then(position => {
         this.lat = position.coords.latitude;
         this.lng = position.coords.longitude;
     });
     }

     closeModal() {
       this.myListener.unsubscribe();
       this.modalCtrl.dismiss();
     }


     private getPuntosRonda()
     {

         this.loading.present();
       this.SrBuscaPuntos().then(data => {

                 if(data["Table1"] != null) {
                   this.dataAux=data["Table1"];

                   this.stLEstado=this.dataAux[0].Estado;
                   if (this.stLEstado=="0") {
                     this.stLInfo=this.dataAux[0].Info;
                   }
                   //console.log(this.dataAux[0]["OPE_PTO_NOMBRE"]);
                   //console.log(data);
                 }
           });
           this.loading.dismiss();
     }

     private SrBuscaPuntos() {
           this.apiUrl =  this.loading.m_UrlWS + '/GetPrecintosEstado';

           //this.apiUrl = 'http://192.168.0.5:14757/WSIdentificacion.asmx/Identificacion?stRFoto='+stRFotoAux;
           //let creds = JSON.stringify({stRFoto: this.stRFoto});
           //postData.append('stRFoto' , stRFotoAux);
           let headers = new Headers();
           headers.append('Content-Type', 'application/x-www-form-urlencoded');

           //let params = 'stRUbicacionID=' + stRPuesto;
           //let params = 'stRUbicacionID=' + stRUbicacion + '&stRTipoPuntos=' + stRTipoPuntos +'&stREmpleado=' + this.loading.m_Empleado;
           let params='inREstaBase=2&stRBusqueda=0&stRBusqATM=NULL&stRCiudadOP=' + this.loading.m_CiudadOP +'&stREmpleadoAsig=' + this.loading.m_Empleado +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
           console.log(this.apiUrl + '?' + params);
           //console.log(params);
           return new Promise(resolve => {
               //this.http.post('http://192.168.3.8:1368/icwebmobile/consulta_puestos.php', creds, {headers: headers})
               this.http.post(this.apiUrl,params,{headers: headers}).subscribe(data => {
                   if(data.json()!=null){
                     //console.log(data.json());

                      resolve(data.json());



                   }
                   else
                       resolve(false);

               });
               });

     }

     SrCodigoQR(stRIdPrecinto: string, stRNomPunto: string) {
       this.barcodeScanner.scan().then(barcodeData => {
        console.log('Barcode data', barcodeData);

        this.scannedData = barcodeData;
        this.tagIdBkp=this.scannedData["text"];
        var re= /\+/gi;
        this.tagId=this.tagIdBkp.replace(re,'@');
        this.stLNomPunto=stRNomPunto;
        this.stLIdPrecinto=stRIdPrecinto;
        //this.GetPuntosEstado();
        this.SetWS();
        //alert(this.scannedData["text"] );

       }).catch(err => {
           console.log('Error', err);
       });
     }


     async presentToast(stRMensaje) {
       const toast = await this.toastCtrl.create({
         message: stRMensaje,
         duration: 2000
       });
       toast.present();

     }
     addListenNFC(stRIdPrecinto: string, stRNomPunto: string) {
       //console.log('entra a addListenNFC');


       //this.MinutaID=stRMinutaID;

       this.myListener = this.nfc.addNdefListener(() => {
         this.presentToast('NFC Detectado Satisfactoriamente');
         //console.log('successfully attached ndef listener');
       }, (err) => {
         this.presentToast('error al Detectar el NFC del Dispositivo');
         //console.log('error attaching ndef listener', err);
       }).subscribe((event) => {
         this.tagId=this.nfc.bytesToHexString(event.tag.id);
         //this.presentToast('ID' + this.tagId);
         if(this.tagId!=null)
         {
           this.tagId="APP_CCO" + this.tagId;
           this.stLNomPunto=stRNomPunto;
           this.stLIdPrecinto=stRIdPrecinto;
           this.SetWS();
           this.myListener.unsubscribe();
           //this.presentToast('Validar TAG en BD: ' +  this.tagId);
           //this.presentpregunta();
           //this.SetValidaTAG();
         }

       });


     }

     private SetWS()
    {

        this.loading.present();
        this.SrInsertaWS().then(data1 => {
        if(data1["Table1"] != null) {
          this.dataAux1=data1["Table1"];
          if(this.dataAux1[0].RESP=="0")
          {
            //this.presentAlertConfirmEstado();
            this.presentToast("Precinto Entregado Exitosamente");
            this.getPuntosRonda();
          }
          else{
            this.presentToast("Error: El Precinto NO pudo ser Entregado al Supervisor");
            //this.getPuntosRonda();
          }
        }
        else{
          this.presentToast("Error: El Precinto NO pudo ser Entregado al Supervisor");
          //this.getPuntosRonda();
        }
      });
      this.loading.dismiss();
    }


    private SrInsertaWS() {
      this.apiUrl =  this.loading.m_UrlWS + '/setEstadoPrecintos';
      //console.log(this.apiUrl);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      //let params = 'stRTagID=' + this.tagId + '&stRTagID=' + this.loading.m_CiudadOP + '&inREstado=1' + '&stRValidacion=0' + '&stRUsuario=' + this.loading.m_Apellidos + ' ' +this.loading.m_Nombres +'&stREmpleado=' + this.stLEmpleado +'&stRPuntoID=' + "" +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;

      let params = 'stRTagID=' + this.tagId + '&stRIdPrecinto=' + this.stLIdPrecinto + '&stRCiudadOP=' + this.loading.m_CiudadOP + '&stRTipoTAG=' + this.stLNFC + '&inREstado=3' + '&stRValidacion=0&stREmpleadoING=' + this.loading.m_Empleado + '&stRUsuario=&stREmpleado=' + this.loading.m_Empleado + '&stRPuntoID=' + "" +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
      //let params='';
      alert(this.apiUrl + '?' + params);
      return new Promise(resolve => {
        //this.http.post('http://192.168.3.8:1368/icwebmobile/consulta_puestos.php', creds, {headers: headers})
        this.http.post(this.apiUrl,params,{headers: headers}).subscribe(data => {
        if(data.json()!=null){
          resolve(data.json());
        }
        else
          resolve(false);
        });
      });
   }
     private getItems(stREvent)
     {
       console.log(this.searchKey);

     }

     private getATMBusqueda()
     {
         this.loading.present();
       this.SrBuscaPuntosBusqueda(this.searchKey).then(data => {

             if(data["Table1"] != null) {
               this.dataAux=data["Table1"];

               this.stLEstado=this.dataAux[0].Estado;
               if (this.stLEstado=="0") {
                 this.stLInfo=this.dataAux[0].Info;
               }
               //console.log(this.dataAux[0]["OPE_PTO_NOMBRE"]);
               //console.log(data);
             }
           });
           this.loading.dismiss();
     }


     private SrBuscaPuntosBusqueda(stRBusqueda) {
           this.apiUrl =  this.loading.m_UrlWS + '/GetPrecintosEstado';
           console.log(this.apiUrl);
           //this.apiUrl = 'http://192.168.0.5:14757/WSIdentificacion.asmx/Identificacion?stRFoto='+stRFotoAux;
           //let creds = JSON.stringify({stRFoto: this.stRFoto});
           //postData.append('stRFoto' , stRFotoAux);
           let headers = new Headers();
           headers.append('Content-Type', 'application/x-www-form-urlencoded');

           //let params = 'stRUbicacionID=' + stRPuesto;
           //let params = 'stRUbicacionID=' + stRUbicacion + '&stRTipoPuntos=' + stRTipoPuntos +'&stREmpleado=' + this.loading.m_Empleado;
           //let params='stRNombre=' + stRBusqueda + '&stREmpleado=' + this.stLEmpleado +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
           let params='inREstaBase=2&stRBusqueda=1&stRBusqATM=' + stRBusqueda + '&stRCiudadOP=' + this.loading.m_CiudadOP +'&stREmpleadoAsig=' + this.loading.m_Empleado +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;

           return new Promise(resolve => {
               //this.http.post('http://192.168.3.8:1368/icwebmobile/consulta_puestos.php', creds, {headers: headers})
               this.http.post(this.apiUrl,params,{headers: headers}).subscribe(data => {
                   if(data.json()!=null){
                     //console.log(data.json());

                      resolve(data.json());



                   }
                   else
                       resolve(false);

               });
               });

     }

}
