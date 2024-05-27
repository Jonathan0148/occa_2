import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NavParams, NavController } from '@ionic/angular';
import { LoadingService } from '../../../loading.service';
import {Http, Headers} from '@angular/http';


@Component({
  selector: 'app-Reqdetalle',
  templateUrl: './Reqdetalle.page.html',
  styleUrls: ['./Reqdetalle.page.scss'],
})
export class ReqdetallePage implements OnInit {
  public apiUrl: string;
  dataAux: any;
  stRPto: string;
  stRIDMinuta: string;
  stLTipo: string;
  stLATM: string;
  stLNombreATM: string;
  stLCategoria: string;
  stLSubCategoria: string;
  stLNovedad: string;
  stLFoto: string;
  stLDescripcion: string;
  stLMinutaCod: string;
  stLFecha: string;
  stLProveedor: string;


  constructor(private nav: NavController,
    private modalCtrl: ModalController,
    public loading: LoadingService,
    public http: Http,
    public navParams: NavParams) {
      this.stRPto = navParams.get("stRPto");
      this.stRIDMinuta = navParams.get("stRIDMinuta");

    }

  ngOnInit() {
    this.getRequerimientos();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  private getRequerimientos()
  {
      this.loading.present();
    this.SrBuscaRequerimientos().then(data => {

              if(data["Table1"] != null) {
                this.dataAux=data["Table1"];


                this.stLTipo=this.dataAux[0].MIN_TIPO_NOMBRE;
                this.stLATM=this.dataAux[0].PUNTO_ATM;
                this.stLNombreATM=this.dataAux[0].PUNTO_NOMBRE;
                this.stLCategoria=this.dataAux[0].MIN_CAT_NOMBRE;
                this.stLSubCategoria=this.dataAux[0].MIN_SUBCAT_NOMBRE;
                this.stLNovedad=this.dataAux[0].MIN_NOVEDA_NOMBRE;
                this.stLDescripcion=this.dataAux[0].MINUTA_DESCRIPCION;
                this.stLMinutaCod=this.dataAux[0].MINUTA_CODIGO;
                this.stLFecha=this.dataAux[0].FECHA + ' - ' + this.dataAux[0].HORA_PROG;
                this.stLFoto= "data:image/jpeg;base64," + this.dataAux[0].FOTO;
                this.stLProveedor=this.dataAux[0].PROV_NOMBRE;
              }
                this.loading.dismiss();

        });

  }
  private SrBuscaRequerimientos() {
        this.apiUrl = this.loading.m_UrlWS + '/GetDetalleTicket';
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        let params = 'stRMinutaID=' + this.stRIDMinuta +'&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
        //console.log(params);
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





}
