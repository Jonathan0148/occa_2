import { Component, OnInit } from '@angular/core';
import { TranslateProvider } from '../../providers';
import { ModalController } from '@ionic/angular';
import { NavParams, NavController } from '@ionic/angular';
import { LoadingService } from '../../loading.service';
import {Http, Headers} from '@angular/http';
import { InspeccionPage } from './../rondasatm/inspeccion/inspeccion.page';
//import { ResumenPage } from './../minutas/resumen/resumen.page';

@Component({
  selector: 'app-rondasatm',
  templateUrl: './rondasatm.page.html',
  styleUrls: ['./rondasatm.page.scss'],
})
export class RondasatmPage implements OnInit {

  private TabPosition: string='0';
  private stLColorTabAct: string='secondary';
  private stLColorTabInac: string='primary';
  private stLColorTab1: string;
  private stLColorTab2: string;
  private stLColorTab3: string;
  private stLRutaImgSA="../../assets/img/Tag_SA.png";
  private stLRutaImgASI="../../assets/img/Tag_ASIG.png";
  private stLRutaImgINSTALL="../../assets/img/Tag_INSTALL.png";

  private stLUrl: string;
  private stLEstadoRON: string='1';
  private searchKey: string;

  private dataAux: any;
  private dataAsignados: any;
  private dataInstalados: any;
  private dataAux1: any;

  constructor(private translate: TranslateProvider,
    private nav: NavController,
    private modalCtrl: ModalController,
    private loading: LoadingService,
    private http: Http) {
      this.stLColorTab1=this.stLColorTabAct;
      this.stLColorTab2=this.stLColorTabInac;
      this.stLColorTab3=this.stLColorTabInac;
      this.GetATM();

    }

  ngOnInit() {
    //console.log ("SIGLA " + )
  }

  SrOpenTab(stRTab: string){
    this.TabPosition=stRTab;
    if(stRTab=="0")
    {
      this.stLColorTab1=this.stLColorTabAct;
      this.stLColorTab2=this.stLColorTabInac;
      //this.stLColorTab3=this.stLColorTabInac;
      this.GetATM();
    }
    else if(stRTab=="1")
    {
      this.stLColorTab1=this.stLColorTabInac;
      this.stLColorTab2=this.stLColorTabAct;
      this.stLColorTab3=this.stLColorTabInac;
      //this.GetPuntosAsignados();
      this.GetATM();
    }
    /*
    else if(stRTab=="2")
    {
      this.stLColorTab1=this.stLColorTabInac;
      this.stLColorTab2=this.stLColorTabInac;
      this.stLColorTab3=this.stLColorTabAct;
      this.GetPuntosInstalados();
    }
    */


  }

  private GetATM()
  {
    //this.GetFunciones('-1','-1');
    this.loading.presentTxt('Oberón Obteniendo ATMs...');
    this.SrBuscaATM().then(data => {
    //console.log(data["Table"]);
    if(data["Table1"] != null) {
      this.dataAux=data["Table1"];
      this.loading.dismiss();
    }
    else{
      this.loading.dismiss();
    }
  });

  }

  private SrBuscaATM() {
    //this.loading.presentTxt('Oberón Obteniendo Minutas...');
    this.stLUrl = this.loading.m_UrlWS + '/Get_ATM_Estado_Ronda';
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    if(this.TabPosition=="0")
    {
      this.stLEstadoRON="1";

    }
    if(this.TabPosition=="1")
    {
      this.stLEstadoRON="2";

    }

    let params = 'stRFechaID=' + this.loading.m_RondaID + '&stRId_ZonaOP=' + this.loading.m_ZonaOP + '&stREstatus=1&stREstadoRON=' + this.stLEstadoRON +'&stRBusqueda=0&stRParametro=&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;
    //console.log(this.stLUrl + '?' + params);
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

  private GetATMBusqueda()
  {
    this.loading.present();
    this.SrBuscaATMBusq().then(data => {
    if(data["Table1"] != null) {
      this.dataAux=data["Table1"];

    }

    });
    this.loading.dismiss();
  }
  private SrBuscaATMBusq() {
        this.stLUrl = this.loading.m_UrlWS + '/Get_ATM_Estado_Ronda';
        //console.log(this.stLUrl);
        //this.apiUrl = 'http://192.168.0.5:14757/WSIdentificacion.asmx/Identificacion?stRFoto='+stRFotoAux;
        //let creds = JSON.stringify({stRFoto: this.stRFoto});
        //postData.append('stRFoto' , stRFotoAux);
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');



        if(this.TabPosition=="0")
        {
          this.stLEstadoRON="1";

        }
        if(this.TabPosition=="1")
        {
          this.stLEstadoRON="2";

        }
        let params = 'stRFechaID=' + this.loading.m_RondaID + '&stRId_ZonaOP=' + this.loading.m_ZonaOP + '&stREstatus=1&stREstadoRON=' + this.stLEstadoRON + '&stRBusqueda=1&stRParametro='+ this.searchKey + '&stRUsuarioAPP=' + this.loading.m_UsuarioApp +'&stRPasswordAPP='+ this.loading.m_PasswordApp +'&stRCodigoWSAPP='+ this.loading.m_CodigoWSApp +'&stRIMEI='+ this.loading.m_IMEI;

        //let params = 'stRPuesto=' + this.loading.m_Puesto;
        //console.log(params);
        //let params='';
        return new Promise(resolve => {
            //this.http.post('http://192.168.3.8:1368/icwebmobile/consulta_puestos.php', creds, {headers: headers})
            this.http.post(this.stLUrl,params,{headers: headers}).subscribe(data => {
                if(data.json()!=null){
                  //console.log(data.json());

                   resolve(data.json());



                }
                else
                    resolve(false);

            });
            });

  }



  async PresentInspeccion(stRIDFechaBase: string, stRIdRonda: string, stRIdPunto: string, stRATM: string, stRNomPunto: string) {
    //console.log(stREmpleado);
    const modal = await this.modalCtrl.create({
    component: InspeccionPage,
    componentProps: { stRIDFechaBase: stRIDFechaBase, stRIdRonda: stRIdRonda, stRIdPunto: stRIdPunto, stRATM: stRATM, stRNomPunto: stRNomPunto  }
    });
    modal.onDidDismiss()
    .then((data) => {
      this.SrOpenTab('0');
      //this.getEmpleados();

  });
   return await modal.present();
  }



}
