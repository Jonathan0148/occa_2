import { Component, Input, OnInit } from '@angular/core';
import { NavParams,NavController, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { LoadingService } from './../../../loading.service';
import {Http, Headers} from '@angular/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ChangeDetectorRef } from '@angular/core';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-accion',
  templateUrl: './accion.page.html',
  styleUrls: ['./accion.page.scss'],
})
export class AccionPage implements OnInit {
  @Input() value: any;
  matches: String[];

  public image: any;
  public stbase64Image: string;
  private stbase64ImageAux: string="assets/img/img-icon3.png";
  public apiUrl: string;
  public onAccionForm: FormGroup;
  myListener: any;

  dataAux: any;
  dataCat: any;
  lat: any;
  lng: any;
  dataSubCat: any;
  SlEstado: string;
  SlCausa: string;

  TxtDescripcion: string;
  TxtMensaje: any;
  dataNov: any;
  datText: any;
  dataCausa: any;

  Foto: any;
  stRPto: string;
  stRATM: string;
  stRNombre: string;
  stRIDMinuta: string;
  stRAccesoID: string;

  constructor(
    public loading: LoadingService,
    public http: Http,
    private nav: NavController,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private camera: Camera,
    private speechRecognition: SpeechRecognition,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private toastCtrl: ToastController,
    public alertController: AlertController,
    private geolocation: Geolocation,
    public navParams: NavParams
  ) {
    this.getEstado();

    this.getPermission();
    //this.stbase64ImageAux="assets/img/img-icon.png";
    this.stRPto = navParams.get("stRPto");
    this.stRATM = navParams.get("stRATM");
    this.stRNombre = navParams.get("stRNombre");
    this.stRIDMinuta = navParams.get("stRIDMinuta");
    this.stRAccesoID= navParams.get("stRAccesoID");
    this.GetCausa();
  }

  ngOnInit() {
    this.image = this.sanitizer.bypassSecurityTrustStyle(this.value);
    this.getCurrentPosition();
    this.onAccionForm = this.formBuilder.group({
      'SlEstado': [null, Validators.compose([
        Validators.required
      ])
    ],
    'SlCausa': [null, Validators.compose([
      Validators.required
    ])
    ],

'datText': [null, Validators.compose([
  Validators.required
])
],





    });
  }

  closeModal() {
    //this.myListener.unsubscribe();
    this.modalCtrl.dismiss();
  }

  closeRegistro() {
    //this.myListener.unsubscribe();
    this.modalCtrl.dismiss("1");
  }

  async presentToast(stRMensaje) {
       const toast = await this.toastCtrl.create({
         message: stRMensaje,
         duration: 4000
       });
       toast.present();
     }

  getCurrentPosition(){
  this.geolocation.getCurrentPosition()
    .then(position => {

      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      console.log (this.lat);
      console.log (this.lng);
      //this.latLng = new GoogleMapsLatLng(lat, lng)

      //this.loadMap();
  });
}

  private FCapturarFoto(){
    this.camera.getPicture({
       destinationType: this.camera.DestinationType.DATA_URL,
       encodingType: this.camera.EncodingType.JPEG,
       mediaType: this.camera.MediaType.PICTURE,
       correctOrientation: true,
       sourceType:this.camera.PictureSourceType.CAMERA,
       //cameraDirection: 1,
        quality: 50
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.stbase64ImageAux = "data:image/jpeg;base64," + imageData;
        this.stbase64Image = imageData;
        //this.Foto = imageData.replace("+","__");
    }, (err) => {
        console.log(err);
    });
}

async presentAlertConfirm() {
   const alert = await this.alertController.create({
     header: 'Confirmar',
     message: '¿Está Seguro(a) de Guardar la Acción del Requerimiento?',
     buttons: [
       {
         text: 'Cancelar',
         role: 'cancel',
         cssClass: 'secondary',
         handler: (blah) => {
           console.log('Confirm Cancel: blah');
         }
       }, {
         text: 'Guardar',
         handler: () => {
           this.SrProcesaIngreso();
         }
       }
     ]
   });
   await alert.present();
}

startListening() {
                let options = {
                  language: 'es-CO'
                }
                this.myListener =this.speechRecognition.startListening().subscribe(matches => {
                  this.datText = matches[0];
                  this.cd.detectChanges();
                });
                //this.isRecording = true;
    }


    private GetCausa()
    {
      this.loading.present();
      this.SrBuscaCausa().then(data => {

                if(data["Table1"] != null) {
                  this.dataCausa=data["Table1"];

                  console.log(data);
                }
          });
          this.loading.dismiss();
    }
    private SrBuscaCausa() {
          this.apiUrl =  this.loading.m_UrlWS +'/GetCausas';
          //console.log(this.apiUrl);
          //this.apiUrl = 'http://192.168.0.5:14757/WSIdentificacion.asmx/Identificacion?stRFoto='+stRFotoAux;
          //let creds = JSON.stringify({stRFoto: this.stRFoto});
          //postData.append('stRFoto' , stRFotoAux);
          let headers = new Headers();
          headers.append('Content-Type', 'application/x-www-form-urlencoded');

          let params = 'stRId=' + this.stRIDMinuta +'&stREstado=-1&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
          //let params='';
          console.log(this.apiUrl + '?' + params);

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


private getEstado()
{
    this.loading.present();
  this.SrBuscaEstado().then(data => {

            if(data["Table1"] != null) {
              this.dataAux=data["Table1"];

              console.log(data);
            }
      });
      this.loading.dismiss();
}
private SrBuscaEstado() {
      this.apiUrl =  this.loading.m_UrlWS +'/GetEstadoTicket';
      //console.log(this.apiUrl);
      //this.apiUrl = 'http://192.168.0.5:14757/WSIdentificacion.asmx/Identificacion?stRFoto='+stRFotoAux;
      //let creds = JSON.stringify({stRFoto: this.stRFoto});
      //postData.append('stRFoto' , stRFotoAux);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');

      let params = 'stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
      //let params='';
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



SrIngresar(formData){
  console.log('Ingresa Form ' + this.SlEstado);
  this.presentAlertConfirm();

}

private SrProcesaIngreso(){
  this.loading.present();

  this.SrIngresaAccion().then(data => {

            if(data["Table1"] != null) {
              this.dataNov=data["Table"];

              console.log(data["Table1"][0].RESP);
              if(data["Table1"][0].RESP=='OK')
              {
                this.presentToast('Registro Guardado Satisfactoriamente');
                this.closeRegistro();
              }
              else{
                  this.presentToast('Error al Guardar Registro');
              }
            }
            this.loading.dismiss();
      });

}

private SrIngresaAccion() {
      this.apiUrl = this.loading.m_UrlWS + '/setIngresaAccion';
      //console.log(this.apiUrl);
      //this.apiUrl = 'http://192.168.0.5:14757/WSIdentificacion.asmx/Identificacion?stRFoto='+stRFotoAux;
      //let creds = JSON.stringify({stRFoto: this.stRFoto});
      //postData.append('stRFoto' , stRFotoAux);
      let headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      //console.log(this.m_puesto);
      //let foto = this.stbase64Image;
      //let nfoto = foto.replace("+", ".");

      let params = 'stRMinuta=' + this.stRIDMinuta + '&stRAccesoID=' + this.stRAccesoID + '&stRCausaID=' + this.SlCausa + '&stREmpleado='+ this.loading.m_Empleado +'&stREstado=' + this.SlEstado +'&stRDescripcion=' + this.datText + '&stRFoto=' + this.stbase64Image + '&stRLat=' + this.lat + '&stRLon='+ this.lng + '&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;;
      //let params='';
      console.log(params);
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



getPermission() {
  this.speechRecognition.hasPermission()
    .then((hasPermission: boolean) => {
    if (!hasPermission) {
      this.speechRecognition.requestPermission();
    }
    });
  }


}
