class Acciones{
    btnBuscarDoc:boolean;
    esVisible:boolean;
    clAcciones:boolean;
    btnAgregar:boolean;
    btnEliminar:boolean;
    txtTitulo:boolean;
}

class Tabs{
    general:Acciones;
    participantes:Participantes;
    docComplementario:Acciones;
    fase:Acciones;
    usuario:Acciones;
    revision:Acciones;
}

class Participantes{
    esVisible:boolean;
    tabElaboracion:Acciones;
    tabConsenso:Acciones;
    tabAprobacion:Acciones;
    tabHomologacion:Acciones;
}

export class ControlView {
    editar:Tabs;
    nuevo:Tabs;

    constructor(){
        
    let acciones : Acciones ={
        btnAgregar: true,
        btnBuscarDoc: true,
        clAcciones: true,
        esVisible: true,
        btnEliminar: true,
        txtTitulo: true,
    }
    this.editar = new Tabs();
    this.editar.general = Object.assign(new Acciones(),acciones);
    
    this.editar.docComplementario = Object.assign(new Acciones(),acciones);
    this.editar.fase = Object.assign(new Acciones(),acciones);
    this.editar.usuario = Object.assign(new Acciones(),acciones);
    this.editar.revision = Object.assign(new Acciones(),acciones);
    this.editar.participantes = new Participantes();
    this.editar.participantes.esVisible = true;
    this.editar.participantes.tabElaboracion = Object.assign(new Acciones(),acciones);
    this.editar.participantes.tabConsenso = Object.assign(new Acciones(),acciones);
    this.editar.participantes.tabAprobacion = Object.assign(new Acciones(),acciones);
    this.editar.participantes.tabHomologacion = Object.assign(new Acciones(),acciones);

    this.nuevo = new Tabs();
    this.nuevo.general = Object.assign(new Acciones(),acciones);
    
    this.nuevo.docComplementario = Object.assign(new Acciones(),acciones);
    this.nuevo.fase = Object.assign(new Acciones(),acciones);
    this.nuevo.usuario = Object.assign(new Acciones(),acciones);
    this.nuevo.revision = Object.assign(new Acciones(),acciones);
    this.nuevo.participantes = new Participantes();
    this.nuevo.participantes.esVisible = true;
    this.nuevo.participantes.tabElaboracion = Object.assign(new Acciones(),acciones);
    this.nuevo.participantes.tabConsenso = Object.assign(new Acciones(),acciones);
    this.nuevo.participantes.tabAprobacion = Object.assign(new Acciones(),acciones);
    this.nuevo.participantes.tabHomologacion = Object.assign(new Acciones(),acciones);
    }
}