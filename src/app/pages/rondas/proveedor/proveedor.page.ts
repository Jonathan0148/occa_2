import { Component, OnInit } from '@angular/core';
import { TranslateProvider } from '../../../providers';
import { ModalController } from '@ionic/angular';
import { LoadingService } from '../../../loading.service';
import { Http, Headers} from '@angular/http';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { ChangeDetectorRef } from '@angular/core';
import { NavParams,IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.page.html',
  styleUrls: ['./proveedor.page.scss'],
})
export class ProveedorPage implements OnInit {

  private onLlegadaProveedorForm: FormGroup;
  private datContacto: string="";
  private datComentario: string="";
  public datLlegadaChecked: boolean;
  public apiUrl: string;
  private stLTicketID: string="";

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef,
    private loading: LoadingService,
    public platform: Platform,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private http: Http,
    private navParams: NavParams,
  ) {
    this.stLTicketID = navParams.get("stRTicket");
  }

  ngOnInit() {
    this.onLlegadaProveedorForm = this.formBuilder.group({
      'datLlegadaChecked': [null, Validators.compose([
        //Validators.required
     ])
     ],
      'datContacto': [null, Validators.compose([
        //Validators.required
     ])
     ],

     'datComentario': [null, Validators.compose([
        //Validators.optional
     ])
   ]});
  }


  closeModal() {
    this.modalCtrl.dismiss("0");
  }

  async presentToast(stRMensaje) {
    const toast = await this.toastCtrl.create({
    message: stRMensaje,
    duration: 4000
    });
    toast.present();
  }

  SrStartListening() {
    let options = {
      language: 'es-CO'
    }
    this.speechRecognition.startListening().subscribe(matches => {
      //alert(matches[0]);
      this.datComentario = matches[0];
      this.cd.detectChanges();
    });
                //this.isRecording = true;
  }

  public SrIngresarLlegadaProveedor()
  {
    //console.log('proov ' + this.stLTicketID);
    //console.log('proov ' + this.datLlegadaChecked);
    //console.log('proov ' + this.datContacto);
    //console.log('proov ' + this.datComentario);


    if(this.stLTicketID!="")
    {
      this.loading.presentTxt('Oberón Ingresando Registro...');
      this.SrProcesaLlegadaProveedor(this.stLTicketID, this.datLlegadaChecked ? '1' : '0', this.datContacto, this.datComentario).then(data => {
        if(data["Table1"] != null) {
          this.presentToast('Llegada Registrada');
          this.closeModal();
        }
        else{
          this.presentToast('Error al Registrar Llegada');
        }
      });
      this.loading.dismiss();
    }
    else{
      alert("Por favor ingrese todos los datos requeridos");
    }

  }

  private SrProcesaLlegadaProveedor(stRTicket: string, stRLlegada: string, stRContacto: string, stRComentario: string) {
    this.apiUrl = this.loading.m_UrlWS +'/PutLlegadaProvee';
    //console.log(this.apiUrl);
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //console.log(this.m_puesto);
    let params = 'stRId=' +stRTicket +'&stRLlegada='+ stRLlegada +'&stRContacto='+ stRContacto +'&stRComentario='+ stRComentario +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;;
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


}
