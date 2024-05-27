import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateProvider } from '../../../../providers';
import { ModalController } from '@ionic/angular';
import { NavParams,IonSlides, NavController } from '@ionic/angular';
import { LoadingService } from '../../../../loading.service';
import {Http, Headers} from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-rdetalle',
  templateUrl: './rdetalle.page.html',
  styleUrls: ['./rdetalle.page.scss'],
})
export class RdetallePage implements OnInit {

  private stbase64ImageAux: string="assets/img/img-icon3.png";
  private stbase64Image: string="";
  private stLUrl: string;
  private lat: any;
  private lng: any;
  private dataCorr: any;
  private dataAux: any;
  private datText: string="";
  private stLCorreo: string="";
  private dataAuxTipo: any;
  private stLObligaImagen: string="0";
  private stLNovedad: string="1";
  private stLTipoResp: string="";
  private onDetalleForm: FormGroup;
  constructor(private loading: LoadingService,
    private nav: NavController,
    private modalCtrl: ModalController,
    private camera: Camera,
    private http: Http,
    private geolocation: Geolocation,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.GetPermission();
    this.GetCurrentPosition();
    this.onDetalleForm = this.formBuilder.group({
    'datText': [null, Validators.compose([
      //Validators.required
   ])
   ],

   'stbase64ImageAux': [null, Validators.compose([
      //Validators.required
   ])
   ],

    });

  }

  GetCurrentPosition(){
  this.geolocation.getCurrentPosition()
    .then(position => {

      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      //this.latLng = new GoogleMapsLatLng(lat, lng)

      //this.loadMap();
  });
}

SrCapturarFoto(){
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

    }, (err) => {
        console.log(err);
    });
}

SrStartListening() {
  let options = {
    language: 'es-CO'
  }
  this.speechRecognition.startListening().subscribe(matches => {
    //alert(matches[0]);
    this.datText = matches[0];
    this.cd.detectChanges();
  });
              //this.isRecording = true;
}

GetPermission() {
  this.speechRecognition.hasPermission()
  .then((hasPermission: boolean) => {
    if (!hasPermission) {
      this.speechRecognition.requestPermission();
    }
  });
}
  closeModal() {
    this.modalCtrl.dismiss();
  }

  private GetRespuestaCorrecta(stRIDTipoRespuesta: String)
{
  //console.log("Entra " + stRTipoREspuesta);
  //this.GetFunciones('-1','-1');
  this.loading.presentTxt('Oberón Obteniendo Respuesta Correcta...');
  this.SrBuscaRespuestaCorrecta(stRIDTipoRespuesta).then(data => {
  //console.log(data["Table"]);
  if(data["Table"] != null) {
    this.dataCorr=data["Table"][0];
    this.stLNovedad=this.dataCorr.CORRECTA;
    this.datText="";
    //console.log("Correcta " + this.stLNovedad);

  }
});
  this.loading.dismiss();
}

private SrBuscaRespuestaCorrecta(stRIDTipoRespuesta: String) {
  //this.loading.presentTxt('Oberón Obteniendo Minutas...');
  this.stLUrl = 'http://wsoberonvigilantes.azurewebsites.net/WsVigilantes.asmx/GetRespuesta_Correcta';
  let headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  let params = 'stRID_Respuesta=' + stRIDTipoRespuesta + '&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
  console.log(params);
  return new Promise(resolve => {
  this.http.post(this.stLUrl,params,{headers: headers}).subscribe(data => {
    if(data.json()!=null){
      //console.log(data.json());
      //this.loading.dismiss();

       resolve(data.json());
    }
    else
    {
      //this.loading.dismiss();
      resolve(false);
    }
    });
  });

}



}
